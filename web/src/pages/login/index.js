/** 登录页 **/


import React from "react";
import P from "prop-types";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import "./index.scss";

import Vcode from "react-vcode";//验证码
import { Form, Input, Button, Icon, Row,Col } from "antd";
//import CanvasBack from "../../comps/layout/canvasBg";
import LogoImg from "../../public/imgs/logo.png";
import LogoText from "../../public/imgs/logo-text.png";
import loginBg from "../../public/imgs/login-bg.jpg";
import loginIcon from "../../public/imgs/logon-icon.png";

import { setUserInfo,setToken,setMenus } from "../../store/action/auth";
import authApi from "../../services/api/auth";
import { LOCAL_STORAGE } from "../../constants";
import CommonFnc from "../../utils/commonFnc";


const FormItem = Form.Item;
@connect(
  state => ({
    isMobile: state.common.isMobile,
  }),
  dispatch => ({
    actions: bindActionCreators(
      { setUserInfo,setToken,setMenus },
      dispatch
    )
  })
)



@Form.create()
class LoginPage extends React.Component {

  static propTypes = {
    location: P.any,
    history: P.any,
    form: P.any,
    actions: P.any
  };

  constructor(props) {
    super(props);
    this.state = {
      loading: false, // 是否正在登录中
      rememberPassword: false, // 是否记住密码
      codeValue: "00000", // 当前验证码的值
    };
  }

  componentDidMount() {

  }

  // 用户提交登录
  onSubmit() {
    console.log('=====')
    console.log(this.props)
    const { form: { validateFields } } = this.props;
    validateFields(async(error, values) => {
      console.log(error)
      console.log(values)
      if (error) {
        return;
      }
      this.setState({ loading: true });

      let param = {
        userName:values.username,
        password:values.password,
      }

      let  res = await authApi.login(param)
      console.log('==登陆结果返回==')
      console.log(res)
      if(res.code === '200') {
        //缓存里存储token信息
        localStorage.setItem(LOCAL_STORAGE.TOKEN, res.data.accessToken);
        //缓存里存储user信息
        localStorage.setItem(LOCAL_STORAGE.USER, JSON.stringify(res.data.user));
        //redux里储存token信息
        this.props.actions.setToken(res.data.accessToken);
        //redux里储存user信息
        this.props.actions.setUserInfo(res.data.user);
        //获得权限下面的菜单
        setTimeout(()=>{
          this.getMenus();
        },1000)

      }
      this.setState({ loading: false });
    });
  }

  getMenus = async() => {
    let res = await authApi.menus();
    console.log('===getMenus===');
    console.log(res)
    if(res.code === '200') {
      //缓存里存储user信息
      localStorage.setItem(LOCAL_STORAGE.MENUS, JSON.stringify(res.data));
      this.props.actions.setMenus(res.data);
      setTimeout(()=>{
        this.props.history.push('/');
      })
    }
  }



  // 记住密码按钮点击
  onRemember(e) {
    this.setState({
      rememberPassword: e.target.checked
    });
  }

  // 验证码改变时触发
  onVcodeChange(code) {
    this.props.form.setFieldsValue({
      vcode: code // 开发模式自动赋值验证码，正式环境，这里应该赋值''
    });
    this.setState({
      codeValue: code
    });
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <div className="page-login">
        {/*<div className="canvasBox">*/}
          {/*<CanvasBack row={12} col={8} />*/}
        {/*</div>*/}
        <div className='canvasBox'>
          <img className='wd100 ht100' src={loginBg} />
        </div>
        <div className={`loginBox all_trans5 show ${this.props.isMobile === 'false' && 'bgWhite shadow-lg' }`}>
          <Row type='flex' justify='center' align='middle'>
            {
              this.props.isMobile === 'false' &&
              <Col span={12}>
                <img className='wd100' mode="widthFix" src={loginIcon} />
              </Col>
            }

            <Col span={12}>
              <div className='pd10'>
                <Form>
                  <div className="title">
                    <img src={LogoImg} alt="logo" />
                    <img src={LogoText} alt="logoText" />
                  </div>
                  <div>
                    <FormItem>
                      {getFieldDecorator("username", {
                        rules: [
                          { max: 12, message: "最大长度为12位字符" },
                          {
                            required: true,
                            whitespace: true,
                            message: "请输入用户名"
                          }
                        ]
                      })(
                        <Input
                          prefix={<Icon type="user" style={{ fontSize: 13 }} />}
                          size="large"
                          id="username" // 为了获取焦点
                          placeholder="请输入用户名"
                          onPressEnter={this.onSubmit.bind(this)}
                        />
                      )}
                    </FormItem>
                    <FormItem>
                      {getFieldDecorator("password", {
                        rules: [
                          { required: true, message: "请输入密码" },
                          { max: 18, message: "最大长度18个字符" }
                        ]
                      })(
                        <Input
                          prefix={<Icon type="lock" style={{ fontSize: 13 }} />}
                          size="large"
                          type="password"
                          placeholder="请输入密码"
                          onPressEnter={this.onSubmit.bind(this)}
                        />
                      )}
                    </FormItem>
                    <FormItem>
                      {getFieldDecorator("vcode", {
                        rules: [
                          {
                            validator: (rule, value, callback) => {
                              const v = CommonFnc.trim(value);
                              if (v) {
                                if (v.length > 4) {
                                  callback("验证码为4位字符");
                                } else if (
                                  v.toLowerCase() !==
                                  this.state.codeValue.toLowerCase()
                                ) {
                                  callback("验证码错误");
                                } else {
                                  callback();
                                }
                              } else {
                                callback("请输入验证码");
                              }
                            }
                          }
                        ]
                      })(
                        <Row>
                          <Col span={16}>
                            <Input
                              style={{ width: "100%" }}
                              size="large"
                              value={this.state.codeValue}
                              id="vcode" // 为了获取焦点
                              placeholder="请输入验证码"
                              onPressEnter={this.onSubmit.bind(this)}
                            />
                          </Col>
                          <Col span={8}>
                            <Vcode
                              height={40}
                              width={80}
                              onChange={code => this.onVcodeChange(code)}
                              className="vcode"
                              options={{
                                lines: 16
                              }}
                            />
                          </Col>
                        </Row>
                      )}

                    </FormItem>
                    <div style={{ lineHeight: "40px" }}>
                      <Button
                        className="wd100"
                        size="large"
                        type="primary"
                        loading={this.state.loading}
                        onClick={this.onSubmit.bind(this)}
                      >
                        {this.state.loading ? "请稍后" : "登录"}
                      </Button>
                    </div>
                  </div>
                </Form>
              </div>
            </Col>
          </Row>
        </div>
      </div>
    );
  }
}
export default LoginPage