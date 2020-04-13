/** 通用动态面包屑 **/
import React from "react";
import P from "prop-types";
import { Breadcrumb, Icon } from "antd";
import "./index.scss";

export default class KtComBread extends React.PureComponent {
  static propTypes = {
    location: P.any,
    menus: P.array
  };

  /** 根据当前location动态生成对应的面包屑 **/
  makeBread(location, menus) {
    if(location.pathname === '/app/article/edit'){
      return [
        <Breadcrumb.Item key={0}>小程序</Breadcrumb.Item>,
        <Breadcrumb.Item key={1}>文章列表</Breadcrumb.Item>,
        <Breadcrumb.Item key={2}>编辑</Breadcrumb.Item>,
      ]
    }
    if(location.pathname === '/order/detail'){
      return [
        <Breadcrumb.Item key={0}>订单管理</Breadcrumb.Item>,
        <Breadcrumb.Item key={1}>订单详情</Breadcrumb.Item>,
      ]
    }
    const paths = location.pathname.split("/").filter(item => !!item);

    const breads = [];
    paths.forEach((item, index) => {
      const temp = menus.find(v => v.key.substring(1) === item)

      if (temp) {
        breads.push(
          <Breadcrumb.Item key={index}>{temp.title}</Breadcrumb.Item>
        );
      }
      if(temp&&temp.children.length > 0) {
        const child = temp.children.find(child => child.key === location.pathname)
        if(child) {
          breads.push(
            <Breadcrumb.Item key={index}>{child.title}</Breadcrumb.Item>
          );
        }
      }
    });
    return breads;
  }

  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { location,menus } = this.props;
    console.log(location);
    console.log(menus);
    return (
      <div className="bread">
        <Breadcrumb>
          {this.makeBread(this.props.location, this.props.menus)}
        </Breadcrumb>
      </div>
    );
  }
}
