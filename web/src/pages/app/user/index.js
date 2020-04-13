import React from "react";

import P from "prop-types";
import { connect } from "react-redux";
import { Button, Input, Table, Row, Col, Select } from "antd";
import "./index.scss";

import userApi from "../../../services/api/user";
import CommonFnc from "../../../utils/commonFnc";
import { APP, USER } from "../../../constants";
import { onInputChange } from "../../../utils/commonChange";
import KtSeparator from "../../../comps/common/separator";



const { Option } = Select;

@connect(
  state => ({
    user: state.app.user,
    isMobile: state.common.isMobile,
  })
)

export default class AppUserListPage extends React.Component {
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

    let res = await userApi.list(params);
    console.log('会员列表');
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
          title: "头像",
          dataIndex: "avatarUrl",
          key: "avatarUrl",
          width:80,
          render: (text, record) =>
            (
              <img alt="example" style={{ width: '100%' }} mode="widthFix" src={text} />
            )
        },
        {
          title: "昵称",
          dataIndex: "nickName",
          key: "nickName",
        },
        {
          title: "性别",
          dataIndex: "gender",
          key: "gender",
          render: (text) =>
            (
              <span>{CommonFnc.getConstantValue(USER.SEX,text)}</span>
            )
        },
        {
          title: "城市",
          dataIndex: "city",
          key: "city",
        },
        {
          title: "手机号码",
          dataIndex: "phone",
          key: "phone"
        },
        {
          title: "会员等级",
          dataIndex: "level",
          key: "level",
          render: (text) =>
            (
              <span>{CommonFnc.getConstantValue(USER.LEVEL,text)}</span>
            )
        },
        {
          title: "创建时间",
          dataIndex: "createTime",
          key: "createTime"
        },
      ];
    }else {
      columns = [
        {
          title: "头像",
          dataIndex: "avatarUrl",
          key: "avatarUrl",
          width:80,
          render: (text, record) =>
            (
              <img alt="example" style={{ width: '100%' }} mode="widthFix" src={text} />
            )
        },
        {
          title: "昵称",
          dataIndex: "nickName",
          key: "nickName",
        },
        {
          title: "手机号码",
          dataIndex: "phone",
          key: "phone"
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
      {key:'性别',value:CommonFnc.getConstantValue(USER.SEX,record.gender)},
      {key:'城市',value:record.city},
      {key:'会员等级',value:CommonFnc.getConstantValue(USER.LEVEL,record.level)},
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
                    <span className='font-weight'>昵称：</span>
                  </Col>
                  <Col xs={16} sm={16} md={16}>
                    <Input placeholder="请输入名称" onChange={onInputChange.bind(this,'filter','nickName')} value={this.state.filter.nickName}/>
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
    );
  }
}
