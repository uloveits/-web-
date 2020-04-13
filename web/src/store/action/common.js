/**
  一些公共的action可以写在这里，比如用户登录、退出登录、权限查询等
  其他的action可以按模块不同，创建不同的js文件
**/
import { message } from "antd";
import { ACTION } from "../constant";

/**
 * 设置响应式
 * @params: {}
 * **/
export const setIsMobile = (params = {}) => async dispatch => {
  try {
    await dispatch({
      type: ACTION.IS_MOBILE,
      payload: params
    });
    return "success";
  } catch (err) {
    message.error("网络错误，请重试");
  }
};







