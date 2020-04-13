import React from "react";
import {Icon, message, Modal, Upload} from 'antd';
import PropTypes from "prop-types";
import "./index.scss";
import { baseUrl } from "../../../config";
import sysApi from "../../../services/api/system";

export default class KtPictureWall extends React.Component {

  state = {
    loading: false,
    uploadedImageList: [],          //已上传图片
    previewImageVisible: false,     //是否预览图片标识
    previewImageUrl: '',            //预览图片的URL
    previewImageName: '',           //预览图片的名称
  }

  //设置props默认值
  static defaultProps = {
    fileList: [],          //设置默认上传的图片 格式:imageList: [{ uid: '对应文档库uuid', name: '图片名称',status: 'done', url: '图片url'}]
    limit: 1,       //最多允许上传多少张图片 默认为1张
    size: 2,        //默认上传大小限制2MB
    disabled: false,        //是否禁用
    onRemove: () => {       //删除成功回调
    },
    onChange: () => {
    },                      //值改变时的回调
  };



  //组件render之前组装已经上传成功的图片信息uploadedImageList,主要用于回显图片
  componentWillMount() {
    console.log('componentWillMount');
    console.log(this.props.fileList)
    const { fileList } = this.props;
    let _uploadedImageList = [];
    for(let i=0; i< fileList.length;i++){
      let obj = {
        uid:fileList[i].id,
        name:fileList[i].name,
        status:'done',
        url:fileList[i].url,
      };
      _uploadedImageList.push(obj)
    }
    this.setState({
      uploadedImageList:_uploadedImageList
    })
  }

  componentWillReceiveProps(nextProps) {
    console.log('componentWillReceiveProps');
    console.log(nextProps)
    const { fileList } = nextProps;
    let _uploadedImageList = [];
    for(let i=0; i< fileList.length;i++){
      let obj = {
        uid:fileList[i].id,
        name:fileList[i].name,
        status:'done',
        url:fileList[i].url,
      };
      _uploadedImageList.push(obj)
    }
    this.setState({
      uploadedImageList:_uploadedImageList
    })
  }
 

  //图片预览事件
  handlePreview = (file) => {
    this.setState({
      previewImageUrl: file.url || file.thumbUrl,
      previewImageName: file.name,
      previewImageVisible: true
    });
  };

  //取消图片预览事件
  handlePreviewCancel = () => {
    this.setState({
      previewImageVisible: false
    });
  };

  //文件上传改变事件
  handleChange = (e) => {
    console.log(e);
    let fileList = e.fileList;
    let fileStatus = e.file.status;

    this.setState({
      uploadedImageList: fileList,
    });

    if (fileStatus === 'uploading') {    //上传中
      console.log('uploading....');
    } else if (fileStatus === 'done') {
      this.getUploadedImage(fileList)
    }
  };


  //获取上传成功的图片
  getUploadedImage = (fileList) => {
    let uploadedImageList = [];
    fileList.map(file => {
     if(file.response){
        uploadedImageList.push(file.response.data[0]);
      }
    });

    //父组件回调方法，在父组件可以拿到已经上传成功的图片信息
    if (this.props.onChange && typeof this.props.onChange === "function") {
      this.props.onChange(uploadedImageList);
    }
  };

  //上传文件之前的钩子，参数为准备上传的文件，若返回 false 则停止上传
  //一般在beforeUpload方法内限制文件上传的格式以及大小
  handelBeforeUpload = (file) => {
    let fileType = file.type;
    let fileName = file.name;
    //判断是否支持该文件格式
    let isInvalidFileType = !fileType || fileType.length < 1;
    if (isInvalidFileType) {
      message.error('抱歉，不支持上传该格式的文件！');
      return !isInvalidFileType;
    }

    let availFileSuffix = ['.png', '.PNG', '.jpg', '.JPG', '.bpm', '.BPM', '.gif', '.GIF'];
    let fileSuffixName = fileName.substring(file.name.lastIndexOf('.'));
    let isAvailableSuffix = availFileSuffix.includes(fileSuffixName);
    if (!isAvailableSuffix) {
      let msg = '抱歉，只支持上传【' + availFileSuffix.join(' || ') + '】格式的文件！';
      message.error(msg);
      return isAvailableSuffix;
    }

    //限制上传文件大小(默认上传大小限制2MB)
    let availSize = this.props.numberOfSize || 2;
    let fileSize = file.size / 1024 / 1024;
    const isOverSize = fileSize > availSize;

    if (isOverSize) {
      let msg = '抱歉，上传文件大小最大不能超过' + availSize + 'M！';
      message.error(msg);
      return !isOverSize;
    }
    return true;
  };

  //删除图片事件
  handleRemove = async(file) => {
    console.log('删除图片事件')
    console.log(file)

    let uploadedImageList = this.state.uploadedImageList;
    for (let index = 0, len = uploadedImageList.length; index < len; index++) {
      if (uploadedImageList[index].uid === file.uid) {
        uploadedImageList.splice(index, 1);
        break;
      }
    }
    this.setState({
      uploadedImageList: uploadedImageList
    });


    if (this.props.onRemove && typeof this.props.onRemove === 'function') {
      this.props.onRemove(file.uid);
    }

    //删除数据库
    await sysApi.deleteUpload({id:file.uid})

  };

  render() {
    const {previewImageVisible, previewImageUrl, uploadedImageList, previewImageName} = this.state;
    const limit = this.props.limit || 1;    //默认最多上传一张图片

    const uploadButton = (
      <div>
        <Icon type={this.state.loading ? 'loading' : 'plus'} />
        <div className="ant-upload-text">上传文件</div>
      </div>
    );

    const params = {
      name: 'file',
      action: baseUrl + '/app/upload',  //图片上传路径
      accept: 'image/*',   //接受上传的文件类型,指定为image/**的话，弹出选择文件窗口的时候只会显示图片类型文件，过滤掉.txt、.xsl等非图片文件
      listType: 'picture-card',  //图片墙样式
      multiple: false,  //是否允许多选
      fileList: uploadedImageList,  //已上传的图片
      onRemove: this.handleRemove,  //删除执行的方法
      beforeUpload: this.handelBeforeUpload, //图片上传前执行的方法
      onPreview: this.handlePreview, //预览图片执行的方法
      onChange: this.handleChange,  //值改变执行的方法
    };

    return (
      <div className="clearfix">
        <Upload {...params}>
          {uploadedImageList.length >= limit ? null : uploadButton}
        </Upload>
        <Modal visible={previewImageVisible} footer={null} onCancel={this.handlePreviewCancel}>
          <img alt={previewImageName} style={{width: '100%'}} src={previewImageUrl}/>
        </Modal>
      </div>
    );
  }
}

//属性检查
KtPictureWall.PropTypes = {
  imageList: PropTypes.array,         //初始化图片信息
  limit: PropTypes.number,    //允许上传的图片张数
  size: PropTypes.number,     //允许上传的图片大小
  disabled: PropTypes.bool,           //是否禁用
  onRemove: PropTypes.func,           //删除成功回调
  onChange: PropTypes.func,           //值改变回调
};
