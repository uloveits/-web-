/**
 * 商品分类
 */
import React from "react";

import P from "prop-types";
import { connect } from "react-redux";
import { Button, Input, Table, message, Radio, Modal, Row, Col, Select,Tag } from "antd";
import "./index.scss";

import KtSeparator from "../../../comps/common/separator";
import {onInputChange,onImageChange,onSelectChange,renderCommonSelectOption} from "../../../utils/commonChange";
import Tips from "../../../utils/tips";
import { APP, GOODS } from "../../../constants";
import KtPictureWall from "../../../comps/common/picturesWall";
import CommonFnc from "../../../utils/commonFnc";
import Validate from "../../../utils/validate";
import goodsApi from "../../../services/api/goods";


@connect(
  state => ({
    user: state.app.user,
    isMobile: state.common.isMobile,
  })
)

export default class GoodsClassifyPage extends React.Component {
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
        active:1,
        type:'2',
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
  }


  // 查询当前页面所需列表数据
  getTblList = async () => {
    const params = {
      page:this.state.pageNum,
      limit:this.state.pageSize,
      ...this.state.filter
    };
    this.setState({ loading: true });

    let res = await goodsApi.classifyListTree(params);
    console.log('所有商品分类信息');
    console.log(res)
    this.setState({
      list:res.data,
      loading:false,
    })
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
  add = (parentId) => {
    let param = this.state.param;
    param.parentId = parentId;
    this.setState({
      isModal: true,
      modalTitle: '新增',
      param:param
    });
  };

  //删除
  delete = async(data) => {
    await Tips.confirm("确认要删除该条信息吗");
    let res = await goodsApi.deleteClassify({id:data.id})
    if(res.code === '200') {
      message.success('删除成功！')
      this.getTblList();
    }
  }

  validate = (param) => {

    console.log(param);
    if(!Validate.required(param.name)){
      message.warn("分类名称不能为空");
      return false
    }
    if(!Validate.required(param.type)){
      message.warn("请选择类别");
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

    if(!this.validate(param))return
    if(modalTitle === '新增'){
      param.createId = this.props.user.userId;
      let res = await goodsApi.addClassify(param);
      if(res.code === '200') {
        message.success("添加成功");
        this.onClose();
        this.getTblList()
      }
    }else {
      let res = await goodsApi.updateClassify(param);
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
        active:1,
        type:'1',
      }
    });
  }


  // 构建字段
  makeColumns() {
    let columns = []
    if(this.props.isMobile === 'false') {
       columns = [
        {
          title: "分类名称",
          dataIndex: "name",
          key: "name"
        },
        {
          title: "图片",
          dataIndex: "url",
          width:100,
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
              <Tag>{CommonFnc.getConstantValue(GOODS.CLASSIFY.TYPE,text)}</Tag>
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
              {
                record.parentId === '-1' &&
                <Button onClick={this.add.bind(this,record.id)} title="新增子节点" shape="circle" size='small'>增</Button>
              }
              <KtSeparator comp={{width:'5px'}}/>
              <Button onClick={this.edit.bind(this,record)} type="primary" title="修改" shape="circle" size='small'>改</Button>
              <KtSeparator comp={{width:'5px'}}/>
              {
                record.children.length === 0 &&
                <Button onClick={this.delete.bind(this,record)} type="danger" title="删除" shape="circle" size='small'>删</Button>
              }

            </div>
          )
        }
      ];
    }else {
      columns = [
        {
          title: "分类名称",
          dataIndex: "name",
          key: "name"
        },
        {
          title: "操作",
          key: "control",
          render: (text, record) => (
            <div className='align-center'>
              {
                record.parentId === '-1' &&
                <Button onClick={this.add.bind(this,record.id)} title="新增子节点" shape="circle" size='small'>增</Button>
              }
              <KtSeparator comp={{width:'5px'}}/>
              <Button onClick={this.edit.bind(this,record)} type="primary" title="修改" shape="circle" size='small'>改</Button>
              <KtSeparator comp={{width:'5px'}}/>
              {
                record.children.length === 0 &&
                <Button onClick={this.delete.bind(this,record)} type="danger" title="删除" shape="circle" size='small'>删</Button>
              }

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
      {key:'类型',value:CommonFnc.getConstantValue(GOODS.CLASSIFY.TYPE,record.type)},
      {key:'是否上线',value:CommonFnc.getConstantValue(APP.ACTIVE,record.active)},
      {key:'排序',value:record.sort},
      {key:'创建时间',value:record.createTime},
    ];
    return <Table columns={columns} dataSource={data} pagination={false} />;
  };

  render() {
    const { list,isModal } = this.state;

    return (
      <div className='page-content'>
        {/*正文*/}
        <div className='pd10'>
          <div className='flex-left'>
            <Button type='primary' onClick={this.add.bind(this,'-1')}>新增分类</Button>
          </div>
          <KtSeparator />
          <Table
            columns={this.makeColumns()}
            loading={this.state.loading}
            dataSource={list}
            defaultExpandAllRows={true}
            expandedRowRender={this.props.isMobile === 'false' ? false :this.expandedRowRender}
            pagination={false}
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
              <Col span={5} className='text-right pr10'><span className='major'>*</span>分类名称：</Col>
              <Col span={10}>
                <Input placeholder="请输入分类名称" onChange={onInputChange.bind(this,'param','name')} value={this.state.param.name}/>
              </Col>
            </Row>
            <KtSeparator />
            <Row type="flex" justify="center" align="middle">
              <Col span={5} className='text-right pr10'>图片：</Col>
              <Col span={10}>
                <KtPictureWall fileList={this.state.param.fileList} onChange={onImageChange.bind(this,'param','fileList')} />
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
                    renderCommonSelectOption(GOODS.CLASSIFY.TYPE)
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
