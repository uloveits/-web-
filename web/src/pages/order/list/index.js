/** 商品列表**/

import React from "react";

import P from "prop-types";
import { connect } from "react-redux";
import { Button, Input, Table, Row, Col, Select,Tag  } from "antd";
import "./index.scss";

import KtSeparator from "../../../comps/common/separator";
import {onInputChange,onSelectChange,renderCommonSelectOption} from "../../../utils/commonChange";
import { APP, ORDER } from "../../../constants";
import CommonFnc from "../../../utils/commonFnc";
import orderApi from "../../../services/api/order";



const { Option } = Select;

@connect(
  state => ({
    user: state.app.user,
    isMobile: state.common.isMobile,
  })
)

export default class OrderListPage extends React.Component {
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

    let res = await orderApi.list(params);
    console.log('所有订单信息');
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

  //详情
  detail = (data) => {
    this.props.history.push({pathname: `/order/detail`, state: {id: data.id}})
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
          title: "订单号",
          dataIndex: "no",
          key: "no"
        },
        {
          title: "商品信息",
          dataIndex: "orderGoods",
          width:300,
          key: "orderGoods",
          render: (text) =>
            (
              <div>
                {
                  text.map((item,idx)=>(
                    <div key={idx}>
                      <div>
                        <span>{item.goods.name}</span>
                      </div>
                      <div>
                        {
                          item.skuValueNames !== '0' &&
                          <Tag color='red'>{item.skuValueNames}</Tag>
                        }

                        <Tag color='red'>x {item.count}</Tag>
                        <Tag color='red'>{CommonFnc.centToYuan(item.price)}元</Tag>
                      </div>

                    </div>
                  ))
                }

              </div>
            )
        },
        {
          title: "订单金额(元)",
          dataIndex: "orderPrice",
          key: "orderPrice",
          render: (text) =>(
            <span>{CommonFnc.centToYuan(text)}</span>
          )
        },
        {
          title: "买家",
          dataIndex: "user",
          key: "user",
          render: (text, record) =>(
            <span>{record.user.nickName}</span>
          )
        },
        {
          title: "支付方式",
          dataIndex: "payType",
          key: "payType",
          render: (text) =>
            (<Tag color="green">{CommonFnc.getConstantValue(ORDER.PAY_TYPE,text)}</Tag>)
        },
        {
          title: "交易状态",
          dataIndex: "status",
          key: "status",
          render: (text) =>
            (<Tag color="purple">{CommonFnc.getConstantValue(ORDER.STATUS_VALUE,text)}</Tag>)
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
              <Button onClick={this.detail.bind(this,record)} type="primary" title="详情" shape="circle" size='small'>详</Button>
            </div>
          )
        }
      ];
    }else {
     columns = [
        {
          title: "商品信息",
          dataIndex: "orderGoods",
          key: "orderGoods",
          render: (text) =>
            (
              <div>
                {
                  text.map((item,idx)=>(
                    <div key={idx}>
                      <div>
                        <span>{item.goods.name}</span>
                      </div>
                      <div>
                        {
                          item.skuValueNames !== '0' &&
                          <Tag color='red'>{item.skuValueNames}</Tag>
                        }

                        <Tag color='red'>x {item.count}</Tag>
                        <Tag color='red'>{CommonFnc.centToYuan(item.price)}元</Tag>
                      </div>

                    </div>
                  ))
                }

              </div>
            )
        },
        {
          title: "操作",
          key: "control",
          render: (text, record) => (
            <div className='align-center'>
              <Button onClick={this.detail.bind(this,record)} type="primary" title="详情" shape="circle" size='small'>详</Button>
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
      {key:'订单号',value:record.no},
      {key:'订单金额(元)',value:CommonFnc.centToYuan(record.orderPrice)},
      {key:'买家',value:record.user.nickName},
      {key:'支付方式',value:CommonFnc.getConstantValue(ORDER.PAY_TYPE,record.payType)},
      {key:'交易状态',value:CommonFnc.getConstantValue(ORDER.STATUS_VALUE,record.status)},
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
                    <span>订单号：</span>
                  </Col>
                  <Col xs={16} sm={16} md={16}>
                    <Input placeholder="请输入订单号" onChange={onInputChange.bind(this,'filter','no')} value={this.state.filter.no}/>
                  </Col>
                </Row>
              </div>
            </Col>
            <Col sm={24} md={8}>
              <div className='pd5'>
                <Row type="flex" align="middle">
                  <Col xs={8} sm={8} md={5}>
                    <span>订单状态：</span>
                  </Col>
                  <Col xs={16} sm={16} md={16}>
                    <Select placeholder="请选择状态"
                            allowClear
                            style={{ width: '100%' }}
                            onChange={onSelectChange.bind(this,'filter','status')}
                            value={this.state.filter.status}
                    >
                      {renderCommonSelectOption(ORDER.STATUS_VALUE)}
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
