/**
 * Created with PhpStorm.
 * User: LiuYang
 * Date: 2016/7/29
 * Time: 21:00
 * Description:
 */
require({
    "urlArgs": "v=__version__",
    "baseUrl" : "./",
    "waitSeconds": 0,
    "paths"   : {
        /**
         *公共库
         */
        "Zepto"           : "libs/zepto",
        "underscore"      : "libs/underscore",
        "backbone"        : "libs/pack",
        "react"           : "libs/react.min",
        "react.backbone"  : "libs/react.backbone",
        "JSXTransformer"  : "libs/JSXTransformer",
        "Swiper"          : "libs/swipe",
        "jsx"             : "libs/jsx",
        "text"            : "libs/text",
        "koala"           : "libs/koala",
        "datetime"        : "libs/datetimepicker",
        "geo"             : "libs/geo",
        "gifshot"         : "libs/gifshot.min",
        "caman"           : "libs/caman.min",
        "fastck"           : "libs/fastclick",
        "hummer"           : "libs/hummer",
        "exif-js"          : "libs/exif",
        "easeljs"          : "libs/easeljs",
        "kalendae"          : "libs/kalendae.standalone.min",

        /**
         *自定义router
         */
        "router": "router/appRouter",

        /**
         *自定义model
         */
        "Models": "models/AppModel",

        /**
         *自定义视图
         */
        "index"              : "views/index",
        "login"              : "views/login",
        "alreadyUsers"       : "views/alreadyUsers",
        "discover"           : "views/discover",
        "discoverTopic"      : "views/discover_topic",
        "discoverUsers"      : "views/discover_users",
        "eventDetail"        : "views/eventDetail",
        "graphicDetail"      : "views/graphicDetail",
        "graphicDetailEdit"  : "views/graphicDetail_edit",
        "graphicDetailAdd"   : "views/graphicDetail_add",
        "messages"           : "views/messages",
        "messagesns"         : "views/messagesns",
        "messagecard"        : "views/message_card",
        "messagecardinfo"    : "views/message_cardinfo",
        "messagesPrivate"    : "views/messages_private",
        "publish"            : "views/publish",
        "search"             : "views/search",
        "comment"            : "views/comment",
        "sunDetail"          : "views/sunDetail",
        "topic"              : "views/topic",
        "showlist"           : "views/showlist",
        "userCenter"         : "views/userCenter",
        "fuserCenter"        : "views/fuserCenter",
        "userCenterCar"      : "views/userCenter_car",
        "userCenterNick"     : "views/userCenter_nick",
        "userCenterPwd"      : "views/userCenter_pwd",
        "userCenterSetting"  : "views/userCenter_setting",
        "userCenterTimer"    : "views/userCenter_timer",
        "icard"              : "views/icard",
        "gif"                : "views/gif",
        "shakeHander"       :"views/shakeHander",            //摇一摇
        "commentlist"       :"views/commentlist",
        "myFunIndex"        : "views/myFunIndex",            //我的好玩指数
        /**
         *自定义共公 React组件
         */
        "headerViewComponent": "component/headerViewComponent",
        "navViewComponent"   : "component/navViewComponent",
        "mainViewComponent"  : "component/mainViewComponent",

        /**
         *自定义首页 React组件
         */
        "indexViewComponent"  : "component/indexViewComponent",
        /**
         *自定义发现 React组件
         */
        "discoverViewComponent"  : "component/discoverViewComponent",
        /**
         *自定义注册登录 React组件
         */
        "loginViewComponent"  : "component/loginViewComponent",
        /**
         *自定义发布活动 React组件
         */
        "publishViewComponent"  : "component/publishViewComponent",

        /**
         *自定义发布评论 React组件
         */
        "commentViewComponent"  : "component/commentViewComponent",
        /**
         *自定义活动详情页 React组件
         */
        "eventDetailViewComponent" : "component/eventDetailViewComponent",

        /**
         *自定义编辑照片发布页 React组件
         */
        "piceditViewComponent" : "component/piceditViewComponent",

        /**
         *自定义消息页 React组件
         */
        "messageViewComponent" : "component/messageViewComponent",
        /**
         *自定义消息页私信 React组件
         */
        "messagePrivateViewComponent" : "component/messagePrivateViewComponent",

        /**
         *自定义社交评论 React组件
         */
        "messagesnsViewComponent" : "component/messagesnsViewComponent",

        /**
         *自定义卡券 React组件
         */
        "messagecardViewComponent" : "component/messagecardViewComponent",

        /**
         *自定义卡券详情 React组件
         */
        "messagecardinfoViewComponent" : "component/messagecardinfoViewComponent",

        /**
         *自定义卡券详情 React组件
         */
        "topicViewComponent" : "component/topicViewComponent",

        /**
         *自定义晒详情 React组件
         */
        "showViewComponent" : "component/showViewComponent",

        /**
         *自定义晒列表 React组件
         */
        "showlistViewComponent" : "component/showlistViewComponent",

        /**
         *自定义发现用户 React组件
         */
        "dusersViewComponent" : "component/dusersViewComponent",

        /**
         *自定义用户中心 React组件
         */
        "ucenterViewComponent" : "component/ucenterViewComponent",

        /**
         *自定义用户设置中心 React组件
         */
        "ucenterSettingViewComponent" : "component/ucenterSettingViewComponent",

        /**
         *自定义搜索 React组件
         */
        "searchViewComponent" : "component/searchViewComponent",

        /**
         *自定义二维码 React组件
         */
        "icardViewComponent" : "component/icardViewComponent",

        /**
         *自定义发布gif React组件
         */
        "gifViewComponent" : "component/gifViewComponent",

        /**
         *自定义活动日历 React组件
         */
        "ucenterTimerViewComponent" : "component/ucenterTimerViewComponent",

        /**
         *自定义活动日历 React组件
         */
        "shakeHanderViewComponent" : "component/shakeHanderViewComponent",

        /**
         *自定义活动日历 React组件
         */
        "shakeHanderHisViewComponent" : "component/shakeHanderHisViewComponent",

        /**
         * 摇一摇页面
         */
        "shakeHanderHis" : "views/shakeHanderHis",

        /**
         *评论列表 React组件
         */
        "commentlistComponent" : "component/commentlistComponent",
        /**
         * 已报名的用户列表
         */
        "alreadyUserViewComponent": "component/alreadyViewComponent",
        /**
         * 已报名的用户列表
         */
        "myFunIndexViewComponent": "component/myFunIndexViewComponent",
        /**
         *自定义UI
         */
        "cButton"            : "UI/c_Button",
        "cOverlay"           : "UI/c_Overlay",
        "cAlert"             : "UI/c_Alert",
        "cLoading"           : "UI/c_Loading",

        //自定义相关逻辑处理抽像层
        "$q"                 : "common/Q",                    //异步转同步处理
        "PageNation"         : "common/pagenation",           //前端分布组件
        "LazyLoad"           : "common/lazyload",             //图片懒加载
        "Message"            : "common/cMessage",             //消息的订阅与发布
        "Fn"                  : "common/Fn",                   //函数库
        "$location"          : "services/location",            //获取URL中的参数

        //model层封装
        "RESTF"         : "models/RESTFModel",           //统一管理AJAX请求实例
        "STORE"         : "models/StoreModel",           //统一管理本地缓存数据


        //view层逻辑封装
        "baseView"           : "views/baseView",              //基础view
        "listBaseView"       : "views/listBaseView",          //带分页的view
        "$user"              : "services/userService",       //当前用户

        //配置文件
        "C"                  : "config/config",                //系统配置文件

        "WX"                 : typeof window === 'undefined' ? "empty" : "//res.wx.qq.com/open/js/jweixin-1.1.0",       //微信接口文件
        "$WX"                : "services/wxService",                             //前端调用请使用这个接口
        "Shake"              : "common/shake"                                    //摇一摇事件兼容处理
    },
    jsx: {
        fileExtension: '.jsx',
        harmony: true,
        stripTypes: true
    },
    "shim" : {
        "backbone" : {
            "deps" : [
                "Zepto",
                "underscore"
            ],
            "exports" : "Backbone"
        },
        "underscore" : {
            "deps": [
                "Zepto"
            ],
            "exports" : "_"
        },
        "Zepto": {
            "exports": "$"
        },
        "Swiper": {
            "exports": "Swiper"
        },
        "easeljs": {
            "exports": "createjs"
        }
    }
});
