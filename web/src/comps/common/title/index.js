
import React from "react";
import "./index.scss";

export default class KtTitleBar extends React.PureComponent {


  render() {
    const { comp } = this.props;
    return (
      <div className='align-center'>
        <div className='border-left' />
        <span className='pl10 font-weight'>{comp.title}</span>
      </div>
    );
  }
}
