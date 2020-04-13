import React from "react";
import P from "prop-types";
import "./index.scss";
import Img from "../../../public/imgs/nothing.png";

export default class KtNothing extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div className="nothing">
        <img src={Img} alt="暂无数据" />
        {this.props.message || <div>暂无数据</div>}
      </div>
    );
  }
}

KtNothing.propTypes = {
  message: P.any
};
