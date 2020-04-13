import React from "react";
import P from "prop-types";
import "./index.scss";

export default class KtSeparator extends React.Component {
  static propTypes = {
    comp: P.any,
  };

  render() {

    const { comp } = this.props;

    const defaultProps = {
      height: '10px',
      backgroundColor: '#fff'
    };

    function use(target, prop, val) {
      if (target && target[prop]) {
        return target[prop]
      }
      return val
    }

    const height = use(comp, 'height', defaultProps.height);
    const color = use(comp, 'bgColor', defaultProps.backgroundColor);
    // style={{marginRight: spacing + 'em'}}
    return (
      <div>
        {
          comp&&comp.width
            ?  <div style={{width:comp.width}} />
            :  <div style={{height: height,background: color}} />
        }
      </div>
    );
  }
}
