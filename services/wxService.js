/**
 * Created by Screat on 2016/4/20.
 */
define(['C', '$q', 'underscore', 'RESTF','koala',/MicroMessenger/i.test(navigator.userAgent) ? 'WX' : undefined],function(config, $q, _, RESTF ,Koala, wx){
    var WxSignatureModel = RESTF.WxSignatureModel.getInstance(),
        wxCardSignatureModel = RESTF.wxCardSignatureModel.getInstance();
    var Toast = new Koala.kUI.Toast();
    var $wx = {
        /**
         * 获取服务端的签名信息
         */
        $$isReady: false,
        getSignatureInfo: function(){
            var url = window.location.href.replace(/#.*/, ''),
                self = this;
            if(wx) {
                wx && wx.ready(function(){
                    self.isReady = true;
                });

                wx && wx.error(function(){
                    console.log(arguments);
                });
                //微信SDK签名
                WxSignatureModel.execute({
                    url: url
                }).then(function(data){
                    wx.config({
                        debug: config['WeiXinDebug'],
                        appId: config['WeiXinAppId'],
                        url: data.url,
                        timestamp: data.timestamp,
                        nonceStr: data.noncestr,
                        signature: data.signature,
                        jsApiList: config['WeiXinjsApiList']
                    })
                });
                /*//微信卡券SDK
                WxCardModel.execute({
                    url: url
                }).then(function(d){
                    self.$$weixinTicketSdk = d;
                });*/
            }
        },
        //开始查找iBeacons设备
        startSearchBeacons: function(callback,errorFn){
            wx && wx.startSearchBeacons({
                ticket:"123456",
                complete:function(argv){
                    var message = argv.errMsg;
                    switch (message){
                        case "startSearchBeacons:bluetooth power off":
                            //请打开蓝牙设备
                            Toast.show({
                                Content: '请打开蓝牙设备'
                            });
                            errorFn && errorFn();
                            break;
                        case "startSearchBeacons:system unsupported":
                            //微信版本不支持iBeans设备
                            Toast.show({
                                Content: "你的微信版本过低，暂不支持此功能"
                            });
                            errorFn && errorFn();
                            break;
                        case "startSearchBeacons:location service disable":
                            //请打开地理位置服务
                            Toast.show({
                                Content: '请打开地理位置服务'
                            });
                            errorFn && errorFn();
                            break;
                        case "startSearchBeacons:ok":
                            //iBeancons设备开启查找成功
                        case "startSearchBeacons:already started":
                            //iBeancons设备已经在查找中
                            callback && callback(argv);
                    }
                }
            });

        },
        //关闭查找iBeancons设备，如果为true,表示正在搜索，如果为false，则表示停止搜索
        $$searchStatus: false,
        stopSearchBeacons: function(callback){
            this.$$searchStatus = false;
            wx && wx.stopSearchBeacons({
                complete:function(res){
                    callback && callback(res);
                }
            });
        },
        //监听iBeancons设备
        onSearchBeacons: function(callback, timeoutFn){
            var self = this;
            self.$$searchStatus = true;
            wx && wx.onSearchBeacons({
                complete:function(argv){
                    if(self.$$searchStatus === false) {
                        self.stopSearchBeacons();
                        return;
                    }
                    //搜索中iBeancons设备
                    if(argv.beacons && argv.beacons.length) {
                        window.clearTimeout(self.$$timer);
                        callback && callback(argv.beacons[0]);
                        self.stopSearchBeacons();
                    }
                    window.clearTimeout(self.$$timer);
                    self.$$timer = window.setTimeout(function(){
                        self.stopSearchBeacons();
                    },10000);
                }
            });
            //超时时执行函数
            window.clearTimeout(self.$$timer);
            self.$$timer = window.setTimeout(function(){
                self.stopSearchBeacons();
                timeoutFn();
            },80000);
        },
        //设置微信卡券的临时票据
        selectWxCard: function(ticket,callback){
            var tk = this.$$weixinTicketSdk;
            wx && wx.chooseCard({
                shopId: ticket.showId, // 门店Id
                cardType: ticket.cardType, // 卡券类型
                cardId: ticket.cardId, // 卡券Id
                timestamp: tk.timestamp, // 卡券签名时间戳
                nonceStr: tk.nonceStr, // 卡券签名随机串
                signType: 'SHA1', // 签名方式，默认'SHA1'
                cardSign: tk.cardSign, // 卡券签名
                success: function (res) {
                    callback && callback(res);
                }
            });
        },
        //打开微信卡券
        addCard: function(cardInfo){
            var cardid = cardInfo['card_id'];
            return wxCardSignatureModel.execute({
                card_id: cardid,
                code: cardInfo['code']
            }).then(function(d){
                var cardExt = window.JSON.stringify({
                    code:'',
                    openid:"",
                    timestamp: d.timestamp,
                    nonce_str: d.noncestr,
                    signature: d.signature
                });
                wx.addCard({
                    cardList: [
                        {
                            cardId: cardid,
                            cardExt: cardExt
                        }
                    ],
                    success: function(res){
                        //alert(JSON.stringify(res));
                    }
                });
            },function(d){
                throw new Error(d);
            }).catch(function(e){
                console.log(e)
            });
        },
        //处理分享
        /*title: '', // 分享标题
        link: '', // 分享链接
        imgUrl: '', // 分享图标
        success: function () {
            // 用户确认分享后执行的回调函数
        },
        cancel: function () {
            // 用户取消分享后执行的回调函数
        }*/
        wxShare: function(content, shareItem){
            try {
                _.each(shareItem || ['onMenuShareTimeline','onMenuShareAppMessage','onMenuShareQQ','onMenuShareWeibo','onMenuShareQZone'],function(k, v){
                    wx[v](content);
                });
            } catch(e){}
        },
        previewImage: function(){
            try {
                wx.previewImage.apply(wx, arguments);
            } catch(e){}
        }
    };
    return $wx;
});
