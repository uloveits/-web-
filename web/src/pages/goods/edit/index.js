import React from "react";

import { connect } from "react-redux";
import { Button, Input, message, Radio, Row, Col, Select,Table,TreeSelect } from "antd";
import "./index.scss";
import {
  onImageChange,
  onTblImageChange,
  onInputChange,
  onRichTextChange,
  onSelectChange,
  onEditTblInputChange,
  renderCommonSelectOption
} from "../../../utils/commonChange";

import KtSeparator from "../../../comps/common/separator";
import KtPictureWall from "../../../comps/common/picturesWall";
import KtRichText from "../../../comps/common/richText";
import Validate from "../../../utils/validate";
import KtTitleBar from "../../../comps/common/title";
import skuApi from "../../../services/api/sku";
import CommonFnc from "../../../utils/commonFnc";
import goodsApi from "../../../services/api/goods";
import { APP, GOODS } from "../../../constants";







const { Option } = Select;

@connect(
  state => ({
    user: state.app.user,
    isMobile: state.common.isMobile,
  })
)

export default class GoodsEditPage extends React.Component {
  static propTypes = {

  };

  constructor(props) {
    super(props);
    this.state = {
      param:{
        skuType:GOODS.NO_SKU,
        active:1,
      },
      skuParam:{},//sku的信息
      sku:[],//通过分类查出的sku
      tblSku:[],//渲染sku表格数据

      goodsClassify:[],
      skuClassify:[],
      loading:false,//表格加载

    };
  }

  componentWillMount() {
    console.info()
  }

  componentDidMount() {
    if(this.props.location.state&&this.props.location.state.id) {
      this.getInfo()
    }
    this.getGoodsClassify()
    this.getSkuClassify();
  }

  getInfo = async () => {
    let res = await  goodsApi.detail({id:this.props.location.state.id});
    console.log('商品详情')
    console.log(res.data)
    if(res.code === '200') {
      let _skuParam = {};
      if(res.data.skuType === GOODS.NO_SKU){
        _skuParam = res.data.skuValue[0]
        _skuParam.price = CommonFnc.centToYuan( _skuParam.price);
        _skuParam.linePrice = CommonFnc.centToYuan( _skuParam.linePrice);
        this.setState({
          param:res.data,
          skuParam:_skuParam,
        })
      }else {
        await this.getSku(res.data.skuClassifyId)
        let { tblSku } = this.state;
        //复原sku数据
        for(let i= 0;i< tblSku.length;i++) {
          let idx = CommonFnc.findArrIndex(tblSku[i].skuValueIds,res.data.skuValue,'skuValueIds');
          tblSku[i].fileList = res.data.skuValue[idx].fileList;
          tblSku[i].goodsCode = res.data.skuValue[idx].goodsCode;
          tblSku[i].stock = res.data.skuValue[idx].stock;
          tblSku[i].price = CommonFnc.centToYuan(res.data.skuValue[idx].price);
          tblSku[i].linePrice = CommonFnc.centToYuan(res.data.skuValue[idx].linePrice);
        }
        this.setState({
          tblSku,
          param:res.data,
        })
      }
    }
  }

  //商品分类下拉框数据
  getGoodsClassify = async() => {
    let res = await goodsApi.classifySelectTree({});
    console.log('商品分类下拉框数据')
    console.log(res)
    this.setState({
      goodsClassify:res.data,
    })
  }

  //Sku分类下拉框数据
  getSkuClassify = async() => {
    let res = await skuApi.classifyList({});
    this.setState({
      skuClassify:res.data,
    })
  }

  validate = (param) => {

    if(!Validate.required(param.name)){
      message.warn("商品名称不能为空");
      return false
    }
    if(!Validate.required(param.goodsClassifyId)){
      message.warn("商品分类不能为空");
      return false
    }
    if(!param.fileList || param.fileList.length <= 0){
      message.warn("请至少上传一张商品图片");
      return false
    }
    for(let i=0;i<param.skuValue.length;i++) {
      if(!Validate.required(param.skuValue[i].price)){
        message.warn("商品售价不能为空");
        return false
      }
      if(!Validate.required(param.skuValue[i].stock)){
        message.warn("商品库存不能为空");
        return false
      }
    }

    if(!Validate.required(param.content)){
      message.warn("商品详情不能为空");
      return false
    }

    if(!Validate.required(param.sort)){
      message.warn("商品排序号不能为空");
      return false
    }
    return true
  }

  //保存
  onSave = async () => {
    let {param,skuParam,tblSku} = this.state;
    if(param.skuType === GOODS.NO_SKU){
      param.skuValue = [skuParam];
    }else {
      param.skuValue = tblSku;
    }

    //将钱转成分
    for(let i= 0;i< param.skuValue.length;i++) {
      param.skuValue[i].price = CommonFnc.yuanToCent(param.skuValue[i].price);
      param.skuValue[i].linePrice = CommonFnc.yuanToCent(param.skuValue[i].linePrice);
    }
    console.log('====param===')
    console.log(param)
    console.log(tblSku)


    if(!this.validate(param))return

    let res;
    if(param.id){
      res = await goodsApi.update(param)
    }else {
      res = await goodsApi.add(param)
    }
    if(res.code === '200') {
      message.success('保存成功')
      setTimeout(()=>{
        this.props.history.push('/goods/list');
      })
    }
  }

  //取消
  onCancel = () => {
    this.props.history.push('/goods/list');
  }

  //自定义下拉框的change事件
  onSelectChange = (obj,prop,value) => {
    let _obj = this.state[obj];
    _obj[prop] = value;
    this.setState({
      [obj]:_obj
    },()=>{
      //获得sku信息
      this.getSku(value)
    })
  }

  //获得该分类下的sku
  getSku = async (classifyId) => {
    let res = await skuApi.list({classifyId:classifyId})
    console.log('获得该分类下的sku')
    console.log(res)
    this.setState({
      sku:res
    },()=> {
      //渲染sku表格数据
      this.processTblSkuData(res)
    })
  };
  //渲染sku表格数据
  processTblSkuData = (sku) => {
    let tblSku =[];
    let _sku = [];

    for(let i=0;i< sku.length;i++){
      _sku.push(sku[i].valueList);
    }

    let _tblSku = CommonFnc.cartesianProductOf(..._sku);


    for(let m= 0;m< _tblSku.length;m++){
      let obj = {};
      let _skuValueIds = ''
      for(let n= 0;n< _tblSku[m].length;n++) {
        obj[`skuValue${n}`] = _tblSku[m][n].skuValue;
        if(n < _tblSku[m].length -1){
          _skuValueIds += `${_tblSku[m][n].id},`
        }else {
          _skuValueIds += `${_tblSku[m][n].id}`
        }
      }
      obj.skuValueIds = _skuValueIds;
      obj.fileList = [];
      obj.goodsCode = '';
      obj.stock = '';
      obj.price = '';
      obj.linePrice = '';
      tblSku.push(obj)
    }
    this.setState({
      tblSku
    })
  }

  routeToSku = () => {
    this.props.history.push('/goods/sku')
  }

  // 构建字段
  makeColumns() {
    let columns = []
    if(this.props.isMobile === 'false') {
      columns = [
        {
          title: "Sku图片",
          dataIndex: "fileList",
          key: "fileList",
          render: (text, record,idx) =>
            (
              <KtPictureWall fileList={text} onChange={onTblImageChange.bind(this,'tblSku','fileList',idx)} />
            )
        },
        {
          title: "商品编码",
          dataIndex: "goodsCode",
          key: "goodsCode",
          render: (text, record,idx) =>
            (
              <Input placeholder="商品编码" onChange={onEditTblInputChange.bind(this,'tblSku','goodsCode',idx)} value={text}/>
            )
        },
        {
          title: "商品库存",
          dataIndex: "stock",
          key: "stock",
          render: (text, record,idx) =>
            (
              <Input placeholder="商品库存" onChange={onEditTblInputChange.bind(this,'tblSku','stock',idx)} value={text}/>
            )
        },
        {
          title: "商品售价",
          dataIndex: "price",
          key: "price",
          render: (text, record,idx) =>
            (
              <Input placeholder="单位（元）" onChange={onEditTblInputChange.bind(this,'tblSku','price',idx)} value={text}/>
            )
        },
        {
          title: "商品市场价",
          dataIndex: "linePrice",
          key: "linePrice",
          render: (text, record,idx) =>
            (
              <Input placeholder="单位（元）" onChange={onEditTblInputChange.bind(this,'tblSku','linePrice',idx)} value={text}/>
            )
        },
      ];
    }
    //渲染Sku到表格
    let sku = this.state.sku;
    console.log('渲染Sku到表格')
    console.log(sku)
    let newColumns = []
    for(let i= 0;i< sku.length;i++) {
      let obj = {
        title:sku[i].name,
        dataIndex: `skuValue${i}`,
        key: "skuValue${i}"
      }
      newColumns.push(obj)
    }
    newColumns = newColumns.concat(columns);

    return newColumns;
  }


  //移动端表格适配
  expandedRowRender = (record) => {
    const columns = [
      { title: 'key', dataIndex: 'key', key: 'key', render: (text) => (<span className='muted'>{text}</span>)},
      { title: 'value', dataIndex: 'value', key: 'value', render: (text) => (<span className='weak'>{text}</span>) },
    ];
    const data = [
      {key:'商品编码',value:record.goodsCode},
      {key:'商品库存',value:record.stock},
      {key:'商品售价',value:record.price},
      {key:'市场价',value:record.linePrice},
    ];
    return <Table columns={columns} dataSource={data} pagination={false} />;
  };

  render() {
    const { param,skuParam,skuClassify,goodsClassify,sku,tblSku } = this.state;

    return (
      <div className='page-content pd10'>
        <div className='flex-left pb20'>
          <Button type='primary' onClick={this.onSave.bind(this)}>保存</Button>
          <KtSeparator comp={{width:'10px'}} />
          <Button onClick={this.onCancel.bind(this)}>取消</Button>
        </div>
        <div className='border pd10 shadow-warp bgWhite'>
          <KtTitleBar comp={{title:'基本信息'}} />
          <div className='ptb20'>
            <Row type="flex" justify="left" align="middle">
              <Col xs={8} sm={8} md={4} className='text-right pd5'><span className='major'>*</span>商品名称：</Col>
              <Col xs={16} sm={16} md={8}  className='pd5'>
                <Input placeholder="请输入商品名称" onChange={onInputChange.bind(this,'param','name')} value={param.name}/>
              </Col>
              <Col xs={8} sm={8} md={4} className='text-right pd5'><span className='major'>*</span>商品分类：</Col>
              <Col xs={16} sm={16} md={8} className='pd5'>
                <TreeSelect
                  style={{ width: '100%' }}
                  value={param.goodsClassifyId}
                  dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                  treeData={goodsClassify}
                  placeholder="请选择"
                  treeDefaultExpandAll
                  onChange={onSelectChange.bind(this,'param','goodsClassifyId')}
                />
              </Col>
            </Row>
            <KtSeparator />
            <Row type="flex" justify="left" align="middle">
              <Col xs={8} sm={8} md={4}  className='text-right pd5'>商品介绍：</Col>
              <Col xs={16} sm={16} md={8} className='pd5'>
                <Input placeholder="商品卖点简述" onChange={onInputChange.bind(this,'param','intro')} value={param.intro}/>
              </Col>
            </Row>
            <KtSeparator />
            <Row type="flex" justify="left" align="middle">
              <Col xs={8} sm={8} md={4}  className='text-right pd5'><span className='major'>*</span>商品图片：</Col>
              <Col xs={16} sm={16} md={8} className='pd5'>
                <KtPictureWall fileList={param.fileList} limit={10} onChange={onImageChange.bind(this,'param','fileList')} />
              </Col>
            </Row>
            <KtSeparator />
          </div>

          <KtTitleBar comp={{title:'规格/库存'}} />
          <div className='ptb20'>
            <Row type="flex" justify="left" align="middle">
              <Col xs={8} sm={8} md={4} className='text-right pd5'><span className='major'>*</span>商品规格：</Col>
              <Col xs={16} sm={16} md={8} className='pd5'>
                <Radio.Group onChange={onInputChange.bind(this,'param','skuType')} value={param.skuType}>
                  <Radio value={'1'}>单规格</Radio>
                  <Radio value={'2'}>多规格</Radio>
                </Radio.Group>
              </Col>
            </Row>
            <KtSeparator />
            {
              param.skuType === GOODS.NO_SKU &&
                <div>
                  <Row type="flex" justify="left" align="middle">
                    <Col xs={8} sm={8} md={4} className='text-right pd5'>商品编码：</Col>
                    <Col xs={16} sm={16} md={8} className='pd5'>
                      <Input placeholder="请输入商品编码" onChange={onInputChange.bind(this,'skuParam','goodsCode')} value={skuParam.goodsCode}/>
                    </Col>
                    <Col xs={8} sm={8} md={4} className='text-right pd5'><span className='major'>*</span>商品库存：</Col>
                    <Col xs={16} sm={16} md={8} className='pd5'>
                      <Input placeholder="请输入当前库存数量" onChange={onInputChange.bind(this,'skuParam','stock')} value={skuParam.stock}/>
                    </Col>
                  </Row>
                  <KtSeparator />
                  <Row type="flex" justify="left" align="middle">
                    <Col xs={8} sm={8} md={4} className='text-right pd5'><span className='major'>*</span>商品售价：</Col>
                    <Col xs={16} sm={16} md={8} className='pd5'>
                      <Input placeholder="请输入正常销售价格" onChange={onInputChange.bind(this,'skuParam','price')} value={skuParam.price}/>
                    </Col>
                    <Col xs={8} sm={8} md={4} className='text-right pd5'>商品市场价：</Col>
                    <Col xs={16} sm={16} md={8} className='pd5'>
                      <Input placeholder="请输入商品划线价格" onChange={onInputChange.bind(this,'skuParam','linePrice')} value={skuParam.linePrice}/>
                    </Col>
                  </Row>
                </div>
            }
            {
              param.skuType ===  GOODS.HAS_SKU &&
              <div>
                <Row type="flex" justify="left" align="middle">
                  <Col xs={8} sm={8} md={4} className='text-right pd5'><span className='major'>*</span>规格分类：</Col>
                  <Col xs={16} sm={16} md={8} className='pd5'>
                    <Select
                      style={{ width: '100%' }}
                      placeholder="请选择"
                      value={this.state.param.skuClassifyId}
                      onChange={this.onSelectChange.bind(this,'param','skuClassifyId')}
                    >
                      {
                        renderCommonSelectOption(skuClassify,'name')
                      }
                    </Select>
                  </Col>
                </Row>
                <KtSeparator />
                <Row type="flex" justify="left" align="top">
                  <Col xs={8} sm={8} md={4} className='text-right pd5'><span className='major'>*</span>选择规格：</Col>
                  <Col xs={24} sm={24} md={20} className='pd5'>
                    <div className='bgEC pd20 card'>
                      {
                        sku.length === 0 &&
                          <span className='major underline pointer' onClick={this.routeToSku.bind(this)}>* 暂无可选择的规格,点击去添加规格</span>
                      }
                      {
                        this.props.isMobile !== 'false' &&
                        <div className='major pd5'>* 手机端不支持修改，修改请前往PC端</div>
                      }
                      {
                        sku.length > 0 &&
                          <div className='bgWhite'>
                            <Table
                              columns={this.makeColumns()}
                              loading={this.state.loading}
                              dataSource={tblSku}
                              expandedRowRender={this.props.isMobile === 'false' ? false :this.expandedRowRender}
                              pagination={false}
                            />
                          </div>
                      }
                    </div>
                  </Col>
                </Row>
              </div>
            }
          </div>

          <KtTitleBar comp={{title:'商品详情'}} />
          <div className='ptb20'>
            <Row type="flex" justify="left" align="top">
              <Col xs={8} sm={8} md={4} className='text-right pd5'><span className='major'>*</span>商品详情：</Col>
              <Col xs={24} sm={24} md={8} className='pd5'>
                <KtRichText value={param.content} onChange={onRichTextChange.bind(this,'param','content')} />
              </Col>
            </Row>
            <KtSeparator />
          </div>
          <KtTitleBar comp={{title:'其他设置'}} />
          <div className='ptb20'>
            <Row type="flex" justify="left" align="top">
              <Col xs={8} sm={8} md={4} className='text-right pd5'><span className='major'>*</span>商品状态：</Col>
              <Col xs={16} sm={16} md={8} className='pd5'>
                <Radio.Group onChange={onInputChange.bind(this,'param','active')} value={this.state.param.active}>
                  <Radio value={1}>上架</Radio>
                  <Radio value={0}>下架</Radio>
                </Radio.Group>
              </Col>
            </Row>
            <KtSeparator />
            <Row type="flex" justify="left" align="middle">
              <Col xs={8} sm={8} md={4} className='text-right pd5'>初始销量：</Col>
              <Col xs={16} sm={16} md={8} className='pd5'>
                <Input placeholder="请输入初始销量" onChange={onInputChange.bind(this,'param','salesInit')} value={param.salesInit}/>
              </Col>
              <Col xs={8} sm={8} md={4} className='text-right pd5'><span className='major'>*</span>商品排序：</Col>
              <Col xs={16} sm={16} md={8} className='pd5'>
                <Input placeholder="数字越小越靠前" onChange={onInputChange.bind(this,'param','sort')} value={param.sort}/>
              </Col>
            </Row>
            <KtSeparator />
          </div>
        </div>
      </div>

    );
  }
}
