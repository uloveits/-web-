/** 通用reducer **/
import { ACTION } from "../constant";
import { LOCAL_STORAGE } from "../../constants";

const initState = {
  token:localStorage.getItem(LOCAL_STORAGE.TOKEN) || null, //用户登陆返回的token
  user: JSON.parse(localStorage.getItem(LOCAL_STORAGE.USER)) || null, // 当前用户基本信息
  menus: JSON.parse(localStorage.getItem(LOCAL_STORAGE.MENUS))|| [], // 当前用户所有已授权的菜单
};

const actDefault = state => state;

const setToken = (state, { payload }) => {
  console.log('====setToken====')
  console.log(payload)
  return Object.assign({}, state, {
    token: payload,
  });
};

const setMenus = (state, { payload }) => {
  console.log('====setMenus====')
  console.log(payload)
  return Object.assign({}, state, {
    menus: payload,
  });
};

const onLogout = (state, { payload }) => {
  localStorage.removeItem(LOCAL_STORAGE.USER);
  localStorage.removeItem(LOCAL_STORAGE.MENUS);
  localStorage.removeItem(LOCAL_STORAGE.TOKEN);
  return Object.assign({}, state, {
    token: null,
    user: null,
    menus: [],
  });
};

const setUserInfo = (state, { payload }) => {
  console.log('====setUserInfo====')
  console.log(payload)
  return Object.assign({}, state, {
    user: payload,
  });
};

const reducerFn = (state = initState, action) => {
  switch (action.type) {
    case ACTION.LOGOUT: // 退出登录，清除用户信息
      return onLogout(state, action);
    case ACTION.SET_TOKEN: // 设置用户信息，登录成功时、同步sessionStorage中的用户信息时 触发
      return setToken(state, action);
    case ACTION.SET_MENUS: // 设置用户信息，登录成功时、同步sessionStorage中的用户信息时 触发
      return setMenus(state, action);
    case ACTION.SET_USER_INFO: // 设置用户信息，登录成功时、同步sessionStorage中的用户信息时 触发
      return setUserInfo(state, action);
    default:
      return actDefault(state, action);
  }
};

export default reducerFn;
