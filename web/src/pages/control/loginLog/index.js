/** 商品列表**/

import React from "react";

import P from "prop-types";
import { connect } from "react-redux";
import moment from 'moment'
import { Button, Input, Table, message, Row, Col, Select  } from "antd";
import "./index.scss";

import KtSeparator from "../../../comps/common/separator";
import {onInputChange,onSelectChange} from "../../../utils/commonChange";
import Tips from "../../../utils/tips";
import logApi from "../../../services/api/log";
import ExportExcelUtils from "../../../utils/exportExcelUtils";



const { Option } = Select;


@connect(
  state => ({
    user: state.app.user,
    isMobile: state.common.isMobile,
  })
)

export default class LoginLogPage extends React.Component {
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

      param:{},//参数数据
      filter:{},//筛选数据

      loading: false, // 表格数据是否正在加载中

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

    let res = await logApi.loginList(params);
    console.log('所有登陆信息');
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
    await Tips.confirm("确认要删除该数据吗");
    let res = await logApi.loginDelete({id:data.id})
    if(res.code === '200') {
      message.success('删除成功！')
      this.getTblList();
    }
  };

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
          title: "登陆用户",
          dataIndex: "userName",
          key: "userName"
        },


        {
          title: "登陆IP",
          dataIndex: "ip",
          key: "ip"
        },

        {
          title: "所属地",
          dataIndex: "location",
          key: "location"
        },
        {
          title: "浏览器",
          dataIndex: "browser",
          key: "browser"
        },
        {
          title: "操作系统",
          dataIndex: "os",
          key: "os"
        },
        {
          title: "登陆时间",
          dataIndex: "createTime",
          key: "createTime"
        },
        {
          title: "操作",
          key: "control",
          render: (text, record) => (
            <div className='align-center'>
              <Button onClick={this.delete.bind(this,record)} type="danger" title="删除" shape="circle" size='small'>删</Button>
            </div>
          )
        }
      ];
    }else {
      columns = [
        {
          title: "登陆IP",
          dataIndex: "ip",
          key: "ip"
        },
        {
          title: "操作",
          key: "control",
          render: (text, record) => (
            <div className='align-center'>
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
      {key:'登陆账户',value:record.userName},
      {key:'所属地',value:record.location},
      {key:'浏览器',value:record.browser},
      {key:'操作系统',value:record.os},
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


  getExportData = async() => {
    const params = {
      ...this.state.filter
    };
    let res = await logApi.loginList(params);
    return res.data
  }

  //数据导出
  exportExcel = async () => {

    const header = [
      {
        title: "登陆用户",
        dataIndex: "userName",
        key: "userName"
      },
      {
        title: "登陆IP",
        dataIndex: "ip",
        key: "ip"
      },

      {
        title: "所属地",
        dataIndex: "location",
        key: "location"
      },
      {
        title: "浏览器",
        dataIndex: "browser",
        key: "browser"
      },
      {
        title: "操作系统",
        dataIndex: "os",
        key: "os"
      },
      {
        title: "登陆时间",
        dataIndex: "createTime",
        key: "createTime"
      },
    ]

    const data = await this.getExportData();

    ExportExcelUtils.export(header,data,`登陆日志表-${moment().locale('zh-cn').format('YYYY-MM-DD')}`)
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
          <div className='pb10'>
            <Button icon='download' type="primary" onClick={this.exportExcel.bind(this)}>导出</Button>
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
    );
  }
}
