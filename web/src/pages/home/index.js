/* 主页 */

import React from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { Row, Col,Table,Button  } from 'antd'
import P from "prop-types";
import "./index.scss";

import { setUserInfo } from "../../store/action/auth";
import KtTitleBar from "../../comps/common/title";


@connect(
  state => ({
    isMobile: state.common.isMobile,
  }),
  dispatch => ({
    actions: bindActionCreators({ setUserInfo }, dispatch)
  })
)
export default class HomePageContainer extends React.Component {
  static propTypes = {
    location: P.any,
    history: P.any,
    actions: P.any
  };

  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {

  }

  goView = (type) => {
    switch (type) {
      case 'goodsAdd':
        this.props.history.push('/goods/add');
        break
      case 'article':
        this.props.history.push('/app/article');
        break
    }
  }

  render() {
    const { list } = this.state;

    return (
      <div className='page-content'>

        <Row>
          <Col xs={24} md={8}>
            <div className='pd10'>
              <div className='bgTrans card pd10'>
                <KtTitleBar comp={{title:'快速入口'}} />
                <div className='flex-left ptb20'>
                  <div className='bg-gradual-green quickBox mr10'  onClick={this.goView.bind(this,'goodsAdd')}>
                    <span>添加产品</span>
                  </div>
                  <div className='bg-gradual-red quickBox mr10' onClick={this.goView.bind(this,'suggest')}>
                    <span>留言建议</span>
                  </div>
                  <div className='bg-gradual-pink quickBox mr10' onClick={this.goView.bind(this,'article')}>
                    <span>文章列表</span>
                  </div>
                </div>
              </div>

            </div>
          </Col>
        </Row>
      </div>
    );
  }
}
