const LOCAL_STORAGE = {
  USER:'LOCAL_STORAGE_USER',
  TOKEN:'LOCAL_STORAGE_TOKEN',
  MENUS:'LOCAL_STORAGE_MENUS',
  IS_MOBILE:'LOCAL_STORAGE_IS_MOBILE',
}

const APP = {
  BANNER:{
    TYPE:[
      {id:1,value:'首页Banner'},
      {id:2,value:'广告Banner'},
    ]
  },
  ACTIVE:[
    {id:1,value:'上架'},
    {id:0,value:'下架'},
  ]

}

const USER = {
  SEX:[
    {id:1,value:'男'},
    {id:2,value:'女'},
  ],
  LEVEL:[
    {id:0,value:'非会员'},
    {id:1,value:'青铜会员'},
    {id:2,value:'白银会员'},
    {id:3,value:'黄金会员'},
    {id:4,value:'钻石会员'},
  ]
}

const GOODS = {
  NO_SKU:'1',
  HAS_SKU:'2',
  CLASSIFY:{
    TYPE:[
      {id:1,value:'首页关联'},
      {id:2,value:'分类展示'},
    ]
  }
}

const ORDER = {
  //订单状态
  STATUS:{
    WAIT_PAY:1,//待付款
    WAIT_SEND:2,//待发货
    WAIT_RECEIVE:3,//待收货
    WAIT_COMMENT:4,//待评论
    COMPLETE:5,//完成
    CANCEL:6,//订单取消
    REFUND_ING:7,//退款中
    REFUND_ED:8,//退款完成
    REFUND_ERR:9,//退款拒绝
  },
  STATUS_VALUE:[
    {id:1,value:'待付款'},
    {id:2,value:'待发货'},
    {id:3,value:'待收货'},
    {id:4,value:'待评论'},
    {id:5,value:'完成'},
    {id:6,value:'订单取消'},
    {id:7,value:'退款中'},
    {id:8,value:'退款完成'},
    {id:9,value:'退款拒绝'},
  ],
  PAY_TYPE:[
    {id:1,value:'余额支付'},
    {id:2,value:'微信支付'},
  ]


}




const ICON = [
"cart-full","arrow-down","arrow-right","agriculture","add","add-account","category","auto","column",
"certified-supplier","camera","column1","clock","attachent","arrow-up","arrow-lift","cecurity-protection","calculator",
"calendar","browse","apparel","bags","ashbin","all","bussiness-man","cart-Empty","beauty",
"color","close","Cameraswitching","bad","ascending","confirm","assessed-badge","atm-away","atm",
"cry","conditions","component","years","CurrencyConverter","connections","company","comments","collection",
"default-template","code","copy","Customermanagement","credit-level","download","discount","double-arro-right","coupons",
"cut","customization","costoms-alearance","feeds","filter","dollar","double-arrow-left","furniture","etrical-equipm",
"add-cart","ali-clould","electronics","form","ellipsis","earth","hardware","exl","falling",
"good","Householdappliances","history","account","editor","help","hot","email","descending",
"data","gift","inspection","favorites","leftbutton","gold-supplie","image-text","kitchen","ipad",
"lights","eletrical","jewelry","libra","logistics-icon","integral","messagecenter","folder","move",
"mobile-phone","leftarrow","Moneymanagement","home","listing-content","inquiry-template","map","nav-list","manage-order",
"link","office","notice","ontimeshipment","supplies","multi-language","operation","namecard","pic",
"Notvisible","order","phone","packing-labeling","print","prompt","loading","reduce","pin",
"remind","Newuserzone","play","packaging","machinery","raw","return","process","Rightarrow",
"rising","password","Non-staplefood","resonserate","QRcode","Searchcart","rejected-order","responsetime","product",
"rmb","reeor","online-tracking","Salescenter","security","semi-select","scanning","paylater","signboard",
"RFQ-logo","service","smile","share","similar-product","shuffling-banner","pdf","suspended","RFQ-word",
"stop","template","seleted","sorting","task-management","supplier-features","textile-products","sound-Mute","Top",
"success","logistic-logo","survey","shoes","Exportservices","tradealert","Training","video","set",
"Rightbutton","warning","topsales","sound-filling","Tradingvolume","viewgallery","search","save","vehivles",
"Similarproducts","tool-hardware","viewlarger","suggest","upload","zip","trust","trade-assurance","warehouse",
"tool","viewlist","store","switch","text","sendinquiry","sport","vs","toy",
"checkstand","creditcard","Contacts","aviation","discounts","Daytimemode","invoice","rankinglist","nightmode",
"mute","unlock","VIP","infantmom","voice","insurance","Landtransportation","wallet","usercenter",
"exchangerate","feed-logo",
]


export {
  LOCAL_STORAGE,
  APP,
  USER,
  GOODS,
  ORDER,
  ICON
}