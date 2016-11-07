/**
 * Created by sqsun on 2015/9/22.
 */
define(["koala"],function(koala){
    var models = {};
    //首页Model层
    models.indexItems  = new koala.Model({
        defaultData: {
            show_offset: 0,
            event_offset: 0,
            data:[]
        }
    });

    //搜索Model层
    models.searchItems  = new koala.Model({
        defaultData: {
            next: null,
            results:[]
        }
    });

    //用户信息
    models.userinfo  = new koala.Model({
        defaultData: {},
        storage: {
            keyname: "userDB",
            init: {
                "lifeTime": "5D",
                "maxSize": "2M",
                "engine": localStorage
            }
        }
    });

    //标识是否显示消息提醒
    models.showToast  = new koala.Model({
        defaultData: {},
        storage: {
            keyname: "Toast",
            init: {
                "lifeTime": "3D",
                "maxSize": "2M",
                "engine": localStorage
            }
        }
    });

    //标识是否显示消息提醒
    models.notificationCount_getTime  = new koala.Model({
        defaultData: {},
        storage: {
            keyname: "NotificationCount_getTime",
            init: {
                "lifeTime": "365D",
                "maxSize": "2M",
                "engine": localStorage
            }
        }
    });

    //其它用户信息
    models.fuserinfo  = new koala.Model({
        defaultData: {},
        storage: {
            keyname: "fuserDB",
            init: {
                "lifeTime": "5D",
                "maxSize": "2M",
                "engine": localStorage
            }
        }
    });

    //活动详情
    models.eventdetail = new koala.Model({
        defaultData: {
            "id": 0,
            "founder": 0,
            "tags": [],
            "title": "",
            "content": "",
            "cover_image": null,
            "image1": null,
            "image2": null,
            "image3": null,
            "image4": null,
            "image5": null,
            "image6": null,
            "image7": null,
            "image8": null,
            "image9": null,
            "event_begin_time": "2016-03-24T07:46:15Z",
            "event_end_time": "2016-03-24T07:46:15Z",
            "signup_begin_time": "2016-03-24T07:46:15Z",
            "signup_end_time": "2016-03-24T07:46:15Z",
            "ticket_amount": null,
            "participant_limit": null,
            "participant_number": 0,
            "address": 0,
            "Caddress": '',
            "Cusericon": '',
            "CinuserArr": [[],[]],
            "showCount":0,
            "TopshowArr": [],
            "showArr": {
                nextPage: null,
                showArrs: []
            },
            "commentData": {
                "count": 0,
                "next": null,
                "previous": null,
                "results": [
                ]
            },
            "isCollection":false,
            "praises": [],
            "collections": [],
            topBroadCost: null,
            'participant_count': 0
        }
    });

    //用户列表
    models.userList = new koala.Model({
        defaultData:{nexturl: null,
            results:[
        ]}
    });

    //用户私信
    models.message  = new koala.Model({
        defaultData: [
        {
            "id": 0,
            "sender": 0,
            "receiver": 0,
            "content": "数据获取中..",
            "send_date": "2016-04-04T09:45:09Z"
        }]
    });

    //用户晒
    models.showArr  = new koala.Model({
        defaultData: [
        ]
    });

    //用户晒详情
    models.showDetail  = new koala.Model({
        defaultData: {
            result: {"id":8,"author":66,"address":2,"event":21,"tags":[],"title":"","content":"","cover_image":null,"image1":null,"image2":null,"image3":null,"image4":null,"image5":null,"image6":null,"image7":null,"image8":null,"image9":null,"author":{}},
            Caddress: '中国上海',
            commentData: {"count": 0,
                "next": null,
                "previous": null,
                "results": [
                ]}
        }
    });

    //晒列表
    models.showListDetail = new koala.Model({
        defaultData: {}
    })

    //用户晒图片
    models.showimgbase  = new koala.Model({
        defaultData: ' ',
        storage: {
            keyname: "showimgbase",
            init: {
                "lifeTime": "1D",
                "maxSize": "5M",
                "engine": localStorage
            }
        }
    });

    //其它用户晒图片
    models.showimgotherbase  = new koala.Model({
        defaultData: []
    });

    //用户登录
    models.userlogin = new koala.Model({
        defaultData: 3.14
    });

    //用户登录
    models.specialtopic = new koala.Model({
        defaultData: {
            list: []
        }
    });

    //用户私信
    models.userMessages = new koala.Model({
        defaultData: {
            "count": 0,
            "next": null,
            "previous": null,
            "results": [
                {
                    "id": null,
                    "sender": null,
                    "receiver": null,
                    "content": "",
                    "send_date": "2016-04-10T13:53:54Z"
                }
            ]
        }
    });

    //用户交互信息列表
    models.esMessagesList = new koala.Model({
        defaultData: {
            "ShowCollection": [], //晒收藏
            "EventComment": [], //活动评论
            "ShowPraise": [], //晒点赞
            "EventCollection": [], //活动收藏
            "ShowComment": [], //晒评论
            "EventPraise": [] //活动点赞
        }
    });

    //卡券列表
    models.cardList = new koala.Model({
         defaultData: {
             list: []
         }
    });

    //活动日历列表
    models.eventDateList = new koala.Model({
        defaultData: [{title:'loading', address:{name: '....'}, participant_number: 0}]
    });

    //更多评论
    models.eventdetailMoreComment = new koala.Model({
        defaultData: {
            "count": 0,
            "next": null,
            "previous": null,
            "results": [
            ]
        }
    });

    //用户登录时记录来源地址
    models.LoginFromUrl  = new koala.Model({
        defaultData: {},
        storage: {
            keyname: "loginFr",
            init: {
                "lifeTime": "1D",
                "maxSize": "1M",
                "engine": localStorage
            }
        }
    });

    //当前活动已报名的用户
    models.alreadySignStore = new koala.Model({
        defaultData: [],
        storage: {
            keyname: "EVENT_ALREADY_SIGN_USER",
            init: {
                "maxSize": "1M",
                "engine": "sessionStorage"
            }
        }
    });

    //当前用户所有消息列表
    models.userMsglist = new koala.Model({
        defaultData: [],
        storage: {
            keyname: "USER_MESSAGE_LIST",
            init: {
                "lifeTime": "1D",
                "maxSize": "5M",
                "engine": localStorage
            }
        }
    });
    return models;
});
