import base from './base'

export default class orderApi extends base {


  //#########################订单###############################//

  /**
   * 修改商品分类
   */
  static update(param) {
    return this.post('/order/update',param,"/app");
  }

  /**
   * 删除商品分类
   */
  static delete(param) {
    return this.post('/order/delete',param,"/app");
  }

  /**
   * 查询商品分类
   */
  static list(param) {
    return this.post('/order/all',param,"/app");
  }

  /**
   * 查询商品详情
   */
  static detail(param) {
    return this.post('/order/detail',param,"/app");
  }



}