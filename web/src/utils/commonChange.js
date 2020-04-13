import React from 'react';
import {Select } from 'antd';
const Option = Select.Option;

/**
 * Input的change事件
 * @param obj
 * @param prop
 * @param e
 */
export function onInputChange(obj,prop,e){
  let _obj = this.state[obj];
  _obj[prop] = e.target.value;
  this.setState({
    [obj]:_obj
  })
}


/**
 * 表格Input的change事件
 * @param obj
 * @param prop
 * @param e
 */
export function onEditTblInputChange(obj,prop,idx,e){
  console.log(1)
  let _obj = this.state[obj];
  _obj[idx][prop] = e.target.value;
  this.setState({
    [obj]:_obj
  })
}

/**
 * 图片的change事件
 * @param obj
 * @param prop
 * @param fileList
 */
export function onImageChange(obj,prop,fileList){
  console.log('图片的change事件')
  console.log(fileList)
  let _obj = this.state[obj];
  _obj[prop] =  _obj[prop] || [];
  _obj[prop] = _obj[prop].concat(fileList);
  this.setState({
    [obj]:_obj
  })
}

/**
 * 图片的删除事件
 * @param obj
 * @param prop
 * @param fileList
 */
export function onImageDelete(obj,prop,id){
  console.log('图片的删除事件')
  console.log(fileList);

  let _obj = this.state[obj];
  _obj[prop] =  _obj[prop] || [];
  for (let index = 0, len = _obj[prop].length; index < len; index++) {
    if (_obj[prop][index].uid === file.uid) {
      _obj[prop].splice(index, 1);
      break;
    }
  }
  this.setState({
    [obj]:_obj
  })
}

/**
 * 表格图片的change事件
 * @param obj
 * @param prop
 * @param fileList
 */
export function onTblImageChange(obj,prop,idx,fileList){
  console.log('表格图片的change事件')
  console.log(fileList)
  let _obj = this.state[obj];
  _obj[idx][prop] =  _obj[idx][prop] || [];
  _obj[idx][prop] = _obj[idx][prop].concat(fileList);
  this.setState({
    [obj]:_obj
  })
}

/**
 * 图片的change事件
 * @param obj
 * @param prop
 * @param fileList
 */
export function onRichTextChange(obj,prop,html){
  console.log(html)
  let _obj = this.state[obj];
  _obj[prop] = html;
  this.setState({
    [obj]:_obj
  })
}

/**
 * TextArea的change事件
 * @param obj
 * @param prop
 * @param e
 */
export function onTextAreaChange(obj,prop,e){
  let _obj = this.state[obj];
  _obj[prop] = e.target.value;
  this.setState({
    [obj]:_obj
  })
}

export function onSelectChange(obj,prop,value){
  let _obj = this.state[obj];
  _obj[prop] = value;
  this.setState({
    [obj]:_obj
  })
}

export function renderSelectOption(item){
  let options = [];
  for (let i = 0; i < item.length; i++) {
    let _option = <Option key={item[i].roleId}>{item[i].roleName}</Option>;
    options.push(_option);
  }
  return options
}

export function renderCommonSelectOption(item,type='value'){
  let options = [];
  for (let i = 0; i < item.length; i++) {
    let _option = <Option key={item[i].id}>{item[i][type]}</Option>;
    options.push(_option);
  }
  return options
}

export function onRangeDateChange(obj,prop,date,dateString){
  console.log('=====')
  console.log(date)
  console.log(dateString)
  // let _obj = this.state[obj];
  // _obj[prop] = value;
  // this.setState({
  //   [obj]:_obj
  // })
}


