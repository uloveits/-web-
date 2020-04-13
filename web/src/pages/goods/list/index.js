/** 商品列表**/

import React from "react";

import P from "prop-types";
import { connect } from "react-redux";
import { Button, Input, Table, message, Radio, Modal, Row, Col, Select,Tag,TreeSelect, Badge, Dropdown, Icon  } from "antd";
import "./index.scss";

import KtSeparator from "../../../comps/common/separator";
import {onInputChange,onImageChange,onSelectChange,renderCommonSelectOption} from "../../../utils/commonChange";
import Tips from "../../../utils/tips";
import { APP } from "../../../constants";
import KtPictureWall from "../../../comps/common/picturesWall";
import settingApi from "../../../services/api/setting";
import Validate from "../../../utils/validate";
import goodsApi from "../../../services/api/goods";
import CommonFnc from "../../../utils/commonFnc";



const { Option } = Select;


@connect(
  state => ({
    user: state.app.user,
    isMobile: state.common.isMobile,
  })
)

export default class GoodsListPage extends React.Component {
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
      goodsClassify : [], // 所有的角色信息
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
    this.getGoodsClassify();

  }

  //商品分类下拉框数据
  getGoodsClassify = async() => {
    let res = await goodsApi.classifySelectTree({});
    console.log('商品分类下拉框数据')
    console.log(res)
    this.setState({
      goodsClassify:res.data,
    })
  }

  // 查询当前页面所需列表数据
  getTblList = async () => {
    const params = {
      page:this.state.pageNum,
      limit:this.state.pageSize,
      ...this.state.filter
    };
    this.setState({ loading: true });

    let res = await goodsApi.list(params);
    console.log('所有商品信息');
    console.log(res)
    this.setState({
      list:res.data,
      total:res.count,
      loading:false,
    })
  };

  // 搜索
  onSearch() {
    this.getTblList();
  }

  //编辑
  edit = (data) => {
    this.props.history.push({pathname: `/goods/add`, state: {id: data.id}})
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
    let res = await goodsApi.delete({id:data.id})
    if(res.code === '200') {
      message.success('删除成功！')
      this.getTblList();
    }
  };

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

  //前往商品发布页
  routeToAddGoods = () => {
    this.props.history.push('/goods/add')
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
          title: "价格(元)",
          dataIndex: "price",
          key: "price",
          render: (text, record) =>
            <span className='major'>{CommonFnc.centToYuan(record.skuValue[0].price)}</span>
        },
        {
          title: "分类",
          dataIndex: "goodsClassifyId",
          key: "goodsClassifyId",
          render: (text, record) =>(
            <Tag>{record.classify.name}</Tag>
          )
        },
        {
          title: "实际销量",
          dataIndex: "salesActual",
          key: "salesActual"
        },
        {
          title: "状态",
          dataIndex: "active",
          key: "active",
          render: (text, record) =>
            text === 1 ? (
              <span style={{ color: "green" }}>上架</span>
            ) : (
              <span style={{ color: "red" }}>下架</span>
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
          title: "名称",
          dataIndex: "name",
          key: "name"
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
      ]
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
      {key:'价格(元)',value:CommonFnc.centToYuan(record.skuValue[0].price)},
      {key:'分类',value:record.classify.name},
      {key:'实际销量',value:record.salesActual},
      {key:'状态',value:CommonFnc.getConstantValue(APP.ACTIVE,record.active)},
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
    const { list,isModal,goodsClassify } = this.state;

    return (
      <div className='page-content'>
        {/*搜索栏*/}
        <div className='pd10'>
          <Row>
            <Col sm={24} md={8}>
              <div className='pd5'>
                <Row type="flex" align="middle">
                  <Col xs={8} sm={8} md={5}>
                    <span>商品名称：</span>
                  </Col>
                  <Col xs={16} sm={16} md={16}>
                    <Input placeholder="请输入商品名称" onChange={onInputChange.bind(this,'filter','goodsName')} value={this.state.filter.goodsName}/>
                  </Col>
                </Row>
              </div>
            </Col>
            <Col sm={24} md={8}>
              <div className='pd5'>
                <Row type="flex" align="middle">
                  <Col xs={8} sm={8} md={5}>
                    <span>商品分类：</span>
                  </Col>
                  <Col xs={16} sm={16} md={16}>
                    <TreeSelect
                      style={{ width: '100%' }}
                      value={this.state.filter.goodsClassifyId}
                      dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                      treeData={goodsClassify}
                      placeholder="请选择"
                      treeDefaultExpandAll
                      onChange={onSelectChange.bind(this,'filter','goodsClassifyId')}
                    />
                  </Col>
                </Row>
              </div>
            </Col>
            <Col sm={24} md={8}>
              <div className='pd5'>
                <Row type="flex" align="middle">
                  <Col xs={8} sm={8} md={5}>
                    <span>上架状态：</span>
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
            <Button type='primary' onClick={this.routeToAddGoods.bind(this)}>添加</Button>
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
