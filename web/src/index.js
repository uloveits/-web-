/** APP入口 **/
import "core-js/stable";
import "regenerator-runtime/runtime";
import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { LocaleProvider } from 'antd';
import zh_CN from 'antd/lib/locale-provider/zh_CN';
import store from "./store";
import * as serviceWorker from "./serviceWorker";
import Router from "./router";

/** 公共样式 **/
import "./public/css/base.scss"
import "./public/css/common.scss"
import "./public/css/theme.less"


ReactDOM.render(
  <Provider store={store}>
    <LocaleProvider locale={zh_CN}>
      <Router />
    </LocaleProvider>
  </Provider>,
  document.getElementById("app-root")
);

serviceWorker.register();

if (module.hot) {
  module.hot.accept();
}
