import React from "react";

import { connect } from "react-redux";
import { Button, Steps, Tag, Row, Col } from "antd";
import "./index.scss";
import KtTitleBar from "../../../comps/common/title";
import CommonFnc from "../../../utils/commonFnc";

import { ORDER } from "../../../constants";
import orderApi from "../../../services/api/order";
import KtSeparator from "../../../comps/common/separator";







const { Step } = Steps;

@connect(
  state => ({
    user: state.app.user,
  })
)

export default class OrderDetailPage extends React.Component {
  static propTypes = {

  };

  constructor(props) {
    super(props);
    this.state = {
      info:{}
    };
  }

  componentWillMount() {
    console.info()

  }

  componentDidMount() {
    if(this.props.location.state&&this.props.location.state.id) {
      this.getInfo()
    }else {
      this.props.history.push('/order/list')
    }

  }

  getInfo = async () => {
    let res = await orderApi.detail({id:this.props.location.state.id});
    console.log('订单详情');
    console.log(res.data);
    if(res.code === '200') {
        this.setState({
          info:res.data,
        })
      }
    };

  //取消
  onCancel = () => {
    this.props.history.push('/order/list');
  }

  render() {
    const { info } = this.state;

    return (
      <div className='page-content pd20'>
        <div className='flex-left pb20'>
          <Button onClick={this.onCancel.bind(this)}>返回</Button>
        </div>
        <div className='pd20'>
          <Row type="flex" justify="center" align="middle">
            <Col span={18}>
              <Steps current={1}>
                <Step title="提交订单" description="" />
                <Step title="支付订单" description="" />
                <Step title="平台发货" description="" />
                <Step title="确认收货" description="" />
                <Step title="完成评价" description="" />
              </Steps>
            </Col>
          </Row>

        </div>
        <div className='border pd20 shadow-warp bgWhite'>
          <KtTitleBar comp={{title:'基本信息'}} />
          <div className='ptb20'>
            <Row type="flex" justify="left" align="middle" className='border-ec'>
              <Col span={5}>
                <div className='border-ec lh30 text-center'><span className='font-weight'>订单编号</span></div>
                <div className='border-ec lh30 text-center'><span>{info.no || '暂无'}</span></div>
              </Col>
              <Col span={4}>
                <div className='border-ec lh30 text-center'><span className='font-weight'>买家</span></div>
                <div className='border-ec lh30 text-center'><span>{info.user&&info.user.nickName || '暂无'}</span></div>
              </Col>
              <Col span={5}>
                <div className='border-ec lh30 text-center'><span className='font-weight'>订单金额</span></div>
                <div className='border-ec lh30 text-center'><span>{CommonFnc.centToYuan(info.orderPrice)}</span></div>
              </Col>
              <Col span={5}>
                <div className='border-ec lh30 text-center'><span className='font-weight'>支付方式</span></div>
                <div className='border-ec lh30 text-center'><Tag color='green'>{CommonFnc.getConstantValue(ORDER.PAY_TYPE,info.payType)}</Tag></div>
              </Col>
              <Col span={5}>
                <div className='border-ec lh30 text-center'><span className='font-weight'>交易状态</span></div>
                <div className='border-ec lh30 text-center'><Tag color='purple'>{CommonFnc.getConstantValue(ORDER.STATUS_VALUE,info.status)}</Tag></div>
              </Col>
            </Row>
          </div>
          <KtSeparator/>

          <KtTitleBar comp={{title:'商品信息'}} />
          <div className='ptb20'>
            <Row type="flex" justify="left" align="middle" className='border-ec'>
              <Col span={8}>
                <div className='border-ec lh30 text-center'><span className='font-weight'>商品名称</span></div>
              </Col>
              <Col span={4}>
                <div className='border-ec lh30 text-center'><span className='font-weight'>商品规格</span></div>
              </Col>
              <Col span={4}>
                <div className='border-ec lh30 text-center'><span className='font-weight'>商品单价</span></div>
              </Col>
              <Col span={4}>
                <div className='border-ec lh30 text-center'><span className='font-weight'>购买数量</span></div>
              </Col>
              <Col span={4}>
                <div className='border-ec lh30 text-center'><span className='font-weight'>商品总价</span></div>
              </Col>
            </Row>
            {
              info.orderGoods&&info.orderGoods.map((item,idx)=>(
                <Row type="flex" justify="left" align="middle" key={idx}>
                  <Col span={8}>
                    <div className='border-ec lh30 text-center'><span>{item.goods.name || '暂无'}</span></div>
                  </Col>
                  <Col span={4}>
                    <div className='border-ec lh30 text-center'><span>{item.skuValueNames || '暂无'}</span></div>
                  </Col>
                  <Col span={4}>
                    <div className='border-ec lh30 text-center'><span>{CommonFnc.centToYuan(item.price)}</span></div>
                  </Col>
                  <Col span={4}>
                    <div className='border-ec lh30 text-center'><span color='green'>{item.count}</span></div>
                  </Col>
                  <Col span={4}>
                    <div className='border-ec lh30 text-center'><span color='purple'>{CommonFnc.centToYuan(item.count*item.price)}</span></div>
                  </Col>
                </Row>
              ))
            }
            <Row type="flex" justify="left" align="middle" className='border-ec'>
              <Col span={20}>
                <div className='border-ec lh30'>
                  <span className='font-weight pl10'>买家留言：</span>
                  <span className=''>{info.remark || '暂无'}</span>
                </div>
              </Col>
              <Col span={4}>
                <div className='border-ec lh30 text-center'>
                  <span className='font-weight'>小计：</span>
                  <span className='font-weight'>{CommonFnc.centToYuan(info.orderPrice)}</span>
                </div>
              </Col>
            </Row>
          </div>
          <KtSeparator/>

          <KtTitleBar comp={{title:'收货信息'}} />
          <div className='ptb20'>
            <Row type="flex" justify="left" align="middle" className='border-ec'>
              <Col span={5}>
                <div className='border-ec lh30 text-center'><span className='font-weight'>收货人</span></div>
                <div className='border-ec lh30 text-center'><span>{info.address&&info.address.name || '暂无'}</span></div>
              </Col>
              <Col span={5}>
                <div className='border-ec lh30 text-center'><span className='font-weight'>收货电话</span></div>
                <div className='border-ec lh30 text-center'><span>{info.address&&info.address.phone || '暂无'}</span></div>
              </Col>
              <Col span={14}>
                <div className='border-ec lh30 text-center'><span className='font-weight'>收货地址</span></div>
                <div className='border-ec lh30 text-center'><span>{info.address&&info.address.display || '暂无'}</span></div>
              </Col>
            </Row>
          </div>


        </div>
      </div>

    );
  }
}
