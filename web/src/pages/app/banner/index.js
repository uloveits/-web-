/** User 系统管理/用户管理 **/

import React from "react";

import P from "prop-types";
import { connect } from "react-redux";
import { Button, Input, Table, message, Radio, Modal, Row, Col, Select } from "antd";
import "./index.scss";

import KtSeparator from "../../../comps/common/separator";
import {onInputChange,onImageChange,onSelectChange,renderCommonSelectOption} from "../../../utils/commonChange";
import Tips from "../../../utils/tips";
import { APP } from "../../../constants";
import KtPictureWall from "../../../comps/common/picturesWall";
import settingApi from "../../../services/api/setting";
import CommonFnc from "../../../utils/commonFnc";
import Validate from "../../../utils/validate";



const { Option } = Select;

@connect(
  state => ({
    user: state.app.user,
    isMobile: state.common.isMobile,
  })
)
export default class AppBannerPage extends React.Component {
  static propTypes = {
    location: P.any,
    history: P.any,
    actions: P.any,
    user: P.any,
  };

  constructor(props) {
    super(props);
    this.state = {
      list : [], // 当前页面全部数据
      roles : [], // 所有的角色信息
      param:{
        active:1
      },//参数数据
      filter:{},//筛选数据

      linkSelect:[],//链接下拉框数据

      loading: false, // 表格数据是否正在加载中

      isModal: false, //模态框是否显示
      modalTitle: '新增', //模态框标题
      modalLoading: false, // 添加/修改/查看 是否正在请求中

      pageNum: 0, // 当前第几页
      pageSize: 10, // 每页多少条
      total: 0, // 数据库总共多少条数据
    };
  }

  componentDidMount() {
    this.getTblList();
    this.getLinkInfo();
  }


  // 查询当前页面所需列表数据
  getTblList = async () => {
    const params = {
      page:this.state.pageNum,
      limit:this.state.pageSize,
      ...this.state.filter
    };
    this.setState({ loading: true });

    let res = await settingApi.bannerList(params);
    console.log('所有banner信息');
    console.log(res)
    this.setState({
      list:res.data,
      total:res.count,
      loading:false,
    })
  };

  //获得链接下拉框
  getLinkInfo = async () => {
    let res = await settingApi.articleList({active:1});
    console.log('获得链接下拉框')
    console.log(res)
    if(res.code === '200') {
      this.setState({
        linkSelect:res.data
      })
    }
  };

  // 搜索
  onSearch() {
    this.getTblList();
  }

  //编辑
  edit = (data) => {
    let _param = Object.assign({}, data)
    _param.type = _param.type.toString();
    this.setState({
      isModal: true,
      modalTitle: '编辑',
      param: _param,
    });
  }

  //新增
  add = () => {
    this.setState({
      isModal: true,
      modalTitle: '新增',
    });
  };

  //删除
  delete = async(data) => {
    await Tips.confirm("确认要删除该banner吗");
    let res = await settingApi.deleteBanner({id:data.id})
    if(res.code === '200') {
      message.success('删除成功！')
      this.getTblList();
    }
  }

  validate = (param) => {

    console.log(param);
    if(!Validate.required(param.name)){
      message.warn("名称不能为空");
      return false
    }
    if(!Validate.required(param.type)){
      message.warn("请选择类别");
      return false
    }
    if(!param.fileList || param.fileList.length <= 0){
      message.warn("请上传图片");
      return false
    }
    if(!Validate.required(param.sort)){
      message.warn("请输入排序号");
      return false
    }
    return true
  }

  //模态框确认
  onOK = async () => {
    let { param,modalTitle } = this.state;
    param.type = param.type&&parseInt(param.type);

    if(!this.validate(param))return
    if(modalTitle === '新增'){
      param.createId = this.props.user.userId;
      let res = await settingApi.addBanner(param);
      if(res.code === '200') {
        message.success("添加成功");
        this.onClose();
        this.getTblList()
      }
    }else {
      let res = await settingApi.updateBanner(param);
      if(res.code === '200') {
        message.success("修改成功");
        this.onClose();
        this.getTblList()
      }
    }
  }

  //模态框关闭
  onClose = () => {
    this.setState({
      isModal: false,
      param:{
        active:1
      }
    });
  }

  // 表单页码改变
  onTablePageChange(page, pageSize) {
    this.setState({
      pageNum:page,
      pageSize:pageSize,
    },()=> {
      this.getTblList(page, pageSize);
    })

  }

  // 构建字段
  makeColumns() {
    let columns = []
    if(this.props.isMobile === 'false') {
      columns = [
        {
          title: "名称",
          dataIndex: "name",
          key: "name"
        },
        {
          title: "备注",
          dataIndex: "remark",
          key: "remark"
        },
        {
          title: "图片",
          dataIndex: "url",
          width:120,
          key: "url",
          render: (text, record) =>
            (
              record.fileList[0] &&
              <img alt="example" style={{ width: '100%' }} mode="widthFix" src={record.fileList[0].url || ''} />
            )
        },
        {
          title: "类型",
          dataIndex: "type",
          key: "type",
          render: (text, record) =>
            (
              <span className='major'>{CommonFnc.getConstantValue(APP.BANNER.TYPE,text)}</span>
            )
        },
        {
          title: "是否上线",
          dataIndex: "active",
          key: "active",
          render: (text, record) =>
            text === 1 ? (
              <span style={{ color: "green" }}>上线</span>
            ) : (
              <span style={{ color: "red" }}>下线</span>
            )
        },
        {
          title: "排序",
          dataIndex: "sort",
          key: "sort"
        },
        {
          title: "创建时间",
          dataIndex: "createTime",
          key: "createTime"
        },
        {
          title: "操作",
          key: "control",
          width: 200,
          render: (text, record) => (
            <div className='align-center'>
              <Button onClick={this.edit.bind(this,record)} type="primary" title="修改" shape="circle" size='small'>改</Button>
              <KtSeparator comp={{width:'5px'}}/>
              <Button onClick={this.delete.bind(this,record)} type="danger" title="删除" shape="circle" size='small'>删</Button>
            </div>
          )
        }
      ];
    }else {
      columns = [
        {
          title: "图片",
          dataIndex: "url",
          width:200,
          key: "url",
          render: (text, record) =>
            (
              record.fileList[0] &&
              <img alt="example" style={{ width: '100%' }} mode="widthFix" src={record.fileList[0].url || ''} />
            )
        },
        {
          title: "操作",
          key: "control",
          render: (text, record) => (
            <div className='align-center'>
              <Button onClick={this.edit.bind(this,record)} type="primary" title="修改" shape="circle" size='small'>改</Button>
              <KtSeparator comp={{width:'5px'}}/>
              <Button onClick={this.delete.bind(this,record)} type="danger" title="删除" shape="circle" size='small'>删</Button>
            </div>
          )
        }
      ];
    }
    return columns;
  }

  //移动端表格适配
  expandedRowRender = (record) => {
    const columns = [
      { title: 'key', dataIndex: 'key', key: 'key', render: (text) => (<span className='muted'>{text}</span>)},
      { title: 'value', dataIndex: 'value', key: 'value', render: (text) => (<span className='weak'>{text}</span>) },
    ];
    const data = [
      {key:'名称',value:record.name},
      {key:'备注',value:record.remark},
      {key:'类型',value:CommonFnc.getConstantValue(APP.BANNER.TYPE,record.type)},
      {key:'是否上线',value:CommonFnc.getConstantValue(APP.ACTIVE,record.active)},
      {key:'排序',value:record.sort},
      {key:'创建时间',value:record.createTime},
    ];
    return <Table columns={columns} dataSource={data} pagination={false} />;
  };

  //搜索重置
  clearSearch = () => {
    this.setState({
      filter:{}
    },()=>{
      this.onSearch()
    })
  }



  render() {
    const { list,isModal } = this.state;

    return (
      <div className='page-content'>
        {/*搜索栏*/}
        <div className='pd10'>
          <Row>
            <Col sm={24} md={8}>
              <div className='pd5'>
                <Row type="flex" align="middle">
                  <Col xs={8} sm={8} md={4}>
                    <span className='font-weight'>类型：</span>
                  </Col>
                  <Col xs={16} sm={16} md={16}>
                    <Select placeholder="请选择状态"
                            allowClear
                            style={{ width: '100%' }}
                            onChange={onSelectChange.bind(this,'filter','type')}
                            value={this.state.filter.type}
                    >
                      {
                        renderCommonSelectOption(APP.BANNER.TYPE)
                      }
                    </Select>
                  </Col>
                </Row>
              </div>
            </Col>
            <Col sm={24} md={8}>
              <div className='pd5'>
                <Row type="flex" align="middle">
                  <Col xs={8} sm={8} md={4}>
                    <span className='font-weight'>状态：</span>
                  </Col>
                  <Col xs={16} sm={16} md={16}>
                    <Select placeholder="请选择状态"
                            allowClear
                            style={{ width: '100%' }}
                            onChange={onSelectChange.bind(this,'filter','active')}
                            value={this.state.filter.active}
                    >
                      <Option value={1}>上线</Option>
                      <Option value={0 }>下线</Option>
                    </Select>
                  </Col>
                </Row>
              </div>
            </Col>
          </Row>
          <Row>
            <Col span={24}>
              <div className='flex-right pd5'>
                <Button icon="search" type="primary" onClick={this.onSearch.bind(this)}>查询</Button>
                <KtSeparator comp={{width:'10px'}}/>
                <Button icon="redo" onClick={this.clearSearch.bind(this)}>重置</Button>
              </div>
            </Col>
          </Row>
        </div>
        <KtSeparator comp={{height:'20px',bgColor:'#F0F2F5'}} />
        {/*正文*/}
        <div className='pd10'>
          <div className='flex-left'>
            <Button type='primary' onClick={this.add.bind(this)}>新增Banner</Button>
          </div>
          <KtSeparator />
          <Table
            columns={this.makeColumns()}
            loading={this.state.loading}
            dataSource={list}
            expandedRowRender={this.props.isMobile === 'false' ? false :this.expandedRowRender}
            pagination={{
              total: this.state.total,
              current: this.state.pageNum,
              pageSize: this.state.pageSize,
              showQuickJumper: true,
              showTotal: (total, range) => `共 ${total} 条数据`,
              onChange: (page, pageSize) =>
                this.onTablePageChange(page, pageSize)
            }}
          />
        </div>

        {/* 新增&修改&查看 模态框 */}
        <Modal
          title={this.state.modalTitle}
          visible={isModal}
          maskClosable={false}
          onOk={this.onOK}
          onCancel={this.onClose}
          confirmLoading={this.state.modalLoading}
          okText="确认"
          cancelText="取消"
        >
          <div>
            <Row type="flex" justify="center" align="middle">
              <Col span={5} className='text-right pr10'><span className='major'>*</span>名称：</Col>
              <Col span={10}>
                <Input placeholder="请输入名称" onChange={onInputChange.bind(this,'param','name')} value={this.state.param.name}/>
              </Col>
            </Row>
            <KtSeparator />
            <Row type="flex" justify="center" align="middle">
              <Col span={5} className='text-right pr10'>备注：</Col>
              <Col span={10}>
                <Input placeholder="请输入备注信息" onChange={onInputChange.bind(this,'param','remark')} value={this.state.param.remark}/>
              </Col>
            </Row>
            <KtSeparator />
            <Row type="flex" justify="center" align="middle">
              <Col span={5} className='text-right pr10'><span className='major'>*</span>类别：</Col>
              <Col span={10}>
                <Select
                  style={{ width: '100%' }}
                  placeholder="请选择"
                  value={this.state.param.type}
                  onChange={onSelectChange.bind(this,'param','type')}
                >
                  {
                    renderCommonSelectOption(APP.BANNER.TYPE)
                  }
                </Select>
              </Col>
            </Row>
            <KtSeparator />
            <Row type="flex" justify="center" align="middle">
              <Col span={5} className='text-right pr10'><span className='major'>*</span>上线/下线：</Col>
              <Col span={10}>
                <Radio.Group onChange={onInputChange.bind(this,'param','active')} value={this.state.param.active}>
                  <Radio value={1}>上线</Radio>
                  <Radio value={0}>下线</Radio>
                </Radio.Group>
              </Col>
            </Row>
            <KtSeparator />
            <Row type="flex" justify="center" align="middle">
              <Col span={5} className='text-right pr10'><span className='major'>*</span>图片：</Col>
              <Col span={10}>
                <KtPictureWall fileList={this.state.param.fileList} onChange={onImageChange.bind(this,'param','fileList')} />
              </Col>
            </Row>
            <KtSeparator />
            <Row type="flex" justify="center" align="middle">
              <Col span={5} className='text-right pr10'>绑定链接：</Col>
              <Col span={10}>
                <Select placeholder="请选择文章"
                        allowClear
                        style={{ width: '100%' }}
                        onChange={onSelectChange.bind(this,'param','linkId')}
                        value={this.state.param.linkId}
                >
                  {
                    renderCommonSelectOption(this.state.linkSelect,'title')
                  }
                </Select>
              </Col>
            </Row>
            <KtSeparator />
            <Row type="flex" justify="center" align="middle">
              <Col span={5} className='text-right pr10'><span className='major'>*</span>排序：</Col>
              <Col span={10}>
                <Input placeholder="请输入排序" onChange={onInputChange.bind(this,'param','sort')} value={this.state.param.sort}/>
              </Col>
            </Row>
          </div>
        </Modal>

      </div>
    );
  }
}
