/** 通用reducer **/
import { ACTION } from "../constant";
import { LOCAL_STORAGE } from "../../constants";

const initState = {
  isMobile:localStorage.getItem(LOCAL_STORAGE.IS_MOBILE) || 'false', //响应式设计
};

const actDefault = state => state;

const setIsMobile = (state, { payload }) => {
  console.log('====setIsMobile====')
  console.log(payload)
  return Object.assign({}, state, {
    isMobile: payload,
  });
};

const reducerFn = (state = initState, action) => {
  switch (action.type) {
    case ACTION.IS_MOBILE: // 退出登录，清除用户信息
      return setIsMobile(state, action);
    default:
      return actDefault(state, action);
  }
};

export default reducerFn;
