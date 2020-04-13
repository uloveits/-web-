//首页的路由
import _home from '../pages/home';//首页

//系统管理
import _system_menu from '../pages/system/menu';//菜单管理
import _system_power from '../pages/system/power';//权限管理
import _system_role from '../pages/system/role';//角色管理
import _system_user from '../pages/system/user';//用户管理
//小程序
import _app_banner from '../pages/app/banner';//banner
import _app_article from '../pages/app/article';//文章列表
import _app_article_edit from '../pages/app/article/edit';//文章列表编辑
import _app_navigate from '../pages/app/navigate';//首页导航
import _app_contact from '../pages/app/contact';//联系我们
//商品管理
import _goods_classify from '../pages/goods/classify';//商品分类
import _goods_add from '../pages/goods/edit';//添加商品
import _goods_sku from '../pages/goods/sku';//sku管理
import _goods_list from '../pages/goods/list';//商品列表
//订单管理
import _order_list from '../pages/order/list';//商品列表
//会员管理
import _vip_list from '../pages/app/user';//会员列表
//控制面板
import _control_loginLog from '../pages/control/loginLog';//登陆日志
import _control_actionLog from '../pages/control/actionLog';//操作日志

export default {
  _home,_system_menu,_system_power,_system_role,_system_user,_app_banner,_app_article,
  _app_article_edit,_app_navigate,_app_contact,_goods_classify,_goods_add,_goods_sku,
  _goods_list,_vip_list,_order_list,_control_loginLog,_control_actionLog
}