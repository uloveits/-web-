/** 左侧导航 **/
import React from "react";
import P from "prop-types";
import { Layout, Menu } from "antd";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import "./index.scss";
import ImgLogo from "../../../public/imgs/logo-white.png";
import ImgLogoText from "../../../public/imgs/logo-text-white.png";
import KtSeparator from "../../common/separator";


const { Sider } = Layout;
const { SubMenu, Item } = Menu;

@connect(
  state => ({
    isMobile: state.common.isMobile
  }),
)
export default class KtComMenu extends React.PureComponent {

  static propTypes = {
    data: P.array, // 所有的菜单数据
    collapsed: P.bool, // 菜单咱开还是收起
    location: P.any,
    onCallback: P.func
  };

  constructor(props) {
    super(props);
    this.state = {
      sourceData: [], // 菜单数据（层级）
      treeDom: [], // 生成的菜单结构
      chosedKey: [], // 当前选中
      openKeys: [] // 当前需要被展开的项
    };
  }

  componentDidMount() {
    // this.makeSourceData(this.props.data);
    this.nowChosed(this.props.location);
  }

  UNSAFE_componentWillReceiveProps(nextP) {
    // if (this.props.data !== nextP.data) {
    //   this.makeSourceData(nextP.data);
    // }
    if (this.props.location !== nextP.location) {
      this.nowChosed(nextP.location);
    }
  }

  /** 处理当前选中 **/
  nowChosed(location) {
    console.log(location)
    const paths = location.pathname.split("/").filter(item => !!item);
    this.setState({
      chosedKey: [location.pathname],
      openKeys: paths.map(item => `/${item}`)
    });
  }

  /** 菜单展开和关闭时触发 **/
  onOpenChange(keys) {
    console.log('菜单展开和关闭时触发')
    console.log(keys)
    this.setState({
      openKeys: keys
    });
  }

  onCallback = () => {
    console.log(123)
    if(this.props.isMobile !== 'false') {
      console.log(456)
      this.props.onCallback()
    }
  }

  render() {
    const { data,isMobile } = this.props;

    const renderMenuItem = item => ( // item.route 菜单单独跳转的路由
      <Menu.Item
        key={item.key}
      >
        <Link to={item.route || item.key} onClick={this.onCallback}>
          <div className='align-center'>
            {item.icon && <div className={`iconfont icon-${item.icon}`}/>}
            <div className="nav-text pl10">{item.title}</div>
          </div>
        </Link>
      </Menu.Item>
    );

    const renderSubMenu = item => (
      <Menu.SubMenu
        key={item.key}
        title={
          <div className='align-center'>
            {item.icon && <div className={`iconfont icon-${item.icon}`}/>}
            <div className="nav-text pl10">{item.title}</div>
          </div>
        }
      >
        {item.children.map(item => renderMenuItem(item))}
      </Menu.SubMenu>
    );
    
    return (
      <Sider
        width={256}
        className={`sider ${isMobile !== 'false' ? 'card':''}`}
        trigger={null}
        collapsible
        collapsed={this.props.collapsed}
      >
        {
          isMobile === 'false' &&
          <div className={this.props.collapsed ? "menuLogo hide" : "menuLogo"}>
            <Link to="/">
              <img src={ImgLogo} />
              <div>
                <img style={{width:'120px'}} mode="widthFix" src={ImgLogoText} />
              </div>
            </Link>
          </div>
        }
        {
         isMobile === 'false' &&
         <KtSeparator comp={{height:'64px',bgColor:'#3c4b62'}} />
        }


        <Menu
          theme="light"
          mode="inline"
          selectedKeys={this.state.chosedKey}
          {...(this.props.collapsed ? {} : { openKeys: this.state.openKeys })}
          onOpenChange={e => this.onOpenChange(e)}
        >
          {data && data.map(item =>
            item.children.length > 0 ? renderSubMenu(item) : renderMenuItem(item)
          )}
        </Menu>
      </Sider>
    );
  }
}
