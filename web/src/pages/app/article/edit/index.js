import React from "react";

import P from "prop-types";
import { connect } from "react-redux";
import { Button, Input, message, Radio, Row, Col, Select } from "antd";
import "./index.scss";
import {
  onImageChange,
  onInputChange,
  onRichTextChange,
} from "../../../../utils/commonChange";

import KtSeparator from "../../../../comps/common/separator";
import KtPictureWall from "../../../../comps/common/picturesWall";
import KtRichText from "../../../../comps/common/richText";
import settingApi from "../../../../services/api/setting";
import Validate from "../../../../utils/validate";
import KtTitleBar from "../../../../comps/common/title";







const { Option } = Select;

@connect(
  state => ({
    user: state.app.user,
  })
)

export default class AppArticleEdit extends React.Component {
  static propTypes = {

  };

  constructor(props) {
    super(props);
    this.state = {
      param:{
        active:1
      }

    };
  }

  componentWillMount() {
    console.info()
  }

  componentDidMount() {
    if(this.props.location.state&&this.props.location.state.id) {
      this.getInfo()
    }
  }

  getInfo = async () => {
    let res = await  settingApi.getArticleInfo({id:this.props.location.state.id});
    if(res.code === '200') {
      this.setState({
        param:res.data
      })
    }
  }

  validate = (param) => {

    if(!Validate.required(param.title)){
      message.warn("文章标题不能为空");
      return false
    }
    if(!Validate.required(param.remark)){
      message.warn("文章标识不能为空");
      return false
    }
    if(!Validate.required(param.sort)){
      message.warn("请输入排序号");
      return false
    }
    return true
  }

  //保存
  onSave = async () => {
    let param = this.state.param;
    if(!this.validate(param))return

    let res;
    if(param.id){
      res = await settingApi.updateArticle(param)
    }else {
      res = await settingApi.addArticle(param)
    }
    if(res.code === '200') {
      message.success('保存成功')
      setTimeout(()=>{
        this.props.history.push('/app/article');
      })
    }

  }

  //取消
  onCancel = () => {
    this.props.history.push('/app/article');
  }




  render() {
    const {  } = this.state;

    return (
      <div className='page-content pd20'>
        <div className='flex-left pb20'>
          <Button type='primary' onClick={this.onSave.bind(this)}>保存</Button>
          <KtSeparator comp={{width:'10px'}} />
          <Button onClick={this.onCancel.bind(this)}>取消</Button>
        </div>
        <div className='border pd20 shadow-warp bgWhite'>
          <KtTitleBar comp={{title:'基本信息'}} />
          <div className='ptb20'>
            <Row type="flex" justify="left" align="middle">
              <Col xs={8} sm={8} md={4} className='text-right pd5'><span className='major'>*</span>标题：</Col>
              <Col xs={16} sm={16} md={8} className='pd5'>
                <Input placeholder="请输入文章标题" onChange={onInputChange.bind(this,'param','title')} value={this.state.param.title}/>
              </Col>
              <Col xs={8} sm={8} md={4} className='text-right pd5'><span className='major'>*</span>标识：</Col>
              <Col xs={16} sm={16} md={8} className='pd5'>
                <Input placeholder="请输入标识名称（接口可通过该名称获取该文章信息）" onChange={onInputChange.bind(this,'param','remark')} value={this.state.param.remark}/>
              </Col>
            </Row>
            <KtSeparator />
            <Row type="flex" justify="left" align="middle">
              <Col xs={8} sm={8} md={4} className='text-right pd5'>封面图片：</Col>
              <Col xs={16} sm={16} md={8} className='pd5'>
                <KtPictureWall fileList={this.state.param.fileList} onChange={onImageChange.bind(this,'param','fileList')} />
              </Col>
            </Row>
            <KtSeparator />
            <Row type="flex" justify="left" align="top">
              <Col xs={8} sm={8} md={4} className='text-right pd5'>内容：</Col>
              <Col xs={24} sm={24} md={8} className='pd5'>
                <KtRichText value={this.state.param.content} onChange={onRichTextChange.bind(this,'param','content')} />
              </Col>
            </Row>
            <KtSeparator />
          </div>
          <KtTitleBar comp={{title:'其他设置'}} />
          <div className='ptb20'>
            <Row type="flex" justify="left" align="middle">
              <Col xs={8} sm={8} md={4} className='text-right pd5'><span className='major'>*</span>排序：</Col>
              <Col xs={16} sm={16} md={8} className='pd5'>
                <Input placeholder="请输入排序" onChange={onInputChange.bind(this,'param','sort')} value={this.state.param.sort}/>
              </Col>
              <Col xs={8} sm={8} md={4} className='text-right pd5'>上线/下线：</Col>
              <Col xs={16} sm={16} md={8} className='pd5'>
                <Radio.Group onChange={onInputChange.bind(this,'param','active')} value={this.state.param.active}>
                  <Radio value={1}>上线</Radio>
                  <Radio value={0}>下线</Radio>
                </Radio.Group>
              </Col>
            </Row>
            <KtSeparator />
          </div>
        </div>
      </div>

    );
  }
}
