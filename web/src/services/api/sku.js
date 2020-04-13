import base from './base'
import CommonFnc from "../../utils/commonFnc";

export default class skuApi extends base {


//#########################sku分类###############################//
  /**
   * 添加sku分类
   */
  static addClassify(param) {
    return this.post('/sku/classify/add',param,"/app");
  }

  /**
   * 修改sku分类
   */
  static updateClassify(param) {
    return this.post('/sku/classify/update',param,"/app");
  }

  /**
   * 删除sku分类
   */
  static deleteClassify(param) {
    return this.post('/sku/classify/delete',param,"/app");
  }

  /**
   * 查询sku分类
   */
  static classifyList(param) {
    return this.post('/sku/classify/all',param,"/app");
  }

  //#########################sku###############################//
  /**
   * 添加sku分类
   */
  static add(param) {
    return this.post('/sku/add',param,"/app");
  }

  /**
   * 修改sku分类
   */
  static update(param) {
    return this.post('/sku/update',param,"/app");
  }

  /**
   * 删除sku分类
   */
  static delete(param) {
    return this.post('/sku/delete',param,"/app");
  }

  /**
   * 查询sku分类
   */
  static list(param) {
    return this.post('/sku/all',param,"/app").then(res=>{
      return this._processSkuListData(res)
    });
  }




  //#######数据处理#########//
  static _processSkuListData(res) {
    // console.log('数据处理')
    // console.log(res)
    // let list = []
    // if(res.data) {
    //   for(let i=0; i< res.data.length;i++){
    //     let obj = res.data[i];
    //     obj.valueList = CommonFnc.stringToArr(obj.value)
    //     list.push(obj)
    //   }
    // }
    return res.data;

  }

}







