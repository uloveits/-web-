import base from './base'

export default class goodsApi extends base {

  //#########################商品分类###############################//
  /**
   * 添加商品分类
   */
  static addClassify(param) {
    return this.post('/goods/classify/add',param,"/app");
  }

  /**
   * 修改商品分类
   */
  static updateClassify(param) {
    return this.post('/goods/classify/update',param,"/app");
  }

  /**
   * 删除商品分类
   */
  static deleteClassify(param) {
    return this.post('/goods/classify/delete',param,"/app");
  }

  /**
   * 查询商品分类
   */
  static classifyList(param) {
    return this.post('/goods/classify/all',param,"/app");
  }

  /**
   * 查询商品分类（tree）
   */
  static classifyListTree(param) {
    return this.post('/goods/classify/all/tree',param,"/app");
  }

  /**
   * 查询商品分类（tree）
   */
  static classifySelectTree(param) {
    return this.post('/goods/classify/select/tree',param,"/app");
  }

  //#########################商品###############################//

  /**
   * 添加商品分类
   */
  static add(param) {
    return this.post('/goods/add',param,"/app");
  }

  /**
   * 修改商品分类
   */
  static update(param) {
    return this.post('/goods/update',param,"/app");
  }

  /**
   * 删除商品分类
   */
  static delete(param) {
    return this.post('/goods/delete',param,"/app");
  }

  /**
   * 查询商品分类
   */
  static list(param) {
    return this.post('/goods/all',param,"/app");
  }

  /**
   * 查询商品详情
   */
  static detail(param) {
    return this.post('/goods/detail',param,"/app");
  }



}