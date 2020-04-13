/** 基础页面结构 - 有头部，有底部，有侧边导航 **/

import React from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import P from "prop-types";
import { Route, Switch, Redirect } from "react-router-dom";
import Loadable from "react-loadable";
import { Layout, message } from "antd";
import Loading from "../../common/loading";
import KtComMenu from "../menu";
import KtComHeader from "../header";
import KtComBread from "../bread";
import KtComFooter from "../footer";
import "./index.scss";
import AllComps from "../../../router/config"

const [NotFound,ArticleEdit,OrderDetail] = [
  () => import(`../../../pages/error/404`),
  () => import(`../../../pages/app/article/edit`),
  () => import(`../../../pages/order/detail`),
].map(item => {
  return Loadable({
    loader: item,
    loading: Loading
  });
});

import { onLogout, setUserInfo } from "../../../store/action/auth";
import { LOCAL_STORAGE } from "../../../constants";
import KtSeparator from "../../common/separator";


const { Content,Footer } = Layout;
@connect(
  state => ({
    user: state.app.user,
    menus: state.app.menus,
    isMobile: state.common.isMobile
  }),
  dispatch => ({
    actions: bindActionCreators(
      { onLogout, setUserInfo },
      dispatch
    )
  })
)

export default class AppContainer extends React.Component {
  static propTypes = {
    location: P.any,
    history: P.any,
    actions: P.any,
    user: P.any,
    menus: P.array
  };

  constructor(props) {
    super(props);
    this.state = {
      collapsed: false, // 侧边栏是否收起
      popLoading: false, // 用户消息是否正在加载
      clearLoading: false // 用户消息是否正在清楚
    };
  }

  /** 点击切换菜单状态 **/
  onToggle = () => {
    this.setState({
      collapsed: !this.state.collapsed
    });
  };

  /**
   * 退出登录
   * **/
  onLogout = () => {
    this.props.actions.onLogout().then(() => {
      message.success("退出成功");
      localStorage.removeItem(LOCAL_STORAGE.USER);
      localStorage.removeItem(LOCAL_STORAGE.MENUS);
      localStorage.removeItem(LOCAL_STORAGE.TOKEN);
      this.props.history.push("/user/login");
    });
  };


  /** 切换路由时触发 **/
  onEnter(Component, props) {
    console.log('切换路由时触发')
    console.log(props)
    return <Component {...props} />;
  }

  render() {
    const { menus,isMobile } = this.props;

    return (
      <Layout className="page-basic">
        {
          isMobile === 'false' &&
          <KtComMenu
          data={menus}
          collapsed={this.state.collapsed}
          location={this.props.location}
          />
        }

        <Layout style={{flexDirection: 'column'}}>
          <KtComHeader
            collapsed={this.state.collapsed}
            user={this.props.user}
            onToggle={this.onToggle}
            onLogout={this.onLogout}
            getNews={this.getNews}
            clearNews={this.clearNews}
            newsData={this.state.newsData}
            newsTotal={this.state.newsTotal}
            popLoading={this.state.popLoading}
            clearLoading={this.state.clearLoading}
            location={this.props.location}
          />
          <KtComBread menus={this.props.menus} location={this.props.location} />
          <Content className="content">
            <Switch>
              <Redirect exact from="/" to="/home" />
              {
                menus.map((menu)=>{
                  const route = menu => {
                    const Component = AllComps[menu.key.replace(/\//g,"_")];
                    return (
                      <Route
                        key={menu.key}
                        exact
                        path={menu.key}
                        render={props => this.onEnter(Component, props)}
                      />
                    )
                  };
                  return menu.children.length === 0 ? route(menu) : menu.children.map(r => route(r));
                })
              }

              {/*非菜单路由*/}
              <Route exact path="/app/article/edit" component={ArticleEdit} />
              <Route exact path="/order/detail" component={OrderDetail} />

              <Route exact path="/nopower" component={NotFound} />
              <Route component={NotFound} />
            </Switch>
            <KtSeparator comp={{height:'80px',bgColor:'#fff'}} />
          </Content>
          {/*<KtComFooter />*/}
          <Footer style={{ textAlign: 'center' }}>
            管理后台 ©{new Date().getFullYear()}
          </Footer>
        </Layout>
      </Layout>
    );
  }
}
