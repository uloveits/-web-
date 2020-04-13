import base from './base'

export default class userApi extends base {

  /**
   * 保存权限
   */
  static list(param) {
    return this.post('/user/all',param,'/app');
  }


}