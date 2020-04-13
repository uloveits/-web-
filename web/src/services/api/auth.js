import base from './base'

export default class authApi extends base {

  /**
   * 登录
   */
  static login(param) {
    return this.post('/user/login',param);
  }

  /**
   * 用户的菜单信息
   */
  static menus() {
    return this.get('/user/read/permission');
  }

  /**
   * 修改密码
   */
  static updatePsw(param) {
    return this.post('/user/psw',param);
  }

  /**
   * APi 文档接口
   */
  static apiDocs() {
    return this.get(`/api-docs`,"/v2")
  }

  /**
   * 保存权限
   */
  static saveAuth(param) {
    return this.post('/authorities/sync',param);
  }


}