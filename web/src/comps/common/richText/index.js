import React from "react";
// 引入编辑器组件
import BraftEditor from 'braft-editor'
import { ContentUtils } from 'braft-utils'
import { ImageUtils } from 'braft-finder'
import { Upload,Icon,Button } from 'antd'
// 引入编辑器样式
import 'braft-editor/dist/index.css'
import "./index.scss";
import { baseUrl } from "../../../config";


export default class KtRichText extends React.Component  {

  state = {
    // 创建一个空的editorState作为初始值
    editorState: BraftEditor.createEditorState(null)
  }

  componentWillReceiveProps (nextProps) {
    console.log('componentWillReceiveProps')

    if(this.state.editorState.toHTML() !== nextProps.value){
      console.log('不一样')
      this.setState({
        editorState: BraftEditor.createEditorState(nextProps.value)
      })
    }

  }
  componentDidMount () {

    //使用BraftEditor.createEditorState将html字符串转换为编辑器需要的editorStat
    console.log('componentDidMount');
    console.log(this.props.value);
    // this.setState({
    //   editorState: BraftEditor.createEditorState(this.props.value)
    // })
  }

  submitContent = async () => {
    // 在编辑器获得焦点时按下ctrl+s会执行此方法
    // 编辑器内容提交到服务端之前，可直接调用editorState.toHTML()来获取HTML格式的内容
    //const htmlContent = this.state.editorState.toHTML()
   // const result = await saveEditorContent(htmlContent)
  }

  handleEditorChange = (editorState) => {
    this.setState({ editorState },()=>{
      //将editorState数据转换成RAW字符串
      //editorState.toRAW()方法接收一个布尔值参数，用于决定是否返回RAW JSON对象，默认是false
     // const rawString = this.state.editorState.toRAW();

      //将editorState数据转换成html字符串
      const htmlString = this.state.editorState.toHTML();

      this.props.onChange(htmlString)
    })

  }

  uploadHandler = (param) => {
    if (!param.file) {
      return false
    }
    if(param.file.response){
      this.setState({
        editorState: ContentUtils.insertMedias(this.state.editorState, [{
          type: 'IMAGE',
          url: param.file.response.data[0].url
        }])
      })
    }
  }

  render () {
    const { editorState } = this.state
    // 'blockquote''bold''code''clear''emoji''font-family''font-size''fullscreen''headings''hr''italic'
    // 'letter-spacing''line-height''link''list-ol''list-ul''media''redo''remove-styles''separator''strike-through'
    // 'superscript''subscript''text-align''text-color''text-indent''underline''undo''table';
    const controls = ['undo','redo','separator','bold', 'italic', 'underline', 'text-color','blockquote','code','letter-spacing','line-height',
      'font-size','font-family','separator','text-align','text-indent',
      'separator', 'link', 'separator'];
    const extendControls = [
      {
        key: 'antd-uploader',
        type: 'component',
        component: (
          <Upload
            action={baseUrl + '/app/upload'}
            accept="image/*"
            showUploadList={false}
            onChange={this.uploadHandler}
          >
            {/* 这里的按钮最好加上type="button"，以避免在表单容器中触发表单提交，用Antd的Button组件则无需如此 */}
            <Button className="control-item button upload-button" data-title="插入图片">
              <Icon type="picture" theme="filled" />
            </Button>
          </Upload>
        )
      }
    ]

    return (
      <BraftEditor
        value={editorState}
        onChange={this.handleEditorChange}
        onSave={this.submitContent}
        controls={controls}
        extendControls={extendControls}
      />
    )

  }
}
