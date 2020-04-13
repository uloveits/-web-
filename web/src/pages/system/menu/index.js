import React from "react";
import P from "prop-types";
import { Button, Input,InputNumber,Select, Table, message, Row, Col, Modal,Tree } from "antd";
import { connect } from "react-redux";
import "./index.scss";

import { onInputChange, onSelectChange} from "../../../utils/commonChange";
import KtSeparator from "../../../comps/common/separator";
import sysApi from "../../../services/api/system";
import Tips from "../../../utils/tips";
import { ICON } from "../../../constants";


const { TreeNode } = Tree;
const { Option } = Select

@connect(
  state => ({
    user: state.app.user,
    isMobile: state.common.isMobile,
  })
)
export default class SystemMenuPage extends React.Component {
  static propTypes = {
    location: P.any,
    history: P.any,
    actions: P.any,
    form: P.any,
  };

  constructor(props) {
    super(props);
    this.state = {
      list : [], // 当前页面表格数据
      loading: false, // 表格数据是否正在加载中
      param:{},//参数数据
      filter:{},//筛选数据

      treeMenu : [], //菜单树形结构
      selectId:["-1"],

      isModal: false, //模态框是否显示
      modalTitle: '新增', //模态框标题
      modalLoading: false, // 添加/修改/查看 是否正在请求中

      pageNum: 0, // 当前第几页
      pageSize: 10, // 每页多少条
      total: 0, // 数据库总共多少条数据
    };
  }

  componentDidMount() {
    this.getMenuTree();
    this.getTblList();
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

  getTblList = async () => {
    const params = {
      page:this.state.pageNum,
      limit:this.state.pageSize,
      parentId:this.state.selectId.toString(),
      ...this.state.filter
    };
    this.setState({ loading: true });

    let res = await sysApi.menuByParentId(params);
    console.log('对应节点的菜单信息');
    console.log(res)
    this.setState({
      list:res.data,
      loading:false,
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
    await Tips.confirm("确认要删除该菜单吗");
    let res = await sysApi.delMenu({menuId:data.menuId})
    if(res.code === '200') {
      message.success('删除成功！')
      this.getTblList()
      this.getMenuTree();
    }
  }

  // 搜索
  onSearch = ()=> {
    this.getTblList();
  }

  //模态框确认
  onOK = async () => {
    let { param,modalTitle,selectId } = this.state;
    if(modalTitle === '新增'){
      if(selectId.toString() !== '-1'){
        param.parentId = parseInt(selectId.toString())
      }
      let res = await sysApi.addMenu(param);
      if(res.code === '200') {
        message.success("添加成功");
        this.onClose();
        this.getTblList()
        this.getMenuTree();
      }
    }else {
      let res = await sysApi.updateMenu(param);
      if(res.code === '200') {
        message.success("修改成功");
        this.onClose();
        this.getTblList();
        this.getMenuTree();
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
          title: "图标",
          dataIndex: "menuIcon",
          key: "menuIcon",
          width:"60px",
          render: (text) => (
            <span className={`iconfont icon-${text}`} />
          )
        },
        {
          title: "菜单名称",
          dataIndex: "menuName",
          key: "menuName"
        },
        {
          title: "路径",
          dataIndex: "menuUrl",
          key: "menuUrl"
        },
        {
          title: "排序",
          dataIndex: "sortNumber",
          key: "sortNumber"
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
          title: "图标",
          dataIndex: "menuIcon",
          key: "menuIcon",
          width:"60px",
          render: (text) => (
            <span className={`iconfont icon-${text}`} />
          )
        },
        {
          title: "菜单名称",
          dataIndex: "menuName",
          key: "menuName"
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
      {key:'路径',value:record.menuUrl},
      {key:'排序',value:record.sortNumber},
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

  /** 点击树目录时触发 **/
  onTreeSelect = (keys) => {
    this.setState({
      selectId:keys
    },()=>{
      this.getTblList()
    })
  };

  /** 递归构建树结构 **/
  makeTreeDom(data) {
    return data.map(item => {
      if (item.children) {
        return (
          <TreeNode title={item.title} key={`${item.id}`}>
            {this.makeTreeDom(item.children)}
          </TreeNode>
        );
      } else {
        return <TreeNode title={item.title} key={`${item.id}`} />;
      }
    });
  }
  
  render() {
    const { treeMenu,list } = this.state;
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
      <div  className='pd10 page-content '>
        <Row>
          <Col xs={24} sm={24} md={6}>
            <div className='pd5'>
              <div className='pd10 border'>
                <div className="pd10 font-weight">目录结构</div>
                <div className='plr10r'>
                  <KtSeparator comp={{height:"1px",bgColor:'#ececec'}} />
                </div>
                <div className='pd10'>
                  <Tree
                    defaultExpandedKeys={["-1"]}
                    onSelect={this.onTreeSelect}
                    selectedKeys={this.state.selectId}
                  >
                    <TreeNode title="根" key="-1" >
                      {treeMenu && treeMenu.map(item =>
                        item.children.length > 0 ? renderSubMenu(item) : renderMenuItem(item)
                      )}
                    </TreeNode>
                  </Tree>
                </div>
              </div>
            </div>
          </Col>
          <Col xs={24} sm={24} md={18}>
            <div className='pd5'>
              <div className='pd10 border'>
                <div className='flex-left'>
                  <Button type='primary' onClick={this.add.bind(this)}>添加子菜单</Button>
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
            </div>
          </Col>
        </Row>



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
              <Col span={4}>菜单名称：</Col>
              <Col span={10}>
                <Input placeholder="请输入菜单名" onChange={onInputChange.bind(this,'param','menuName')} value={this.state.param.menuName}/>
              </Col>
            </Row>
            <KtSeparator />
            <Row type="flex" justify="center" align="middle">
              <Col span={4}>菜单链接：</Col>
              <Col span={10}>
                <Input placeholder="请输入菜单链接" onChange={onInputChange.bind(this,'param','menuUrl')} value={this.state.param.menuUrl}/>
              </Col>
            </Row>
            <KtSeparator />
            <Row type="flex" justify="center" align="middle">
              <Col span={4}>菜单图标：</Col>
              <Col span={10}>
                <Select
                  allowClear
                  dropdownClassName="iconSelect"
                  style={{width:'100%'}}
                  placeholder="请选择状态"
                  onChange={onSelectChange.bind(this,'param','menuIcon')}
                  value={this.state.param.menuIcon}
                >
                  {ICON.map((item, index) => {
                    return (
                      <Option key={index} value={item}>
                        <span className={`iconfont icon-${item}`} />
                      </Option>
                    );
                  })}
                </Select>
              </Col>
            </Row>
            <KtSeparator />
            <Row type="flex" justify="center" align="middle">
              <Col span={4}>排序：</Col>
              <Col span={10}>
                <InputNumber min={1} max={9999} value={this.state.param.sortNumber} onChange={onSelectChange.bind(this,'param','sortNumber')} />
              </Col>
            </Row>
          </div>
        </Modal>
      </div>
    );
  }
}
