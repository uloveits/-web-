import React from "react";
import P from "prop-types";
import { connect } from "react-redux";
import { Button, Input, Table, message, Row, Col, Modal } from "antd";
import "./index.scss";

import { onInputChange, onTextAreaChange} from "../../../utils/commonChange";
import KtSeparator from "../../../comps/common/separator";
import sysApi from "../../../services/api/system";
import Tips from "../../../utils/tips";
import authApi from "../../../services/api/auth";
import { APP } from "../../../constants";
import CommonFnc from "../../../utils/commonFnc";


const { TextArea } = Input;

@connect(
  state => ({
    user: state.app.user,
    isMobile: state.common.isMobile,
  })
)
export default class SystemPowerPage extends React.Component {
  static propTypes = {
    location: P.any,
    history: P.any,
    actions: P.any,
    powers: P.array,
    form: P.any,
    powerTreeData: P.array
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

      powerTreeShow: false, // 菜单树是否显示
      powerTreeDefault: { menus: [], powers: [] }, // 用于菜单树，默认需要选中的项
      pageNum: 0, // 当前第几页
      pageSize: 10, // 每页多少条
      total: 0, // 数据库总共多少条数据
      treeLoading: false, // 控制树的loading状态，因为要先加载当前role的菜单，才能显示树
      treeOnOkLoading: false // 是否正在分配菜单
    };
  }

  componentDidMount() {
    this.getTblList();
  }

  getTblList = async() => {
    const params = {
      page:this.state.pageNum,
      limit:this.state.pageSize,
      ...this.state.filter
    };
    this.setState({ loading: true });

    let res = await sysApi.allPower(params);
    console.log('所有权限信息');
    console.log(res)
    this.setState({
      list:res.data,
      total:res.count,
      loading:false,
    })
  }

  //同步权限
  authSync = async () => {
    await Tips.confirm("确定要同步所有权限吗")
    let doc = await authApi.apiDocs();
    console.log('同步权限')
    console.log(doc)
    let authList = [];
    let paths = doc.paths;
    let pathsKeys = Object.keys(paths);
    let sort = 0;
    for (let i = 0; i < pathsKeys.length; i++) {
      let pathKey = pathsKeys[i];
      let apiObject = paths[pathKey];
      let apiKeys = Object.keys(apiObject);
      for (let j = 0; j < apiKeys.length; j++) {
        let apiKey = apiKeys[j];
        let methodObject = apiObject[apiKey];
        let authorities ={};
        authorities.authority = apiKey + ':' + pathKey;
        authorities.authorityName = methodObject.summary;
        authorities.parentName = methodObject.tags[0];
        sort++;
        authorities.sort = sort;
        authList.push(authorities);
      }
    }
    this.saveAuth(authList);
  };

  saveAuth = async (authList) => {
    let param = {
      authList:authList
    }
    let res = await authApi.saveAuth(param)
    if(res.code === '200') {
      message.success("同步成功")
      this.getTblList();
    }
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

  //重置密码
  resetPwd = async(data) => {
    await Tips.confirm("确认要重置该用户密码吗");
    let res = await sysApi.resetPsw({userId:data.userId})
    if(res.code === '200') {
      message.success('重置成功！')
    }
  };

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

  // 表单页码改变
  onTablePageChange = (page, pageSize) =>{
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
      ];
    }else {
      columns = [
        {
          title: "模块",
          dataIndex: "parentName",
          key: "parentName"
        },
        {
          title: "同步时间",
          dataIndex: "createTime",
          key: "createTime"
        },
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
      {key:'接口名称',value:record.authorityName},
      {key:'权限标识',value:record.authority},
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
    const { list } = this.state;

    return (
      <div className='page-content'>
        {/*搜索栏*/}
        <div className='pd10'>
          <Row>
            <Col sm={24} md={8}>
              <div className='pd5'>
                <Row type="flex" align="middle">
                  <Col xs={8} sm={8} md={4}>
                    <span>关键字：</span>
                  </Col>
                  <Col xs={16} sm={16} md={16}>
                    <Input placeholder="请输入关键字" onChange={onInputChange.bind(this,'filter','keyword')} value={this.state.filter.keyword}/>
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
            <Button type='primary' onClick={this.authSync.bind(this)}>同步权限</Button>
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
      </div>
    );
  }
}
