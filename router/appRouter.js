/**
 * Created by sqsun on 2015/9/22.
 */
define(["koala"],function(koala){
    var appRouter = koala.Router.extend({
        // 路由配置列表
        routes: {
            '': 'index'
            ,'index': 'index',                             //首页
            'login': 'login'                             //登录注册
            ,'alreadyusers': 'alreadyUsers'               //已报名用户列表页
            ,'discover': 'discover'                       //发现页
            ,'discover/topic': 'discoverTopic'            //发现话题详情页
            ,'discover/users': 'discoverUsers'            //发现用户列表页
            ,'event/detail': 'eventDetail'                //活动详情页
            ,'event/detail/:id': 'eventDetail'            //活动详情页
            ,'graphic/detail': 'graphicDetail'            //图文详情页
            ,'graphic/detail/edit': 'graphicDetailEdit'   //图文详情页编辑页面
            ,'graphic/detail/edit/:id': 'graphicDetailEdit'   //图文详情页编辑页面
            ,'graphic/detail/add': 'graphicDetailAdd'     //图文发面页面
            ,'messages': 'messages'                       //消息页
            ,'messages/sns/': 'messagesSNS'               //社交通知页
            ,'messages/sns/:id': 'messagesSNS'            //社交通知页
            ,'messages/card/': 'messagesCard'             //卡券通知页
            ,'messages/card/:id': 'messagesCard'          //卡券通知页
            ,'messages/cardinfo/': 'messagesCardinfo'     //卡券详情页
            ,'messages/cardinfo/:id': 'messagesCardinfo'  //卡券详情页
            ,'messages/private': 'messagesPrivate'        //消息 私信页
            ,'messages/private/:id': 'messagesPrivate'    //消息 私信页
            ,'publish': 'publish'                         //发布页
            ,'search': 'search'                           //搜索页
            ,'search/:keyword': 'search'                  //搜索页
            ,'comment': 'comment'                         //发布评论页
            ,'comment/:id/:from': 'comment'               //发布评论页
            ,'comment/:id/r/:id/:from': 'rcomment'        //回复评论页
            ,'sundetail': 'sunDetail'                     //晒详情页
            ,'sundetail/:id': 'sunDetail'                 //晒详情页
            ,'showlist': 'showList'                       //晒列表页
            ,'showlist/:id':'showList'
            ,'topic': 'topic'                             //话题详情页
            ,'topic/:id': 'topic'                         //话题详情页
            ,'usercenter': 'userCenter'                   //用户中心页
            ,'fuser/:id': 'fuserCenter'                   //用户中心页
            ,'usercenter/car': 'userCenterCar'            //用户中心 车主认证页
            ,'usercenter/nick': 'userCenterNick'          //用户中心 修改昵称页
            ,'usercenter/pwd': 'userCenterPwd'            //用户中心 修改密码页
            ,'usercenter/setting': 'userCenterSetting'    //用户中心 设置页
            ,'usercenter/timer': 'userCenterTimer'        //用户中心 选择日期页
            ,'icard': 'icard'                             //我的卡券
            ,'gif': 'gif'                                 //发布gif
            ,'gif/:id': 'gif'                             //发布gif
            ,'shake': 'shakeHander'                     //摇一摇页面
            ,'shake/:id': 'shakeHander'                  //摇一摇页面
            ,'shakehis/:id': 'shakeHanderHis'                  //摇一摇历史页面
            ,'commentlist/:id/:type':'commentlist'
            ,'myfunindex': 'myFunIndex'                       //我的好玩指数页面
        }
        ,loading: $("#ui-loading")
        //页面动画切换排序
        ,pageOrder:[
            'index',
            'login',
            'alreadyusers',
            'discover',
            'discover/topic',
            'discover/users',
            'event/detail',
            'commentlist',
            'graphic/detail',
            'graphic/detail/edit',
            'graphic/detail/add',
            'messages',
            'messages/sns',
            'messages/card',
            'messages/cardinfo',
            'messages/private',
            'publish',
            'search',
            'comment',
            'sundetail',
            'topic',
            'showlist',
            'usercenter',
            'fuserCenter',
            'usercenter/car',
            'usercenter/nick',
            'usercenter/pwd',
            'usercenter/setting',
            'usercenter/timer',
            'icard',
            'gif',
            'shakeHander',
            'myFunIndex'
        ]

        //所有视图Function
        ,index: function(params) {
            this.doAction('index', {
                isindex: true
            });
        }

        ,login: function(params) {
            /**
             * action通用处理逻辑
             * @{param} action {string} action名称
             * @{param} params {object} action参数
             */
            this.doAction('login', {});
        }

        ,alreadyUsers: function(params) {
            this.doAction('alreadyUsers', {});
        }

        ,discover: function(params) {
            this.doAction('discover', {});
        }

        ,discoverTopic: function(params) {
            this.doAction('discoverTopic', {});
        }

        ,discoverUsers: function(params) {
            this.doAction('discoverUsers', {});
        }

        ,eventDetail: function(id) {
            this.doAction('eventDetail', {id: id});
        }

        ,graphicDetail: function(params) {
            this.doAction('graphicDetail', {});
        }

        ,graphicDetailEdit: function(id) {
            this.doAction('graphicDetailEdit', {id: id});
        }

        ,graphicDetailAdd: function (){
            this.doAction('graphicDetailAdd', {});
        }

        ,messages: function(params) {
            this.doAction('messages', {});
        }

        ,messagesCard: function(id) {
            this.doAction('messagecard', {mid: id});
        }

        ,messagesCardinfo: function(id) {
            this.doAction('messagecardinfo', {mid: id});
        }

        ,messagesSNS: function(id) {
            this.doAction('messagesns', {mid: id});
        }

        ,messagesPrivate: function(uid) {
            this.doAction('messagesPrivate', {uid: uid});
        }

        ,publish: function(params) {
            this.doAction('publish', {});
        }

        ,search: function(keyword) {
            this.doAction('search', {keyword: keyword});
        }

        ,comment: function(id, from) {
            this.doAction('comment', {id: id, from: from});
        }

        ,rcomment: function(id, rid, from) {
            this.doAction('comment', {id:id, rid: rid, from: from});
        }

        ,sunDetail: function(id) {
            this.doAction('sunDetail', {id: id});
        }

        ,topic: function(id){
            this.doAction('topic', {tid: id})
        }

        ,showList: function(id) {
            this.doAction('showlist', {id: id});
        }

        ,userCenter: function(id) {
            this.doAction('userCenter', {});
        }

        ,fuserCenter: function(id) {
            this.doAction('fuserCenter', {id: id});
        }

        ,userCenterCar: function(params) {
            this.doAction('userCenterCar', {});
        }

        ,userCenterNick: function(params) {
            this.doAction('userCenterNick', {});
        }

        ,userCenterPwd: function(params) {
            this.doAction('userCenterPwd', {});
        }

        ,userCenterSetting: function(params) {
            this.doAction('userCenterSetting', {});
        }

        ,userCenterTimer: function(params) {
            this.doAction('userCenterTimer', {});
        }

        ,icard: function(id) {
            this.doAction('icard', {});
        }

        ,gif: function(id) {
            this.doAction('gif', {event: id});
        },
        shakeHander: function(id){
            this.doAction('shakeHander',{event: id});
        },
        shakeHanderHis: function(id){
            this.doAction('shakeHanderHis',{event: id});
        }
        ,commentlist: function (id,type) {
            this.doAction('commentlist', {id: id, type: type})
        },
        myFunIndex: function(){
            this.doAction('myFunIndex')
        }
    });
    return new appRouter();
})
