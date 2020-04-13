/**
  一些公共的action可以写在这里，比如用户登录、退出登录、权限查询等
  其他的action可以按模块不同，创建不同的js文件
**/
import { message } from "antd";
import { ACTION } from "../constant";
import { LOCAL_STORAGE } from "../../constants";

/**
 * 设置token信息
 * @params: userinfo
 * **/
export const setToken = (params = {}) => async dispatch => {
  try {
    await dispatch({
      type: ACTION.SET_TOKEN,
      payload: params
    });
    return "success";
  } catch (err) {
    message.error("网络错误，请重试");
  }
};

/**
 * 设置菜单信息
 * @params: userinfo
 * **/
export const setMenus = (params = {}) => async dispatch => {
  try {
    await dispatch({
      type: ACTION.SET_MENUS,
      payload: params
    });
    return "success";
  } catch (err) {
    message.error("网络错误，请重试");
  }
};


/**
 * 退出登录
 * @params: null
 * **/
export const onLogout = (params = {}) => async dispatch => {
  try {
    await dispatch({
      type: ACTION.LOGOUT,
      payload: null
    });
    return "success";
  } catch (err) {
    message.error("网络错误，请重试");
  }
};

/**
 * 设置用户信息
 * @params: userinfo
 * **/
export const setUserInfo = (params = {}) => async dispatch => {
  try {
    await dispatch({
      type: ACTION.SET_USER_INFO,
      payload: params
    });
    return "success";
  } catch (err) {
    message.error("网络错误，请重试");
  }
};






