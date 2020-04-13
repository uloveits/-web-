import base from './base'

export default class settingApi extends base {

  /**
   * 添加banner图片
   */
  static addBanner(param) {
    return this.post('/setting/banner/add',param,"/app");
  }

  /**
   * 修改banner图片
   */
  static updateBanner(param) {
    return this.post('/setting/banner/update',param,"/app");
  }

  /**
   * 删除banner图片
   */
  static deleteBanner(param) {
    return this.post('/setting/banner/delete',param,"/app");
  }

  /**
   * 查询banner图片
   */
  static bannerList(param) {
    return this.post('/setting/banner/all',param,"/app");
  }

  //****************************************************************************//

  /**
   * 添加文章
   */
  static addArticle(param) {
    return this.post('/setting/article/add',param,"/app");
  }

  /**
   * 修改文章
   */
  static updateArticle(param) {
    return this.post('/setting/article/update',param,"/app");
  }

  /**
   * 删除文章
   */
  static deleteArticle(param) {
    return this.post('/setting/article/delete',param,"/app");
  }

  /**
   * 查询文章
   */
  static articleList(param) {
    return this.post('/setting/article/all',param,"/app");
  }

  /**
   * 查询文章详情
   */
  static getArticleInfo(param) {
    return this.post('/setting/article/detail',param,"/app");
  }

  //****************************************************************************//

  /**
   * 添加首页导航
   */
  static addNavigate(param) {
    return this.post('/setting/navigate/add',param,"/app");
  }

  /**
   * 修改首页导航
   */
  static updateNavigate(param) {
    return this.post('/setting/navigate/update',param,"/app");
  }

  /**
   * 删除首页导航
   */
  static deleteNavigate(param) {
    return this.post('/setting/navigate/delete',param,"/app");
  }

  /**
   * 查询首页导航
   */
  static navigateList(param) {
    return this.post('/setting/navigate/all',param,"/app");
  }

  //****************************************************************************//

  /**
   * 添加联系我们
   */
  static addContact(param) {
    return this.post('/setting/contact/add',param,"/app");
  }

  /**
   * 修改联系我们
   */
  static updateContact(param) {
    return this.post('/setting/contact/update',param,"/app");
  }

  /**
   * 删除联系我们
   */
  static deleteContact(param) {
    return this.post('/setting/contact/delete',param,"/app");
  }


  /**
   * 查询联系我们
   */
  static contactList(param) {
    return this.post('/setting/contact/all',param,"/app");
  }

}