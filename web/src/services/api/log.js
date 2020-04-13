import base from './base'

export default class logApi extends base {

  /**
   * 登陆日志
   */
  static loginList(param) {
    return this.post('/log/login/all',param);
  }

  /**
   * 删除
   */
  static loginDelete(param) {
    return this.post('/log/login/delete',param);
  }

  /**
   * 操作日志
   */
  static actionList(param) {
    return this.post('/log/action/all',param);
  }

  /**
   * 删除
   */
  static actionDelete(param) {
    return this.post('/log/action/delete',param);
  }

}