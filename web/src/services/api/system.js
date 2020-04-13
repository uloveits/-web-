import base from './base'

export default class sysApi extends base {

  /**
   * 所有用户信息
   */
  static allUser (param) {
    return this.post('/user/all',param).then(res =>{
      return this._processUserInfoData(res);
    });
  }
  /**
   * 添加用户信息
   */
  static addUser(param){
    return this.post('/user/add',param);
  }

  /**
   * 修改用户信息
   */
  static updateUser(param){
    return this.post('/user/update',param);
  }

  /**
   * 删除用户
   */
  static delUser(param){
    return this.post(`/user/delete`,param);
  }

  /**
   * 重置用户密码
   */
  static resetPsw(param) {
    return this.post(`/user/psw/reset`,param);
  }



  /**
   * 所有角色信息
   */
  static allRole (param) {
    return this.post('/role/all',param);
  }

  /**
   * 添加角色信息
   */
  static addRole(param){
    return this.post('/role/add',param);
  }

  /**
   * 修改角色信息
   */
  static updateRole(param){
    return this.post('/role/update',param);
  }

  /**
   * 删除角色
   */
  static delRole(param){
    return this.post(`/role/delete`,param);
  }

  /**
   * 添加角色的菜单权限
   */
  static addRoleMenu(param) {
    return this.post(`/role/addMenu`,param);
  }

  /**
   * 查询角色的菜单权限
   */
  static getRoleMenu(param) {
    return this.post(`/role/getMenu`,param).then(res =>{
      return this._processGetRoleMenuData(res);
    });
  }

  /**
   * 添加角色的接口权限
   */
  static addRoleAuth(param) {
    return this.post(`/authorities/role/add`, param);
  }


  /**
   * 删除角色的接口权限
   */
  static deleteRoleAuth(param) {
    return this.post(`/authorities/role/delete`,param);
  }




  /**
   * 所有的菜单信息
   */
  static allMenu(){
    return this.get(`/menu/all/tree`);
  }

  /**
   * 所有的菜单信息
   */
  static menuByParentId(param){
    return this.post(`/menu/all/page`,param);
  }

  /**
   * 添加菜单
   */
  static addMenu(param) {
    return this.post(`/menu/add`,param);
  }
  /**
   * 修改菜单信息
   */
  static updateMenu(param){
    return this.post('/menu/update',param);
  }

  /**
   * 删除菜单
   */
  static delMenu(param){
    return this.post(`/menu/delete`,param);
  }


  /**
   * 所有的权限信息
   */
  static allPower(param){
    return this.post(`/authorities/all`,param);
  }



  /**
   *  删除文件
   * @param param
   */
  static deleteUpload(param){
    return this.post(`/upload/delete`,param,'/app');
  }



  /**=================数据处理==============**/

  static _processUserInfoData(res) {
    for(let i=0;i<res.data.length;i++) {
      let _rolesId = [];
      for(let j=0;j<res.data[i].roles.length;j++){
        _rolesId.push(res.data[i].roles[j].roleId.toString())
      }
      res.data[i].rolesId = _rolesId
    }
    return res.data;
  }

  static _processGetRoleMenuData(res) {
    let list = [];
    for(let i=0; i< res.data.length; i++) {
      list.push(res.data[i].menuId.toString())
    }
    return list;
  }


}