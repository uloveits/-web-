/**
 * Created by Lyrics on 2018/11/26.
 * 接口请求通用函数
 */
import axios from 'axios';
import { message } from 'antd';
import { LOCAL_STORAGE } from "../constants";
import { baseUrl } from "../config"


const callback = (res,resolve) => {
  if (res.code == "200") {
    resolve(res)
  } else if(res.code == "402") {
    console.log('###请求接口进入402了###');
    localStorage.removeItem(LOCAL_STORAGE.USER);
    localStorage.removeItem(LOCAL_STORAGE.MENUS);
    localStorage.removeItem(LOCAL_STORAGE.TOKEN);
    if(res.msg){
      message.warn(res.msg);
    }

  }else {
    if(res.msg){
      message.warn(res.msg);
    }
    resolve(res)
  }
};

export default {
  async get (url,version="/v1") {
    try {
      let res = await axios.get(baseUrl+version+ url,
        {
          headers: {'Authorization':'Bearer '+ localStorage.getItem(LOCAL_STORAGE.TOKEN), 'Content-Type': 'application/json',}
        },
      );
      res = res.data;
      return new Promise((resolve) => {
        callback(res,resolve);
      })
    } catch (err) {
      message.warn('服务器出错');
    }
  },

  async post (url, data,version="/v1") {
    try {
      let res = await axios.post(baseUrl+version+ url, data,
        {
          headers: { 'Authorization':'Bearer '+ localStorage.getItem(LOCAL_STORAGE.TOKEN),'Content-Type': 'application/json',}
        },
      );
      res = res.data;
      return new Promise((resolve, reject) => {
        callback(res,resolve);
      })
    } catch (err) {
      message.warn('服务器出错');
    }
  },

  async put (url, data,version="/v1") {
    try {
      let res = await axios.put(baseUrl+version+ url, data,
        {
          headers: { 'Authorization':'Bearer '+ localStorage.getItem(LOCAL_STORAGE.TOKEN), 'Content-Type': 'application/json',}
        },
      );
      res = res.data;
      return new Promise((resolve, reject) => {
        callback(res,resolve);
      })
    } catch (err) {
      message.warn('服务器出错');
    }
  },

  async delete (url,version="/v1") {
    try {
      let res = await axios.delete(baseUrl+version+ url,
        {
          headers: { 'Authorization':'Bearer '+ localStorage.getItem(LOCAL_STORAGE.TOKEN),'Content-Type': 'application/json',}
        },
      );
      res = res.data;
      return new Promise((resolve, reject) => {
        callback(res,resolve);
      })
    } catch (err) {
      message.warn('服务器出错');
    }
  },
};