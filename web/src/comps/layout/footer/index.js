/* Footer 页面底部 */
import React from "react";
import { Layout } from "antd";
import { connect } from "react-redux";
import "./index.scss";
import KtSeparator from "../../common/separator";




const { Footer } = Layout;
@connect(
  state => ({
    isMobile: state.common.isMobile
  })
)
export default class KtComFooter extends React.Component {

  render() {
    return (
      <div>
        <Footer className="footer">
          管理后台 © {new Date().getFullYear()}
        </Footer>
      </div>
    );
  }
}

KtComFooter.propTypes = {};
