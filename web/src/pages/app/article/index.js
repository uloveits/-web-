import React from "react";

import P from "prop-types";
import { connect } from "react-redux";
import { Button, Table, message, Row, Col, Select } from "antd";
import "./index.scss";

import KtSeparator from "../../../comps/common/separator";
import {onSelectChange} from "../../../utils/commonChange";
import Tips from "../../../utils/tips";

import settingApi from "../../../services/api/setting";
import { APP } from "../../../constants";
import CommonFnc from "../../../utils/commonFnc";




const { Option } = Select;

@connect(
  state => ({
    user: state.app.user,
    isMobile: state.common.isMobile,
  })
)

export default class AppArticlePage extends React.Component {
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

    let res = await settingApi.articleList(params);
    console.log('所有文章信息');
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
    this.props.history.push({pathname: `/app/article/edit`, state: {id: data.id}})
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
    await Tips.confirm("确认要删除该文章吗");
    let res = await settingApi.deleteArticle({id:data.id})
    if(res.code === '200') {
      message.success('删除成功！')
      this.getTblList();
    }
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
          title: "标题",
          dataIndex: "title",
          key: "title"
        },
        {
          title: "标识",
          dataIndex: "remark",
          key: "remark"
        },
        {
          title: "封面图片",
          dataIndex: "url",
          width:120,
          key: "url",
          render: (text, record) =>
            (
              record.fileList[0] &&
              <img alt="example" style={{ width: '100%' }} mode="widthFix" src={record.fileList[0].url || ''} />
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
          title: "标题",
          dataIndex: "title",
          key: "title"
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
      {key:'标识',value:record.remark},
      {key:'是否上线',value:CommonFnc.getConstantValue(APP.ACTIVE,record.active)},
      {key:'排序',value:record.sort},
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

  routeToArticleEdit = () => {
    this.props.history.push('/app/article/edit');
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
                    <span className='font-weight'>状态：</span>
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
          <div className='flex-left'>
            <Button type='primary' onClick={this.routeToArticleEdit.bind(this)}>新增文章</Button>
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
    );
  }
}
