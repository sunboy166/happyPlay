/**
 * Created by Screat on 2016/4/11.
 */
define([],function(){
    var env = 'product',
        modelPrefix,                   //默认请求接口前缀
        userPicDefault,                //用户默认图片
        loadingDefault,                //加载中的图片地址
        picPlaceHolder,                //暂无图片的占位
        commonModelPrefix,             //通用model的请求地址
        WeiXinAppId,                   //配置微信的APPid
        WeiXinDebug,                   //微信调试模式
        WeiXinjsApiList = ["chooseImage", "previewImage",
            "uploadImage", "getLocation",
            "scanQRCode", "openCard",
            "chooseWXPay", "addCard",
            "startSearchBeacons",
            "stopSearchBeacons",
            "onSearchBeacons",
            'onMenuShareTimeline',
            'onMenuShareAppMessage',
            'onMenuShareQQ',
            'onMenuShareWeibo',
            'onMenuShareQZone'
        ],                            //微信所需要的js接口列表
        WX_LOGIN_URL;                 //微信登录请求地址

    var env = "product",
        hostname = window.location.hostname;
    if(hostname.indexOf('ahappyapp.com') == -1) {
        env = 'test';
    }

    switch (env) {
        case 'product':             //生产环境
            commonModelPrefix = modelPrefix = 'http://ahappyapp.com/api/';
            WeiXinAppId = "wxdd35f2250d753840";
            userPicDefault = "img/user.png";
            picPlaceHolder = "img/no-pic.png";
            WeiXinDebug = false;
            WX_LOGIN_URL = 'http://ahappyapp.com/wxredirect?target=';
            break;
        case 'test':                //测试环境
            commonModelPrefix = modelPrefix = 'http://ahappyapp.com/api/';
            //WeiXinAppId = "wxc408d223b237aa43";              //测试号
            WeiXinAppId = "wxdd35f2250d753840";
            userPicDefault = "dest/img/user.png";
            loadingDefault = 'dest/img/';
            picPlaceHolder = "dest/img/no-pic.png";
            WeiXinDebug = false;
            WX_LOGIN_URL = 'http://wxsrv.armingstudio.cn/wxredirect?target=';
            break;
        default:
            modelPrefix = 'http://ahappyapp.com/api/';
    }

    return {
        modelPrefix:       modelPrefix,               //用来配置AJAX请求前缀数据
        commonModelPrefix: commonModelPrefix,         //通用接口配置文件(验证码)
        imageUploadMaxSize:1000000,                   //设置上传文件最大的大小
        allowUpload:       'jpeg|jpg|png|gif',        //允许上传的文件类型
        userPicDefault:    userPicDefault,            //用户默认图片
        loadingDefault:    loadingDefault,            //图片正在加载中时展示
        picPlaceHolder:    picPlaceHolder,            //图片占位符
        WeiXinjsApiList:   WeiXinjsApiList,           //微信APPid
        WeiXinAppId:       WeiXinAppId,               //微信所需要调用的接口List
        WeiXinDebug:       WeiXinDebug,               //微信DEBUG模式是否开启
        WX_LOGIN_URL:      WX_LOGIN_URL               //微信集成登录URL
    };
});