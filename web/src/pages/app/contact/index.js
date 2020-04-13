import React from "react";

import P from "prop-types";
import { connect } from "react-redux";
import { Button, Input, Table, message, Radio, Modal, Row, Col, Select } from "antd";
import "./index.scss";

import KtSeparator from "../../../comps/common/separator";
import {onInputChange} from "../../../utils/commonChange";
import Tips from "../../../utils/tips";
import settingApi from "../../../services/api/setting";
import Validate from "../../../utils/validate";
import { APP } from "../../../constants";
import CommonFnc from "../../../utils/commonFnc";



const { Option } = Select;

@connect(
  state => ({
    user: state.app.user,
    isMobile: state.common.isMobile,
  })
)

export default class AppContactPage extends React.Component {
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
  }


  // 查询当前页面所需列表数据
  getTblList = async () => {
    const params = {
      page:this.state.pageNum,
      limit:this.state.pageSize,
      ...this.state.filter
    };
    this.setState({ loading: true });

    let res = await settingApi.contactList(params);
    console.log('联系我们信息');
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
    let res = await settingApi.deleteContact({id:data.id})
    if(res.code === '200') {
      message.success('删除成功！')
      this.getTblList();
    }
  }

  validate = (param) => {
    console.log(param);
    if(!Validate.required(param.companyName)){
      message.warn("公司名称不能为空");
      return false
    }
    if(!Validate.required(param.userName)){
      message.warn("联系人不能为空");
      return false
    }
    if(!Validate.required(param.tel)){
      message.warn("联系方式不能为空");
      return false
    }
    return true
  }

  //模态框确认
  onOK = async () => {
    let { param,modalTitle } = this.state;

    if(!this.validate(param))return;

    if(modalTitle === '新增'){
      param.createId = this.props.user.userId;
      let res = await settingApi.addContact(param);
      if(res.code === '200') {
        message.success("添加成功");
        this.onClose();
        this.getTblList()
      }
    }else {
      let res = await settingApi.updateContact(param);
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
          title: "公司名称",
          dataIndex: "companyName",
          key: "companyName"
        },
        {
          title: "联系人",
          dataIndex: "userName",
          key: "userName",
        },
        {
          title: "联系方式",
          dataIndex: "tel",
          key: "tel"
        },
        {
          title: "邮箱",
          dataIndex: "mail",
          key: "mail"
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
          title: "公司名称",
          dataIndex: "companyName",
          key: "companyName"
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
      {key:'联系人',value:record.userName},
      {key:'联系方式',value:record.tel},
      {key:'邮箱',value:record.mail},
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
        {/*正文*/}
        <div className='pd10'>
          <div className='flex-left'>
            <Button type='primary' onClick={this.add.bind(this)}>新增联系方式</Button>
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
              <Col span={5} className='text-right pr10'><span className='major'>*</span>公司名称：</Col>
              <Col span={10}>
                <Input placeholder="请输入公司名称" onChange={onInputChange.bind(this,'param','companyName')} value={this.state.param.companyName}/>
              </Col>
            </Row>
            <KtSeparator />
            <Row type="flex" justify="center" align="middle">
              <Col span={5} className='text-right pr10'><span className='major'>*</span>联系人：</Col>
              <Col span={10}>
                <Input placeholder="请输入公司名称" onChange={onInputChange.bind(this,'param','userName')} value={this.state.param.userName}/>
              </Col>
            </Row>
            <KtSeparator />
            <Row type="flex" justify="center" align="middle">
              <Col span={5} className='text-right pr10'>邮箱：</Col>
              <Col span={10}>
                <Input placeholder="请输入邮箱地址" onChange={onInputChange.bind(this,'param','mail')} value={this.state.param.mail}/>
              </Col>
            </Row>
            <KtSeparator />

            <Row type="flex" justify="center" align="middle">
              <Col span={5} className='text-right pr10'><span className='major'>*</span>联系方式：</Col>
              <Col span={10}>
                <Input placeholder="请输入联系方式" onChange={onInputChange.bind(this,'param','tel')} value={this.state.param.tel}/>
              </Col>
            </Row>
          </div>
        </Modal>

      </div>
    );
  }
}
