/** 头部 **/
import React from "react";
import P from "prop-types";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { Layout, Icon, Tooltip, Menu, Dropdown, Modal, Row, Col, Input,message,Popover } from "antd";

import "./index.scss";
import { onInputChange } from "../../../utils/commonChange";
import KtSeparator from "../../common/separator";
import Validate from "../../../utils/validate";
import authApi from "../../../services/api/auth";
import KtComMenu from "../menu";
const { Header } = Layout;

@connect(
  state => ({
    menus: state.app.menus,
    isMobile: state.common.isMobile
  }),
)
export default class KtComHeader extends React.Component {

  state = {
    fullScreen: false, // 当前是否是全屏状态
    isEditPsw: false,
    visible: false,
    param: {},
  };

  /** 点击左侧按钮时触发 **/
  toggle = () => {
    this.props.onToggle();
  };

  /**
   * 进入全屏
   * **/
  requestFullScreen = () => {
    const element = document.documentElement;
    // 判断各种浏览器，找到正确的方法
    const requestMethod =
      element.requestFullScreen || //W3C
      element.webkitRequestFullScreen || //Chrome等
      element.mozRequestFullScreen || //FireFox
      element.msRequestFullScreen; //IE11
    if (requestMethod) {
      requestMethod.call(element);
    } else if (typeof window.ActiveXObject !== "undefined") {
      //for Internet Explorer
      const wscript = new ActiveXObject("WScript.Shell");
      if (wscript !== null) {
        wscript.SendKeys("{F11}");
      }
    }
    this.setState({
      fullScreen: true
    });
  };

  /**
   * 退出全屏
   */
  exitFullScreen = () => {
    // 判断各种浏览器，找到正确的方法
    const exitMethod =
      document.exitFullscreen || //W3C
      document.mozCancelFullScreen || //Chrome等
      document.webkitExitFullscreen;
    if (exitMethod) {
      exitMethod.call(document);
    } else if (typeof window.ActiveXObject !== "undefined") {
      //for Internet Explorer
      const wscript = new ActiveXObject("WScript.Shell");
      if (wscript !== null) {
        wscript.SendKeys("{F11}");
      }
    }
    this.setState({
      fullScreen: false
    });
  };

  /**
   * 退出登录
   * **/
  onMenuClick = e => {
    if (e.key === "logout") {
      // 退出按钮被点击
      this.props.onLogout();
    }else if(e.key === "editPsw") {
      this.setState({
        isEditPsw:true
      })
    }
  };

  isCheck = (param) => {
    if(!Validate.required(param.oldPsw || '')){
      message.error("原密码不能为空！")
      return false
    }
    if(!Validate.required(param.newPsw || '')){
      message.error("新密码不能为空！")
      return false
    }
    if(!Validate.required(param.newPsw2 || '')){
      message.error("请确认你的新密码！")
      return false
    }
    if(!Validate.equalTo(param.newPsw,param.newPsw2)){
      message.error("两次密码输入的不一致！")
      return false
    }
    return true
  }

  onOK = async () => {
    let { param } = this.state;
    if(!this.isCheck(param)) return

    let res = await authApi.updatePsw(param)
    if(res.code === '200'){
      message.success("修改成功")
      this.props.onLogout();
    }
  }

  onClose = () => {
    this.setState({
      isEditPsw:false
    })
  }
  handleVisibleChange = () => {
    this.setState({
      visible:!this.state.visible
    });
  };

  render() {
    const u = this.props.user;
    const { param,visible } = this.state;
    const { isMobile,menus,location } = this.props;
    return (
      <div>
        <Header className="header">
          {
            isMobile === 'false'
            ? <Tooltip
                placement="bottom"
                title={this.props.collapsed ? "展开菜单" : "收起菜单"}
              >
                <Icon
                  className={
                    this.props.collapsed
                      ? "trigger flex-none"
                      : "trigger flex-none fold"
                  }
                  type={"menu-unfold"}
                  onClick={this.toggle}
                />
              </Tooltip>
              : <div className='align-center'>
                <Icon type="bars" className="trigger flex-none" style={{padding:'0 15px'}} onClick={this.handleVisibleChange} />
                {/*<div className='font-weight'>管理后台</div>*/}
              </div>
          }
          <div className="rightBox flex-auto flex-row flex-je flex-ac">
            {
              isMobile === 'false' &&
              <Tooltip
                placement="bottom"
                title={this.state.fullScreen ? "退出全屏" : "全屏"}
              >
                <div className="full">
                  <Icon
                    className="icon flex-none"
                    type={this.state.fullScreen ? "shrink" : "arrows-alt"}
                    onClick={
                      this.state.fullScreen
                        ? this.exitFullScreen
                        : this.requestFullScreen
                    }
                  />
                </div>
              </Tooltip>
            }
            {u ? (
              <Dropdown
                overlay={
                  <Menu
                    className="menu"
                    selectedKeys={[]}
                    onClick={this.onMenuClick}
                  >
                    <Menu.Item key="editPsw">
                      <Icon type="lock" />
                      修改密码
                    </Menu.Item>
                    <Menu.Item key="logout">
                      <Icon type="logout" />
                      退出登录
                    </Menu.Item>
                  </Menu>
                }
                placement="bottomRight"
              >
                <div className="userhead flex-row flex-ac">
                  <div className="iconfont icon-usercenter" />
                  <div className="username">{u.nickName}</div>
                </div>
              </Dropdown>
            ) : (
              <Tooltip placement="bottom" title="点击登录">
                <div className="full">
                  <Link to="/user/login">未登录</Link>
                </div>
              </Tooltip>
            )}
          </div>
        </Header>

        {
          visible && isMobile !== 'false' &&
          <div style={{position:'absolute',top:'60px',left:'10px',zIndex:1000}}>
            <KtComMenu
              data={menus}
              collapsed={false}
              location={location}
              onCallback={this.handleVisibleChange}
            />
          </div>
        }

        <Modal
          title="修改密码"
          visible={this.state.isEditPsw}
          maskClosable={false}
          onOk={this.onOK}
          onCancel={this.onClose}
          okText="确认"
          cancelText="取消"
        >
          <div>
            <Row type="flex" justify="center" align="middle">
              <Col span={5}>原密码：</Col>
              <Col span={10}>
                <Input.Password placeholder="请输入原密码" password onChange={onInputChange.bind(this,'param','oldPsw')} value={param.oldPsw} />
              </Col>
            </Row>
            <KtSeparator />
            <Row type="flex" justify="center" align="middle">
              <Col span={5}>新密码：</Col>
              <Col span={10}>
                <Input.Password placeholder="请输入新密码" password onChange={onInputChange.bind(this,'param','newPsw')} value={param.newPsw}/>
              </Col>
            </Row>
            <KtSeparator />
            <Row type="flex" justify="center" align="middle">
              <Col span={5}>确认新密码：</Col>
              <Col span={10}>
                <Input.Password placeholder="请确认新密码" password onChange={onInputChange.bind(this,'param','newPsw2')} value={this.state.param.newPsw2}/>
              </Col>
            </Row>
          </div>
        </Modal>
      </div>


    );
  }
}

KtComHeader.propTypes = {
  onToggle: P.func, // 菜单收起与展开状态切换
  collapsed: P.bool, // 菜单的状态
  onLogout: P.func, // 退出登录
  user: P.object, // 用户信息
  location: P.object, // 用户信息
  popLoading: P.bool // 消息弹窗是否正在加载数据
};
