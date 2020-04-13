/** User 系统管理/用户管理 **/

import React from "react";

import P from "prop-types";
import { connect } from "react-redux";
import { Button, Tag, Input, Table, message, Radio, Modal, Row,Col, Divider, Select } from "antd";
import "./index.scss";

import sysApi from "../../../services/api/system";
import KtSeparator from "../../../comps/common/separator";
import {onInputChange,renderSelectOption,onSelectChange} from "../../../utils/commonChange";
import Tips from "../../../utils/tips";
import { APP, USER } from "../../../constants";
import CommonFnc from "../../../utils/commonFnc";


const { Option } = Select;

@connect(
  state => ({
    user: state.app.user,
    isMobile: state.common.isMobile,
  })
)
export default class SystemUserPage extends React.Component {
  static propTypes = {
    location: P.any,
    history: P.any,
    actions: P.any,
    user: P.any,
    powers: P.array,
    form: P.any
  };

  constructor(props) {
    super(props);
    this.state = {
      list : [], // 当前页面全部数据
      roles : [], // 所有的角色信息
      param:{},//参数数据
      filter:{},//筛选数据

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
    this.getList(this.state.pageNum, this.state.pageSize);
    //获取角色信息
    this.getRoles();

  }


  // 查询当前页面所需列表数据
  getList = async (pageNum, pageSize) => {
    const params = {
      page:pageNum,
      limit:pageSize,
      ...this.state.filter
    };
    this.setState({ loading: true });

    let res = await sysApi.allUser(params);
    console.log('所有用户信息');
    console.log(res)
    this.setState({
      list:res,
      loading:false,
    })
  };

  //查询所有的角色信息
  getRoles = async () => {
    let res = await sysApi.allRole({})
    console.log('查询所有的角色信息')
    console.log(res)
    if(res.code === '200') {
      this.setState({
        roles:res.data,
      })
    }
  };


  // 搜索
  onSearch() {
    this.getList(this.state.pageNum, this.state.pageSize);
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
    await Tips.confirm("确认要删除该用户吗");
    let res = await sysApi.delUser({userId:data.userId})
    if(res.code === '200') {
      message.success('删除成功！')
      this.getList(this.state.pageNum, this.state.pageSize)
    }
  }

  //重置密码
  resetPwd = async(data) => {
    await Tips.confirm("确认要重置该用户密码吗");
    let res = await sysApi.resetPsw({userId:data.userId})
    if(res.code === '200') {
      message.success('重置成功！')
    }
  };

  //模态框确认
  onOK = async () => {
    let { param,modalTitle } = this.state;
    if(modalTitle === '新增'){
      let res = await sysApi.addUser(param);
      if(res.code === '200') {
        message.success("添加成功");
        this.onClose();
        this.getList(this.state.pageNum, this.state.pageSize)
      }
    }else {
      let res = await sysApi.updateUser(param);
      if(res.code === '200') {
        message.success("修改成功");
        this.onClose();
        this.getList(this.state.pageNum, this.state.pageSize)
      }
    }
  }

  //模态框关闭
  onClose = () => {
    this.setState({
      isModal: false,
      param:{}
    });
  }

  // 表单页码改变
  onTablePageChange(page, pageSize) {
    this.getList(page, pageSize);
  }

  // 构建字段
  makeColumns() {
    let columns = []
    if(this.props.isMobile === 'false') {
      columns = [
        {
          title: "账号",
          dataIndex: "username",
          key: "username"
        },
        {
          title: "用户名",
          dataIndex: "nickName",
          key: "nickName"
        },
        {
          title: "性别",
          dataIndex: "sex",
          key: "sex"
        },
        {
          title: "手机号",
          dataIndex: "phone",
          key: "phone"
        },
        {
          title: "角色",
          dataIndex: "roles",
          key: "roles",
          render:(text,record) => {
            return record.roles.map((role,idx)=>(
              <div className='align-center' key={idx}>
                <Tag color="green">
                  {role.roleName}
                </Tag>
              </div>
            ))
          }
        },
        {
          title: "创建时间",
          dataIndex: "createTime",
          key: "createTime"
        },
        {
          title: "状态",
          dataIndex: "state",
          key: "state",
          render: (text) =>
            text === 1 ? (
              <span style={{ color: "green" }}>启用</span>
            ) : (
              <span style={{ color: "red" }}>禁用</span>
            )
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
              <KtSeparator comp={{width:'5px'}}/>
              <Button onClick={this.resetPwd.bind(this,record)} type="dashed" title="重置密码" shape="circle" size='small'>置</Button>
            </div>
          )
        }
      ];
    }else {
      columns = [
        {
          title: "用户名",
          dataIndex: "nickName",
          key: "nickName"
        },
        {
          title: "角色",
          dataIndex: "roles",
          key: "roles",
          render:(text,record) => {
            return record.roles.map((role,idx)=>(
              <div className='align-center' key={idx}>
                <Tag color="green">
                  {role.roleName}
                </Tag>
              </div>
            ))
          }
        },
        {
          title: "操作",
          key: "control",
          render: (text, record) => (
            <div className='align-center'>
              <Button onClick={this.edit.bind(this,record)} type="primary" title="修改" shape="circle" size='small'>改</Button>
              <KtSeparator comp={{width:'5px'}}/>
              <Button onClick={this.delete.bind(this,record)} type="danger" title="删除" shape="circle" size='small'>删</Button>
              <KtSeparator comp={{width:'5px'}}/>
              <Button onClick={this.resetPwd.bind(this,record)} type="dashed" title="重置密码" shape="circle" size='small'>置</Button>
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
      {key:'账号',value:record.username},
      {key:'性别',value:record.sex},
      {key:'手机号',value:record.phone},
      {key:'状态',value:CommonFnc.getConstantValue(APP.ACTIVE,record.state)},
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
    const { list,roles } = this.state;

    return (
      <div className='page-content'>
        {/*搜索栏*/}
        <div className='pd10'>
          <Row>
            <Col sm={24} md={8}>
              <div className='pd5'>
                <Row type="flex" align="middle">
                  <Col xs={8} sm={8} md={4}>
                    <span>用户名：</span>
                  </Col>
                  <Col xs={16} sm={16} md={16}>
                    <Input placeholder="请输入用户名" onChange={onInputChange.bind(this,'filter','nickName')} value={this.state.filter.nickName}/>
                  </Col>
                </Row>
              </div>
            </Col>
            <Col sm={24} md={8}>
              <div className='pd5'>
                <Row type="flex" align="middle">
                  <Col xs={8} sm={8} md={4}>
                    <span>状态：</span>
                  </Col>
                  <Col xs={16} sm={16} md={16}>
                    <Select placeholder="请选择状态"
                            allowClear
                            style={{ width: '100%' }}
                            onChange={onSelectChange.bind(this,'filter','state')}
                            value={this.state.filter.state}
                    >
                      <Option value={1}>启用</Option>
                      <Option value={0 }>禁用</Option>
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
            <Button type='primary' onClick={this.add.bind(this)}>添加用户</Button>
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
              showTotal: (total) => `共 ${total} 条数据`,
              onChange: (page, pageSize) =>
                this.onTablePageChange(page, pageSize)
            }}
          />
        </div>

        {/* 新增&修改&查看 模态框 */}
        <Modal
          title={this.state.modalTitle}
          visible={this.state.isModal}
          maskClosable={false}
          onOk={this.onOK}
          onCancel={this.onClose}
          confirmLoading={this.state.modalLoading}
          okText="确认"
          cancelText="取消"
        >
          <div>
            <Row type="flex" justify="center" align="middle">
              <Col span={4}>账号：</Col>
              <Col span={10}>
                <Input placeholder="请输入账号" onChange={onInputChange.bind(this,'param','username')} value={this.state.param.username}/>
              </Col>
            </Row>
            <KtSeparator />
            <Row type="flex" justify="center" align="middle">
              <Col span={4}>用户名：</Col>
              <Col span={10}>
                <Input placeholder="请输入用户名" onChange={onInputChange.bind(this,'param','nickName')} value={this.state.param.nickName}/>
              </Col>
            </Row>
            <KtSeparator />
            <Row type="flex" justify="center" align="middle">
              <Col span={4}>手机号码：</Col>
              <Col span={10}>
                <Input placeholder="请输入手机号码" onChange={onInputChange.bind(this,'param','phone')} value={this.state.param.phone}/>
              </Col>
            </Row>
            <KtSeparator />
            <Row type="flex" justify="center" align="middle">
              <Col span={4}>性别：</Col>
              <Col span={10}>
                <Radio.Group onChange={onInputChange.bind(this,'param','sex')} value={this.state.param.sex}>
                  <Radio value={'男'}>男</Radio>
                  <Radio value={'女'}>女</Radio>
                </Radio.Group>
              </Col>
            </Row>
            <KtSeparator />
            <Row type="flex" justify="center" align="middle">
              <Col span={4}>角色：</Col>
              <Col span={10}>
                <Select
                  mode="multiple"
                  style={{ width: '100%' }}
                  placeholder="请选择"
                  value={this.state.param.rolesId}
                  onChange={onSelectChange.bind(this,'param','rolesId')}
                >
                  {
                   renderSelectOption(roles)
                  }
                </Select>
              </Col>
            </Row>
            <KtSeparator />
            <Row type="flex" justify="center" align="middle">
              <Col span={4}>状态：</Col>
              <Col span={10}>
                <Select
                  style={{ width: '100%' }}
                  placeholder="请选择状态"
                  allowClear
                  onChange={onSelectChange.bind(this,'param','state')}
                  value={this.state.param.state}
                >
                  <Option value={1}>启用</Option>
                  <Option value={0}>禁用</Option>
                </Select>
              </Col>
            </Row>
          </div>
        </Modal>

      </div>
    );
  }
}
