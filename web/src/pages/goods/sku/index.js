/**
 * 商品分类
 */
import React from "react";

import P from "prop-types";
import { connect } from "react-redux";
import { Button, Input, Table, message, Modal, Row, Col, Select,Tag } from "antd";
import "./index.scss";

import KtSeparator from "../../../comps/common/separator";
import {onInputChange,onSelectChange,renderCommonSelectOption} from "../../../utils/commonChange";
import Tips from "../../../utils/tips";

import Validate from "../../../utils/validate";
import goodsApi from "../../../services/api/goods";
import KtTitleBar from "../../../comps/common/title";
import skuApi from "../../../services/api/sku";
import CommonFnc from "../../../utils/commonFnc";
import { APP } from "../../../constants";

const { TextArea } = Input;

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
      clsList : [], // 当前页面全部数据
      list : [], // 当前页面全部数据
      classify:[],//分类数据
      roles : [], // 所有的角色信息
      paramClassify:{},//分类参数
      param:{},//参数数据
      filter:{},//筛选数据

      linkSelect:[],//链接下拉框数据

      clsLoading: false, // 表格数据是否正在加载中
      loading: false, // 表格数据是否正在加载中

      isModal: false, //模态框是否显示
      modalTitle: '新增', //模态框标题
      modalLoading: false, // 添加/修改/查看 是否正在请求中

      pageNum: 0, // 当前第几页
      pageSize: 10, // 每页多少条
      total: 0, // 数据库总共多少条数据

      pageClsNum: 0, // 当前第几页
      pageClsSize: 10, // 每页多少条
      clsTotal: 0, // 数据库总共多少条数据
    };
  }

  componentDidMount() {
    this.getTblList();
    this.getClsTblList();
    //不分页的分类集合
    this.getSkuClassify()
  }


  // 查询当前页面所需列表数据
  getTblList = async () => {
    const params = {
      page:this.state.pageNum,
      limit:this.state.pageSize,
      ...this.state.filter
    };
    this.setState({ loading: true });

    let res = await skuApi.list(params);
    console.log('所有Sku信息');
    console.log(res)
    this.setState({
      list:res,
      loading:false,
    })
  };

  // 查询当前页面所需列表数据(分类)
  getClsTblList = async () => {
    const params = {
      page:this.state.pageClsNum,
      limit:this.state.pageClsSize,
    };
    this.setState({ clsLoading: true });

    let res = await skuApi.classifyList(params);
    console.log('所有Sku分类信息');
    console.log(res)
    this.setState({
      clsList:res.data,
      clsLoading:false,
    })
  };

  //分类下拉框数据
  getSkuClassify = async() => {
    let res = await skuApi.classifyList({});
    console.log('所有下拉框');
    console.log(res)
    this.setState({
      classify:res.data,
    })
  }

  //编辑
  edit = (data) => {
    let _param = Object.assign({}, data)
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
    await Tips.confirm("确认要删除该条信息吗");
    let res = await skuApi.delete({id:data.id})
    if(res.code === '200') {
      message.success('删除成功！')
      this.getTblList();
    }
  }
  //删除分类
  deleteCls = async(data) => {
    await Tips.confirm("确认要删除该条信息吗");
    let res = await skuApi.deleteClassify({id:data.id})
    if(res.code === '200') {
      message.success('删除成功！')
      this.getClsTblList();
    }
  }

  validate = (param) => {
    console.log(param);
    if(!Validate.required(param.name)){
      message.warn("规格名称不能为空");
      return false
    }
    if(!Validate.required(param.value)){
      message.warn("规格参数不能为空");
      return false
    }
    if(!Validate.required(param.classifyId)){
      message.warn("请选择规格分类");
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
      let res = await skuApi.add(param);
      if(res.code === '200') {
        message.success("添加成功");
        this.onClose();
        this.getTblList()
      }
    }else {
      let res = await skuApi.update(param);
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

  //保存Sku分类
  saveSkuClassify = async() => {
    let param = this.state.paramClassify;
    if(!Validate.required(param.name)){
      message.warn('分类名称不能为空！');
      return
    }
    let res = await skuApi.addClassify(param);
    if(res.code ==='200') {
      message.success('保存成功！');
      this.getClsTblList();
      this.getSkuClassify();
    }
  }


  // 构建字段
  makeClsColumns() {
    const columns = [
      {
        title: "分类名称",
        dataIndex: "name",
        key: "name"
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
            <Button onClick={this.deleteCls.bind(this,record)} type="danger" title="删除" shape="circle" size='small'>删</Button>
          </div>
        )
      }
    ];
    return columns;
  }
  //表格分类事件
  onClsTablePageChange = (page,pageSize) => {
    this.setState({
      pageClsNum:page,
      pageClsSize:pageSize,
    },()=> {
      this.getClsTblList(page, pageSize);
    })
  }

  // 构建字段
  makeColumns() {
    let columns = []
    if(this.props.isMobile === 'false') {
      columns = [
        {
          title: "规格名称",
          dataIndex: "name",
          key: "name"
        },
        {
          title: "规格参数",
          dataIndex: "value",
          key: "value"
        },
        {
          title: "规格分类",
          dataIndex: "classifyId",
          key: "classifyId",
          render: (text) => (
            <Tag>{CommonFnc.getConstantValue(this.state.classify,text,'id','name')}</Tag>
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
          title: "规格名称",
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
      {key:'规格参数',value:record.value},
      {key:'规格分类',value:CommonFnc.getConstantValue(this.state.classify,record.classifyId,'id','name')},
      {key:'排序',value:record.sort},
      {key:'创建时间',value:record.createTime},
    ];
    return <Table columns={columns} dataSource={data} pagination={false} />;
  };

  //表格分类事件
  onTablePageChange = (page,pageSize) => {
    this.setState({
      pageNum:page,
      pageSize:pageSize,
    },()=> {
      this.getTblList(page, pageSize);
    })
  }


  render() {
    const { list,clsList,classify,isModal } = this.state;

    return (
      <div className='page-content'>
        <Row>
          <Col xs={24} md={8}>
            {/*正文*/}
            <div className='pd10'>
              <div className='pd10 border shadow-warp '>
                <div className='flex-left'>
                  <KtTitleBar comp={{title:'分类'}} />
                </div>
                <KtSeparator />
                <div className='ptb20'>
                  <Row type="flex" justify="left" align="middle">
                    <Col xs={8} xs={8} md={6} className='text-right pr10'><span className='major'>*</span>分类名称：</Col>
                    <Col xs={10} xs={10} md={10}>
                      <Input placeholder="请输入分类名称" onChange={onInputChange.bind(this,'paramClassify','name')} value={this.state.paramClassify.name}/>
                    </Col>
                    <Col xs={6} xs={6} md={5} className='text-right'>
                      <Button type='primary' onClick={this.saveSkuClassify.bind(this)} >新增</Button>
                    </Col>
                  </Row>
                </div>

                <Table
                  columns={this.makeClsColumns()}
                  loading={this.state.clsLoading}
                  dataSource={clsList}
                  defaultExpandAllRows={true}
                  pagination={{
                    total: this.state.clsTotal,
                    current: this.state.pageClsNum,
                    pageSize: this.state.pageClsSize,
                    showQuickJumper: true,
                    showTotal: (total, range) => `共 ${total} 条数据`,
                    onChange: (page, pageSize) =>
                      this.onClsTablePageChange(page, pageSize)
                  }}
                />
              </div>
            </div>
          </Col>
          <Col xs={24} md={16}>
            {/*正文*/}
            <div className='pd10'>
              <div className='pd10 border shadow-warp '>
                <div className='flex-left'>
                  <KtTitleBar comp={{title:'规格列表'}} />
                </div>
                <KtSeparator />
                <div className='ptb20 flex'>
                  <Button type='primary' onClick={this.add.bind(this)}>新增规格</Button>
                </div>
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
            </div>
          </Col>
        </Row>





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
              <Col span={5} className='text-right pr10'><span className='major'>*</span>规格名称：</Col>
              <Col span={10}>
                <Input placeholder="请输入分类名称" onChange={onInputChange.bind(this,'param','name')} value={this.state.param.name}/>
              </Col>
            </Row>
            <KtSeparator />
            <Row type="flex" justify="center" align="middle">
              <Col span={5} className='text-right pr10'><span className='major'>*</span>规格分类：</Col>
              <Col span={10}>
                <Select
                  style={{ width: '100%' }}
                  placeholder="请选择"
                  value={this.state.param.classifyId}
                  onChange={onSelectChange.bind(this,'param','classifyId')}
                >
                  {
                    renderCommonSelectOption(classify,'name')
                  }
                </Select>
              </Col>
            </Row>
            <KtSeparator />
            <Row type="flex" justify="center" align="middle">
              <Col span={5} className='text-right pr10'><span className='major'>*</span>规格参数：</Col>
              <Col span={10}>
                <TextArea rows={2} placeholder="请输入参数，多个用逗号隔开" onChange={onInputChange.bind(this,'param','value')} value={this.state.param.value}/>
              </Col>
            </Row>
            <KtSeparator />
            <Row type="flex" justify="center" align="middle">
              <Col span={5} className='text-right pr10'><span className='major'>*</span>规格排序：</Col>
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
