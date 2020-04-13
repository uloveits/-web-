/** Role 系统管理/角色管理 **/

import React from "react";
import P from "prop-types";
import { connect } from "react-redux";
import { Button, Input, Table, message, Row, Col, Modal,Tree,Switch  } from "antd";
import "./index.scss";

import { onInputChange, onTextAreaChange} from "../../../utils/commonChange";
import KtSeparator from "../../../comps/common/separator";
import sysApi from "../../../services/api/system";
import Tips from "../../../utils/tips";
import { APP } from "../../../constants";
import CommonFnc from "../../../utils/commonFnc";


const { TextArea } = Input;
const { TreeNode  } = Tree;

@connect(
  state => ({
    user: state.app.user,
    isMobile: state.common.isMobile,
  })
)
export default class SystemRolePage extends React.Component {
  static propTypes = {
    location: P.any,
    history: P.any,
    actions: P.any,
  };

  constructor(props) {
    super(props);
    this.state = {
      list : [], // 当前页面表格数据
      loading: false, // 表格数据是否正在加载中
      param:{},//参数数据
      filter:{},//筛选数据


      isModal: false, //模态框是否显示
      modalTitle: '新增', //模态框标题
      modalLoading: false, // 添加/修改/查看 是否正在请求中

      isBindAuth:false,
      isBindApi:false,
      treeMenu:[],
      apiList:[],
      selectMenuId:[],//选中的菜单id
      _roleId:null,//选中的角色Id

      pageNum: 0, // 当前第几页
      pageSize: 10, // 每页多少条
      total: 0, // 数据库总共多少条数据

      pageNum4Api: 0, // 当前第几页
      pageSize4Api: 10, // 每页多少条
      total4Api: 0, // 数据库总共多少条数据
    };
  }

  componentDidMount() {
    this.getTblList();
    this.getMenuTree();
  }


  getTblList = async() => {
    const params = {
      page:this.state.pageNum,
      limit:this.state.pageSize,
      ...this.state.filter
    };
    this.setState({ loading: true });

    let res = await sysApi.allRole(params);
    console.log('所有角色信息');
    console.log(res);
    this.setState({
      list:res.data,
      loading:false,
    })
  }

  //获得菜单树
  getMenuTree = async() => {
    let res = await sysApi.allMenu();
    console.log('所有菜单信息');
    console.log(res)
    this.setState({
      treeMenu:res.data
    })
  }

  //新增
  add = () => {
    this.setState({
      isModal: true,
      modalTitle: '新增',
    });
  };

  //编辑
  edit = (data) => {
    let _param = Object.assign({}, data)
    this.setState({
      isModal: true,
      modalTitle: '编辑',
      param: _param,
    });
  }


  //删除
  delete = async(data) => {
    await Tips.confirm("确认要删除该角色吗");
    let res = await sysApi.delRole({roleId:data.roleId})
    if(res.code === '200') {
      message.success('删除成功！')
      this.getTblList()
    }
  }



  // 搜索
  onSearch = ()=> {
    this.getTblList();
  }

  //模态框确认
  onOK = async () => {
    let { param,modalTitle } = this.state;
    if(modalTitle === '新增'){
      let res = await sysApi.addRole(param);
      if(res.code === '200') {
        message.success("添加成功");
        this.onClose();
        this.getTblList()
      }
    }else {
      let res = await sysApi.updateRole(param);
      if(res.code === '200') {
        message.success("修改成功");
        this.onClose();
        this.getTblList()
      }
    }
  }

  /** 模态框关闭 **/
  onClose = () => {
    this.setState({
      isModal: false,
      param: {},
    });
  }

  //绑定菜单权限
  bindRoleAuth = async(data) => {
    //先查该角色有哪些菜单权限
    let selectMenuId = await sysApi.getRoleMenu({roleId:data.roleId});

    this.setState({
      isBindAuth:true,
      selectMenuId:selectMenuId,
      _roleId:data.roleId
    })
  };

  //绑定接口权限
  bindRoleApi = async(data) => {
    //获得所有权限接口
    this.getApiList(data.roleId);

    this.setState({
      isBindApi:true,
      _roleId:data.roleId
    })
  }

  getApiList = async (roleId) => {
    const params = {
      page:this.state.pageNum4Api,
      limit:this.state.pageSize4Api,
      roleId:roleId
    };

    let res = await sysApi.allPower(params);
    console.log('所有权限信息');
    console.log(res)
    this.setState({
      apiList:res.data,
      total4Api:res.count,
    })
  }

  /** 树节点check选择时触发 **/
  onTreeCheck = (keys) => {
    console.log('onTreeCheck')
    console.log(keys)
    this.setState({
      selectMenuId:keys
    })
  }

  //模态框确认
  onAuthOK = async () => {
    const { _roleId, selectMenuId } = this.state;
    let param = {
      roleId:_roleId,
      menuIds:selectMenuId.toString()
    }
    let res = await sysApi.addRoleMenu(param);
    if(res.code === '200') {
      message.success("添加成功");
      this.onAuthClose();
      this.getTblList()
    }
  }

  /** 模态框关闭 **/
  onAuthClose = () => {
    this.setState({
      isBindAuth: false,
    });
  }

  onBindApiOK = () => {
    this.setState({
      isBindApi: false,
    });
  }

  onBindApiClose = () => {
    this.setState({
      isBindApi: false,
    });
  }


  // 表单页码改变
  onTablePageChange = (page, pageSize) =>{
    this.setState({
      pageNum:page,
      pageSize:pageSize,
    },()=> {
      this.getTblList(page, pageSize);
    })
  }

  onApiTablePageChange = (page, pageSize) => {
    this.setState({
      pageNum4Api:page,
      pageSize4Api:pageSize,
    },()=> {
      this.getApiList(this.state._roleId);
    })
  }

  // 构建字段
  makeColumns() {
    let columns = []
    if(this.props.isMobile === 'false') {
      columns = [
        {
          title: "角色名",
          dataIndex: "roleName",
          key: "roleName"
        },
        {
          title: "备注",
          dataIndex: "comments",
          key: "comments"
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
              <KtSeparator comp={{width:'5px'}}/>
              <Button onClick={this.bindRoleAuth.bind(this,record)} type="dashed" title="菜单权限" shape="circle" size='small'>菜</Button>
              <KtSeparator comp={{width:'5px'}}/>
              <Button onClick={this.bindRoleApi.bind(this,record)} title="接口权限" shape="circle" size='small'>接</Button>
            </div>

          )
        }
      ];
    }else {
      columns = [
        {
          title: "角色名",
          dataIndex: "roleName",
          key: "roleName"
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
              <Button onClick={this.bindRoleAuth.bind(this,record)} type="dashed" title="菜单权限" shape="circle" size='small'>菜</Button>
              <KtSeparator comp={{width:'5px'}}/>
              <Button onClick={this.bindRoleApi.bind(this,record)} title="接口权限" shape="circle" size='small'>接</Button>
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
      {key:'备注',value:record.comments},
      {key:'创建时间',value:record.createTime},
    ];
    return <Table columns={columns} dataSource={data} pagination={false} />;
  };

  //授权或者取消授权
  onSwitchChange = (record,checked) => {
    console.log(record,checked)
    if(checked) {
      //授权
      this.addRoleAuth(record)
    }else {
      //取消授权
      this.delRoleAuth(record)
    }
  }

  //添加角色权限
  addRoleAuth = async (record) => {
    let param = {
      roleId:this.state._roleId,
      authId:record.authority,
    }
    let res = await sysApi.addRoleAuth(param)
    if(res.code === '200'){
      message.success("添加成功")
    }
  }

  //删除角色权限
  delRoleAuth = async (record) => {
    let param = {
      roleId:this.state._roleId,
      authId:record.authority,
    }

    let res = await sysApi.deleteRoleAuth(param)
    if(res.code === '200'){
      message.success("删除成功")
    }
  }

  //接口Api表格
  makeApiColumns() {
    const columns = [
      {
        title: "模块",
        dataIndex: "parentName",
        key: "parentName"
      },
      {
        title: "接口名称",
        dataIndex: "authorityName",
        key: "authorityName"
      },
      {
        title: "权限标识",
        dataIndex: "authority",
        key: "authority"
      },
      {
        title: "同步时间",
        dataIndex: "createTime",
        key: "createTime"
      },
      {
        title: "授权",
        dataIndex: "checked",
        key: "checked",
        render: (text, record) => (
          <div className='align-center'>
            <Switch checkedChildren="开" unCheckedChildren="关" defaultChecked={record.checked} onClick={this.onSwitchChange.bind(this,record)} />
          </div>

        )
      }
    ];
    return columns;
  }

  //搜索重置
  clearSearch = () => {
    this.setState({
      filter:{}
    },()=>{
      this.onSearch()
    })
  }

  render() {
    const { list,treeMenu,apiList } = this.state;
    const renderMenuItem = item => ( // item.route 菜单单独跳转的路由
      <TreeNode title={item.title} key={item.id} />
    );

    const renderSubMenu = item => (
      <TreeNode key={item.id} title={item.title}
      >
        {item.children.map(child => renderMenuItem(child))}
      </TreeNode>
    );
    return (
      <div  className='page-content'>
        {/*搜索栏*/}
        <div className='pd10'>
          <Row>
            <Col sm={24} md={8}>
              <div className='pd5'>
                <Row type="flex" align="middle">
                  <Col xs={8} sm={8} md={4}>
                    <span>角色名：</span>
                  </Col>
                  <Col xs={16} sm={16} md={16}>
                    <Input placeholder="请输入用户名" onChange={onInputChange.bind(this,'filter','roleName')} value={this.state.filter.roleName}/>
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
            <Button type='primary' onClick={this.add.bind(this)}>添加角色</Button>
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
              <Col span={4}>角色名：</Col>
              <Col span={10}>
                <Input placeholder="请输入角色名" onChange={onInputChange.bind(this,'param','roleName')} value={this.state.param.roleName}/>
              </Col>
            </Row>
            <KtSeparator />
            <Row type="flex" justify="center" align="middle">
              <Col span={4}>备注：</Col>
              <Col span={10}>
                <TextArea placeholder="请输入备注" onChange={onTextAreaChange.bind(this,'param','comments')} value={this.state.param.comments}/>
              </Col>
            </Row>
          </div>
        </Modal>

        {/* 分配菜单权限 模态框 */}
        <Modal
          title="分配菜单权限"
          visible={this.state.isBindAuth}
          maskClosable={false}
          onOk={this.onAuthOK}
          onCancel={this.onAuthClose}
          confirmLoading={this.state.modalLoading}
          okText="确认"
          cancelText="取消"
        >
          <div>
            <Tree
              checkable
              defaultExpandedKeys={["-1"]}
              checkedKeys={this.state.selectMenuId}
              onCheck={this.onTreeCheck}
            >
              <TreeNode title="根" key="-1" >
                {treeMenu && treeMenu.map(item =>
                  item.children.length > 0 ? renderSubMenu(item) : renderMenuItem(item)
                )}
              </TreeNode>
            </Tree>
          </div>
        </Modal>

        {/* 分配接口权限 模态框 */}
        <Modal
          title="分配接口权限"
          width={750}
          visible={this.state.isBindApi}
          maskClosable={false}
          onOk={this.onBindApiOK}
          onCancel={this.onBindApiClose}
          confirmLoading={this.state.modalLoading}
          okText="确认"
          cancelText="取消"
        >
          <div>
            <Table
              columns={this.makeApiColumns()}
              dataSource={apiList}
              scroll={{ y: 240 }}
              pagination={{
                total: this.state.total4Api,
                current: this.state.pageNum4Api,
                pageSize: this.state.pageSize4Api,
                showQuickJumper: true,
                showTotal: (total, range) => `共 ${total} 条数据`,
                onChange: (page, pageSize) =>
                  this.onApiTablePageChange(page, pageSize)
              }}
            />
          </div>
        </Modal>

      </div>
    );
  }
}
