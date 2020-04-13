/** 基础页面结构 - 有头部，有底部，有侧边导航 **/

import React from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import P from "prop-types";
import Loadable from "react-loadable";
import { Route, Switch, Redirect } from "react-router-dom";

import { Layout } from "antd";
import Loading from "../../common/loading";
import Footer from "../footer";
import "./index.scss";

const [NotFound, Login] = [
  () => import("../../../pages/error/404"),
  () => import("../../../pages/login")
].map(item => {
  return Loadable({
    loader: item,
    loading: Loading
  });
});

const { Content } = Layout;
@connect(
  state => ({}),
  dispatch => ({
    actions: bindActionCreators({}, dispatch)
  })
)
export default class AppContainer extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      collapsed: false // 侧边栏是否收起
    };
  }

  // 点击切换
  onToggle = () => {
    this.setState({
      collapsed: !this.state.collapsed
    });
  };

  render() {
    return (
      <Layout className="page-user">
        <Content className="content">
          <Switch>
            <Redirect exact from="/user" to="/user/login" />
            <Route exact path="/user/login" component={Login} />
            <Route component={NotFound} />
          </Switch>
        </Content>
        <Footer />
      </Layout>
    );
  }
}

// ==================
// PropTypes
// ==================

AppContainer.propTypes = {
  location: P.any,
  history: P.any,
  actions: P.any
};
