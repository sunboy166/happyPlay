/**
 * Created with PhpStorm.
 * User: Screat
 * Date: 2015/12/17
 * Time: 23:22
 * Description: 统一请求维护管理
 */
define(['models/ajaxBaseModel'],function(Model){
    var model = {};

    /**
     * 活动及晒的列表混排
     * @type {cCoreModel}
     */
    model.eventListModel = new Model({
        __poopertys__: function(){
            //this.url = 'event/events/:id'
            //this.url = 'event/v3/events/';
            this.url = 'event/v3/mix_event_show/';
            //this.url = 'event/current_show/';
            this.method = 'GET';
            /*this.defaultParam = {
                id: 0
            };*/
        },
        initialze: function($super, options){
            $super(options);
        }
    });

    /**
     * 获取活动详情
     * @type {cCoreModel}
     */
    model.getEventModel = new Model({
        __poopertys__: function(){
            this.url = 'event/v3/events/:id/';
            //this.url = 'event/events/';
            this.method = 'GET';
            /*this.defaultParam = {
                id: 0
            };*/
        },
        initialze: function($super, options){
            $super(options);
        }
    });

    /**
     * 获取活动详情用户信息
     * @type {cCoreModel}
     */
    model.getEventUserModel = new Model({
        __poopertys__: function(){
            this.url = 'account/users/:id/';
            //this.url = 'event/events/';
            this.method = 'GET';
            /*this.defaultParam = {
                id: 0
            };*/
        },
        initialze: function($super, options){
            $super(options);
        }
    });

    /**
     * 获取活动详情地址信息
     * @type {cCoreModel}
     */
    model.getEventAddressModel = new Model({
        __poopertys__: function(){
            this.url = 'event/addresses/:id/';
            //this.url = 'event/events/';
            this.method = 'GET';
            /*this.defaultParam = {
                id: 0
            };*/
        },
        initialze: function($super, options){
            $super(options);
        }
    });
    /**
     * 获取活动详情已经报名用户
     * @type {cCoreModel}
     */
    model.getEventJusersModel = new Model({
        __poopertys__: function(){
            this.url = 'event/participants/';
            //this.url = 'event/events/';
            this.method = 'GET';
            /*this.defaultParam = {
                id: 0
            };*/
        },
        initialze: function($super, options){
            $super(options);
        }
    });
    /**
     * 评论
     * @type {cCoreModel}
     */
    model.comentModel = new Model({
        __poopertys__: function(){
            this.url = 'comment/';
            this.method = 'POST';
            this.defaultParam = {};
        },
        initialze: function($super, options){
            $super(options);
        }
    });
    /**
     * 关注
     * @type {cCoreModel}
     */
    model.followsModel = new Model({
        __poopertys__: function(){
            this.url = 'account/follows/';
            this.method = 'POST';
            this.defaultParam = {};
        },
        initialze: function($super, options){
            $super(options);
        }
    });

    /**
     * 取消关注
     * @type {cCoreModel}
     */
    model.deletefollowsModel = new Model({
        __poopertys__: function(){
            this.url = 'account/follows/:id/';
            this.method = 'DELETE';
            this.defaultParam = {};
        },
        initialze: function($super, options){}
    });
    /**
     * 活动详情
     * @type {cCoreModel}
     */
    model.eventDetailModel = new Model({
        __poopertys__: function(){
            this.url = 'event/participants/';
            this.method = 'POST';
            this.defaultParam = {};
        },
        initialze: function($super, options){
            $super(options);
        }
    });
    /**
     * 获取上传token
     * @type {cCoreModel}
     */
    model.getTokenModel = new Model({
        __poopertys__: function(){
            this.url = 'tool/qiniu/upload/token/';
            this.method = 'GET';
            this.defaultParam = {};
        },
        initialze: function($super, options){
            $super(options);
        }
    });
    /**
     * 发布晒
     * @type {cCoreModel}
     */
    model.showsubmitModel = new Model({
        __poopertys__: function(){
            this.url = 'event/shows/';
            this.method = 'POST';
            this.defaultParam = {};
        },
        initialze: function($super, options){
            $super(options);
        }
    });
    /**
     * 晒详列表页
     * @type {cCoreModel}
     */
    model.showListModel = new Model({
        __poopertys__: function(){
            this.url = 'event/shows/';
            this.method = 'GET';
            this.defaultParam = {};
        },
        initialze: function($super, options){
            $super(options);
        }
    });
    /**
     * 当前活动其它人晒
     * @type {cCoreModel}
     */
    model.getEventShowListModel = new Model({
        __poopertys__: function(){
            this.url = 'event/v3/event_show/';
            this.method = 'GET';
            this.defaultParam = {};
        },
        initialze: function($super, options){
            $super(options);
        }
    });
    /**
     * 晒详详情页
     * @type {cCoreModel}
     */
    model.showDetailModel = new Model({
        __poopertys__: function(){
            this.url = 'event/v3/shows/:id/';
            this.method = 'GET';
            this.defaultParam = {};
        },
        initialze: function($super, options){
            $super(options);
        }
    });
    /**
     * 登录
     * @type {cCoreModel}
     */
    model.loginModel = new Model({
        __poopertys__: function(){
            this.url = 'account/login/';
            this.method = 'POST';
            this.defaultParam = {};
        },
        initialze: function($super, options){
            $super(options);
        }
    });
    /**
     * 注册
     * @type {cCoreModel}
     */
    model.signModel = new Model({
        __poopertys__: function(){
            this.url = 'account/signup/';
            this.method = 'POST';
            this.defaultParam = {};
        },
        initialze: function($super, options){
            $super(options);
        }
    });
    /**
     * 发送验证码
     * @type {cCoreModel}
     */
    model.verifyModel = new Model({
        __poopertys__: function(){
            this.url = 'account/verify_code/send/';
            this.method = 'POST';
            this.defaultParam = {};
        },
        initialze: function($super, options){
            $super(options);
        }
    });
     /**
     * 发布私信
     * @type {cCoreModel}
     */
    model.messageModel = new Model({
        __poopertys__: function(){
            this.url = 'account/chats/';
            this.method = 'POST';
            this.defaultParam = {};
        },
        initialze: function($super, options){
            $super(options);
        }
    });
    /**
     * 获取私信
     * @type {cCoreModel}
     */
    model.getMessageModel = new Model({
        __poopertys__: function(){
            this.url = 'account/v2/chats/';
            this.method = 'GET';
            this.defaultParam = {};
        },
        initialze: function($super, options){
            $super(options);
        }
    });

    /**
     * 发布活动
     * @type {cCoreModel}
     */
    model.publishEventModel = new Model({
        __poopertys__: function(){
            this.url = 'event/events/';
            this.method = 'POST';
            this.defaultParam = {};
        },
        initialze: function($super, options){
            $super(options);
        }
    });

    /**
     * 发布活动地址
     * @type {cCoreModel}
     */
    model.publishAddressModel = new Model({
        __poopertys__: function(){
            this.url = 'event/addresses/';
            this.method = 'POST';
            this.defaultParam = {};
        },
        initialze: function($super, options){
            $super(options);
        }
    });

    /**
     * 用户设置
     * @type {cCoreModel}
     */
    model.userSettingModel = new Model({
        __poopertys__: function(){
            this.url = 'account/users/:id/';
            //this.url = 'event/events/';
            this.method = 'GET';
            this.defaultParam = {};
        },
        initialze: function($super, options){
            $super(options);
        }
    });


    /**
     * 用户晒
     * @type {cCoreModel}
     */
    model.userShowModel = new Model({
        __poopertys__: function(){
            this.url = 'event/v3/user_shows/';
            this.method = 'GET';
            this.defaultParam = {};
        },
        initialze: function($super, options){
            $super(options);
        }
    });


    /**
     * 用户活动
     * @type {cCoreModel}
     */
    model.userEventModel = new Model({
        __poopertys__: function(){
            this.url = 'event/v2/events/';
            this.method = 'GET';
            this.defaultParam = {};
        },
        initialze: function($super, options){
            $super(options);
        }
    });


    /**
     * 发现用户
     * @type {cCoreModel}
     */
    model.userDescoverModel = new Model({
        __poopertys__: function(){
            this.url = 'account/users/';
            this.method = 'GET';
            this.defaultParam = {};
        },
        initialze: function($super, options){
            $super(options);
        }
    });


    /**
     * 评论
     * @type {cCoreModel}
     */
    model.eventcommentModel = new Model({
        __poopertys__: function(){
            this.url = 'event/eventcomment2/';
            this.method = 'GET';
            this.defaultParam = {};
        },
        initialze: function($super, options){
            $super(options);
        }
    });

    /**
     * 晒获取评论
     * @type {cCoreModel}
     */
    model.showcommentModel = new Model({
        __poopertys__: function(){
            this.url = 'event/showcomment2/';
            this.method = 'GET';
            this.defaultParam = {};
        },
        initialze: function($super, options){
            $super(options);
        }
    });

    /**
     * 发布评论
     * @type {cCoreModel}
     */
    model.eventcommentAddModel = new Model({
        __poopertys__: function(){
            this.url = 'event/eventcomment/';
            this.method = 'POST';
            this.defaultParam = {};
        },
        initialze: function($super, options){
            $super(options);
        }
    });
    /**
     * 晒发评论
     * @type {cCoreModel}
     */
    model.showcommentAddModel = new Model({
        __poopertys__: function(){
            this.url = 'event/showcomment/';
            this.method = 'POST';
            this.defaultParam = {};
        },
        initialze: function($super, options){
            $super(options);
        }
    });

    /**
     * 微信登录完成之后，获取用户登录信息
     * @type {cCoreModel}
     */
    model.getCurrentUserInfoModel = new Model({
        __poopertys__: function(){
            this.url = 'account/current_user/';
            this.method = 'GET';
            this.defaultParam = {};
        },
        initialze: function($super, options){}
    });

    /**
     * 驾照验证
     * @type {cCoreModel}
     */
    model.CertificateModel = new Model({
        __poopertys__: function(){
            this.url = 'account/certificates/';
            this.method = 'POST';
            this.defaultParam = {};
        },
        initialze: function($super, options){}
    });

    /**
     * 驾照验证更新
     * @type {cCoreModel}
     */
    model.UpCertificateModel = new Model({
        __poopertys__: function(){
            this.url = 'account/certificates/:id/';
            this.method = 'PUT';
            this.defaultParam = {};
        },
        initialze: function($super, options){}
    });

    /**
     * 微信sdk签名内容
     * @type {cCoreModel}
     */
    model.WxSignatureModel = new Model({
        __poopertys__: function(){
            this.url = 'tool/wx_signature';
            this.method = 'POST';
            this.defaultParam = {};
        },
        initialze: function($super, options){}
    });

    /**
     * 微信卡券SDK调用注册
     * @type {cCoreModel}
     */
    model.WxCardModel = new Model({
        __poopertys__: function(){
            this.url = 'tool/wx_signature';
            this.method = 'POST';
            this.defaultParam = {};
        },
        initialze: function($super, options){}
    });

    /**
     * 推荐活动
     * @type {cCoreModel}
     */
    model.specialtopicModel = new Model({
        __poopertys__: function(){
            this.url = 'event/v2/specialtopicitem/?topic=1';
            this.method = 'GET';
            this.defaultParam = {};
        },
        initialze: function($super, options){}
    });

    /**
     * 发现周边
     * @type {cCoreModel}
     */
    model.nearbyModel = new Model({
        __poopertys__: function(){
            this.url = 'event/nearby_show/';
            this.method = 'GET';
            this.defaultParam = {};
        },
        initialze: function($super, options){}
    });

    /**
     * 用户信息提示
     * @type {cCoreModel}
     */
    model.esMessageModel = new Model({
        __poopertys__: function(){
            this.url = 'event/user_information_num/';
            this.method = 'GET';
            this.defaultParam = {};
        },
        initialze: function($super, options){}
    });

    /**
     * 用户交互信息列表
     * @type {cCoreModel}
     */
    model.esMessageListModel = new Model({
        __poopertys__: function(){
            this.url = 'event/user_information_object/';
            this.method = 'GET';
            this.defaultParam = {};
        },
        initialze: function($super, options){}
    });

    /**
     * 微信登录成功后，向后台发起用户验证请求
     * @type {cCoreModel}
     */
    model.validateUserModel = new Model({
        __poopertys__: function(){
            this.url = 'event/validateUserInfo/';
            this.method = 'GET';
            this.defaultParam = {};
        },
        initialze: function($super, options){}
    });

    /**
     * 微信支付
     * @type {cCoreModel}
     */
    model.wxPayModel = new Model({
        __poopertys__: function(){
            this.url = 'event/wechat_order/';
            this.method = 'POST';
            this.defaultParam = {};
        },
        initialze: function($super, options){}
    });

    /**
     * 用户添加收藏
     * @type {cCoreModel}
     */
    model.setEventCollection = new Model({
        __poopertys__: function(){
            this.url = 'event/eventcollection/';
            this.method = 'POST';
            this.defaultParam = {};
        },
        initialze: function($super, options){}
    });

    /**
     * 微信中关联用户信息
     * @type {cCoreModel}
     */
    model.wxConnectUserModel = new Model({
        __poopertys__: function(){
            this.url = 'account/mobile_login/';
            this.method = 'POST';
            this.defaultParam = {};
        },
        initialze: function($super, options){}
    });


    /**
     * 设置当前帐号密码
     * @type {cCoreModel}
     */
    model.setUserPasswordModel = new Model({
        __poopertys__: function(){
            this.url = 'account/set_password/';
            this.method = 'POST';
            this.defaultParam = {};
        },
        initialze: function($super, options){}
    });

    /**
     * 用户删除收藏
     * @type {cCoreModel}
     */
    model.delEventCollection = new Model({
        __poopertys__: function(){
            this.url = 'event/eventcollection/';
            this.method = 'DELETE';
            this.defaultParam = {};
        },
        initialze: function($super, options){}
    });

    /**
     * 通过设备的UUID来查找设备卡券
     * @type {cCoreModel}
     */
    model.searchIbeansModel = new Model({
        __poopertys__: function(){
            this.url = 'event/event_ibeacon/';
            this.method = 'POST';
            this.defaultParam = {};
        },
        initialze: function($super, options){}
    });

    /**
     * 微信时间限制卡
     * @type {cCoreModel}
     */
    model.timeWeChatModel = new Model({
        __poopertys__: function(){
            this.url = '/event/timed_wechat_card/';
            this.method = 'GET';
            this.defaultParam = {};
        },
        initialze: function($super, options){}
    });

    /**
     * 查询卡券内容
     * @type {cCoreModel}
     */
    model.showCardsListModel = new Model({
        __poopertys__: function(){
            this.url = 'event/EventShowCard/';
            this.method = 'GET';
            this.defaultParam = {};
        },
        initialze: function($super, options){}
    });

    /**
     * 搜索活动
     * @type {cCoreModel}
     */
    model.wxCardSignatureModel = new Model({
        __poopertys__: function(){
            this.url = 'tool/wx_card_signature/';
            this.method = 'POST';
            this.defaultParam = {};
        },
        initialze: function($super, options){}
    });

    /**
     * 查询卡券内容
     * @type {cCoreModel}
     */
    model.searchModel = new Model({
        __poopertys__: function(){
            this.url = 'event/v3/search/';
            this.method = 'GET';
            this.defaultParam = {};
        },
        initialze: function($super, options){}
    });

    /**
     * 搜索用户
     * @type {cCoreModel}
     */
    model.searchUserModel = new Model({
        __poopertys__: function(){
            this.url = 'account/v3/search/';
            this.method = 'GET';
            this.defaultParam = {};
        },
        initialze: function($super, options){}
    });

    /**
     * 活动赞
     * @type {cCoreModel}
     */
    model.setEventpraise =new Model({
        __poopertys__: function(){
            this.url = 'event/eventpraise/';
            this.method = 'POST';
            this.defaultParam = {};
        },
        initialze: function($super, options){}
    });

    /**
     * 删除活动赞
     * @type {cCoreModel}
     */
    model.deleteEventpraise =new Model({
        __poopertys__: function(){
            this.url = 'event/eventpraise/:id/';
            this.method = 'DELETE';
            this.defaultParam = {};
        },
        initialze: function($super, options){}
    });

    /**
     * 晒的动赞
     * @type {cCoreModel}
     */
    model.setShowpraise =new Model({
        __poopertys__: function(){
            this.url = 'event/showpraise/';
            this.method = 'POST';
            this.defaultParam = {};
        },
        initialze: function($super, options){}
    });

    /**
     * 删除晒的赞
     * @type {cCoreModel}
     */
    model.deleteShowpraise =new Model({
        __poopertys__: function(){
            this.url = 'event/showpraise/:id/';
            this.method = 'DELETE';
            this.defaultParam = {};
        },
        initialze: function($super, options){$super(options);}
    });

    /**
     * 晒的动赞
     * @type {cCoreModel}
     */
    model.eventDateModel =new Model({
        __poopertys__: function(){
            this.url = 'event/v3/calendar_event/';
            this.method = 'GET';
            this.defaultParam = {};
        },
        initialze: function($super, options){}
    });

    /**
     * 推荐的活动列表
     * @type {cCoreModel}
     */
    model.recommandEventsModel = new Model({
        __poopertys__: function(){
            this.url = '/event/v3/recommended_event/';
            this.method = 'GET';
            this.defaultParam = {};
        },
        initialze: function($super, options){}
    });


    /**
     * 某个用户订阅的活动查询
     * @type {cCoreModel}
     */
    model.userSubscibedEventModel = new Model({
        __poopertys__: function(){
            this.url = '/event/v3/subscibed_event/';
            this.method = 'GET';
            this.defaultParam = {};
        },
        initialze: function($super, options){}
    });

    /**
     * 某个用户发起的活动
     * @type {cCoreModel}
     */
    model.userStartEventModel = new Model({
        __poopertys__: function(){
            this.url = 'event/v3/user_started_event/';
            this.method = 'GET';
            this.defaultParam = {};
        },
        initialze: function($super, options){}
    });

    /**
     * 某个用户当前所有的卡券列表
     * @type {cCoreModel}
     */
    model.userShakeCardList = new Model({
        __poopertys__: function(){
            this.url = 'event/v3/event_card/';
            this.method = 'GET';
            this.defaultParam = {};
        },
        initialze: function($super, options){}
    });


    /**
     * 置顶的晒
     * @type {cCoreModel}
     */
    model.top_Dshows = new Model({
        __poopertys__: function(){
            this.url = 'event/v3/top_shows/';
            this.method = 'GET';
            this.defaultParam = {};
        },
        initialze: function($super, options){}
    });

    /**
     * 其它的晒
     * @type {cCoreModel}
     */
    model.other_Dshows = new Model({
        __poopertys__: function(){
            this.url = 'event/v3/shows/';
            this.method = 'GET';
            this.defaultParam = {};
        },
        initialze: function($super, options){}
    });

    /**
     * 用户的取卡记录
     * @type {cCoreModel}
     */
    model.userShakeCardListHistoryModel = new Model({
        __poopertys__: function(){
            this.url = 'event/v3/card_logger/';
            this.method = 'GET';
            this.defaultParam = {};
        },
        initialze: function($super, options){}
    });
    /**
     * 信息接口
     * @type {cCoreModel}
     */
    model.getNotify = new Model({
        __poopertys__: function(){
            this.url = 'event/v3/social_notification/';
            this.method = 'GET';
            this.defaultParam = {};
        },
        initialze: function($super, options){}
    });

    /**
     * 广播接口
     * @type {cCoreModel}
     */
    model.getBroadcast = new Model({
        __poopertys__: function(){
            this.url = 'event/v3/broadcast/';
            this.method = 'GET';
            this.defaultParam = {};
        },
        initialze: function($super, options){}
    });

    /**
     * 获取社交通知信息数量
     * @type {cCoreModel}
     */
    model.getNotification_count = new Model({
        __poopertys__: function(){
            this.url = 'event/v3/social_notification_count/';
            this.method = 'GET';
            this.defaultParam = {};
        },
        initialze: function($super, options){}
    });

    return model;
});