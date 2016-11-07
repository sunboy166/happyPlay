/**
 * Created by liuyang on 2016/5/01.
 */

define(['react', 'koala', 'jsx!shakeHanderViewComponent', 'RESTF', '$location','Fn', 'router','Models', '$WX','Shake'],function(React, koala, LoginComp, RESTF, $location, Fn, Router, Models, $wx,Shake){
    var searchIbeansModel = RESTF.searchIbeansModel.getInstance(),          //根据ibeacon设备查找卡券
        timeWeChatModel = RESTF.timeWeChatModel.getInstance(),               //微信时间卡
        userShakeCardList = RESTF.userShakeCardList.getInstance(),           //当前用户所有卡券的集合
        createAudio = function(src, id){
            var auido = null;
            if(!(audio = document.querySelector('audio#'+id))) {
                audio = new Audio(src);
                audio.setAttribute('id', id);
                audio.volume = 1;
                audio.setAttribute('preload', 'auto');
                document.body.appendChild(audio);
            }
            return audio;
        },
        setShakeAudoMusic = createAudio('audio/shake-music.mp3','shakeAudio'),
        resultAudioMusic = createAudio('audio/get-shake-result.wav', 'resultAudio');
    var Toast = new koala.kUI.Toast();                                                  //toast提示
    /**
     * @{Name} : login
     * @{Desc} : 登录注册页
     */
    koala.pageView.shakeHander = koala.pageView.extend({
        tagName: "section"
        ,className: 'bgcgrey'
        ,backbtnFn: function(){
            window.history.go(-1);
        },
        dataModel: {},
        stateModel: {
            type: 'cloud',                     //type: 'cloud' || 'ibeacon'
            text: '',                          //:展示提示文案
            showLayer: false,                  //是否展示显示卡
            resultType: '',
            step: '',                          //加载进度，当为finish表示请求服务完成
            showNotice: true                   //是否显示提示
        }
        ,onCreate: function(options){  //所有执行一次的事件都写在这里
            var loginComp = React.createFactory(LoginComp);
            var loginComp = loginComp({
                btnsConf:{
                    backbtn: this.backbtnFn,
                    viewHisbtn:this.viewHistory.bind(this)
                },
                title: "摇一摇"
            });
            this.$$ReactView = React.render(loginComp, this.el);
        },
        onShow: function(params){
            var userinfo = Models.userinfo.get(),
                isLogin = !!(userinfo && userinfo.id && userinfo.token);
            //如果用户未登录，则直接跳转登录
            if(!isLogin) {
                Router.navigate('login');
                return true;
            }

            //渲染页面
            this.renderPage(params);
            //展示摇一摇列表
            this.renderList();
            //绑定摇一摇事件
            this.eventsBindShakeHand();
        },
        onHide: function(params){
            //关闭摇一摇
            this.shakeStop();
            //取消请求数据
            searchIbeansModel.cancel();
            //取消摇一摇事件绑定
            this.shakeCancel && this.shakeCancel();
        },
        renderPage: function(param){
            var select = $location.search('select') === "ibeacon";
            var dataModel = this.dataModel = {
                    id: ~~param.params.event,
                    ibeacon: [],                 //线下
                    cloud: [],                    //云端
                    slide:"",
                    description: ""             //底部议案描述
                },
                stateModel = this.stateModel = {
                    type: select ? "ibeacon" : "cloud",                     //type: 'card' || 'shun'
                    text: '',
                    showLayer: false,
                    resultType:'',
                    step: '',
                    showNotice: true
                },
                ReactView = this.$$ReactView;

            ReactView.setProps(dataModel);
            ReactView.setState(stateModel);
        },
        events: {
            'click .js_toggle_changeshake': 'eventsChangeShakeType',         //改变摇一摇类型
            'click .js_open_wx_card': 'eventsOpenWxCard',                     //打开微信的卡券
            'click .js_hide_layer': 'closeLayer',                              //关闭打开的弹层
            'click .js_open_shun': 'openShun',                                   //打开晒的页面
            'click .js_notice_wrap': 'closeNotice',                              //关闭顶部的进示
            'click .js_view_layer': 'openPopLayer'                               //打开活动弹层
        },
        //绑定摇一摇事件
        eventsBindShakeHand: function(e){
            if($location.search('debug') === "true") {
                this.shakeHandler();
            }  else {
                var stateModel = this.stateModel,
                ReactView = this.$$ReactView;
                //this.setTipText('摇一摇你的手机，有惊喜');
                //绑定摇一摇事件
                if(this.shakeCancel) {
                    this.shakeCancel();
                }
                this.shakeCancel = this.shakeStart();
            }
        },
        //改变摇一摇类型
        eventsChangeShakeType: function(e){
            var $currentTarget = $(e.currentTarget),
                ReactView = this.$$ReactView,
                state = this.stateModel;
            state.type = $currentTarget.data('type');
            ReactView.setState(state);
        },
        //打开微信卡券
        eventsOpenWxCard: function(e){
            var $currentTarget = $(e.currentTarget),
                cardid = $currentTarget.data('card-id');
            $wx.addCard({
                card_id: cardid,
                code: ''
            },function(d){
                console.log(d);
            });
        },
        //开启摇一摇
        shakeStart: function(){
            var myShakeEvent;
            myShakeEvent = this.$$myShakeEvent = this.$$myShakeEvent || new Shake({
                threshold: 15
            });
            this.shakeStop();
            this.shakeCancel && this.shakeCancel();
            myShakeEvent.start();
            var bindFn = this.shakeHandler.bind(this);
            window.addEventListener('shake', bindFn, false);
            return function(){
                window.removeEventListener('shake', bindFn, false);
            }
        },
        //处理摇一摇事件
        shakeHandler: function(e){
            var self = this,
                state = self.stateModel;
            if(state.type === "cloud") {      //普通卡券
                self.searchGenerallCard();
            } else if(state.type === "ibeacon") {  //ibeancon查找卡券
                self.ibeaconSearchCard();
            }
            window.setTimeout(function(){
                setShakeAudoMusic.play();
            });
        },
        //关闭摇一摇
        shakeStop: function(){
            var myShakeEvent;
            myShakeEvent = this.$$myShakeEvent;
            try {
                myShakeEvent.stop();
                window.removeEventListener('shake', this.shakeHandler, false);
            } catch(e){}
        },
        //设备提示信息
        setTipText: function(text){
            Toast.show({
                Content: text
            });
        },
        //查找普通卡券
        searchGenerallCard: function(){
            var self = this,
                ReactView = self.$$ReactView,
                dataModel = self.dataModel,
                state = self.stateModel,
                userinfo = Models.userinfo.get() || {},
                timer = new Date();
            //开启查找iBeancons设备
            Toast.show({
                Content:'正在查找卡券，请稍后'
            });
            timeWeChatModel.execute({
                event:dataModel.id,
                user:userinfo.id
            }).then(function(d){
                window.setTimeout(function(){
                    var cardInfo = d['card_info'] || {};
                    if(cardInfo.errmsg && cardInfo.errmsg=="ok") {
                        dataModel.shakeCard = cardInfo;
                        cardInfo.image = d.image;
                        state.showLayer = true;
                        Toast.hide();
                    } else if(cardInfo.errmsg && cardInfo.errmsg != "ok") {
                        Toast.show({
                            Content: "出错了，请稍后再试"
                        });
                        state.text = "";
                        state.resultType = "";
                    } else {
                        /*Toast.show({
                            Content: "啊噢！没有摇中卡券，再试一试手气吧！"
                        });*/
                        dataModel.shakeCard = {
                            id:"0",
                            title: "再接再励！再摇一次！",
                            content: "不要灰心！老师说，没有摇到福利是成功摇到福利的妈妈",
                            image: "img/shake-no-result.jpg",
                            timeout:'',
                            url: "http://ahappyapp.com/app/index.html#event/detail/14"
                        };
                        cardInfo.image = d.image;
                        state.showLayer = true;
                    }
                    ReactView.setProps(dataModel);
                    ReactView.setState(state);
                    setShakeAudoMusic.pause();
                    setShakeAudoMusic.currentTime = 0;
                    resultAudioMusic.play();
                    Toast.hide();
                }, Math.max(1500, (new Date() - timer) / 1000));
            },function(d){
                window.setTimeout(function(){
                    Toast.show({
                        Content: "出错了，请稍后再试"
                    });
                    window.setTimeout(function(){
                        setShakeAudoMusic.pause();
                        setShakeAudoMusic.currentTime = 0;
                        resultAudioMusic.play();
                    }, 500);
                }, Math.max(1500, (new Date() - timer) / 1000));
            });
        },
        //通过ibeacon查找卡券
        ibeaconSearchCard: function(){
            var self = this,
                ReactView = self.$$ReactView,
                dataModel = self.dataModel,
                state = self.stateModel,
                userinfo = Models.userinfo.get() || {};
            //开启查找iBeancons设备
            self.setTipText('正在查找附近设备');

            if($location.search('debug')) {
                var search = {
                    user: 85,
                    event: 110,
                    uuid: 'FDA50693-A4E2-4FB1-AFCF-C6EB07647825',
                    major:"10057",
                    minor: "34663"
                };
                self.setTipText('正在搜索');
                self.searchIbeaCon(search);
            } else {
                $wx.startSearchBeacons(function(){},function(){
                    //查找附近设备失败时执行
                    //self.setTipText('');
                });
                $wx.onSearchBeacons(function(ibeans){
                        var search = {
                            user: userinfo.id,
                            event: dataModel.id,
                            uuid: ibeans.uuid,
                            major: ibeans.major,
                            minor: ibeans.minor
                        };
                        self.searchIbeaCon(search);
                    },function(){
                        Toast.show({
                            Content: "查找设备超时,请重试"
                        });
                        //查找附近ibeancons超时时执行
                        //self.setTipText('');
                        self.shakeStart();
                });
                this.shakeStop();
            }
        },
        //查找IbeaCon设备
        searchIbeaCon: function(search){
            var self = this,
                ReactView = self.$$ReactView,
                dataModel = self.dataModel,
                state = self.stateModel;
            searchIbeansModel.get(search).then(function(d){
                dataModel.shakeCard = d["show_card"] || Fn.getAttr(d, "wechat_card.card_info");
                dataModel.shakeCard.image = Fn.getAttr(d, 'show_card.image') || Fn.getAttr(d, 'wechat_card.image');
                state.showLayer = true;
                ReactView.setProps(dataModel);
                ReactView.setState(state);
                Toast.hide();

                var audio = setShakeAudoMusic('audio/get-shake-result.wav');
                audio.play();

            },function(d){
                Toast.show({
                    Content: "网络错误"
                });

                var audio = setShakeAudoMusic('audio/get-shake-result.wav');
                audio.play();
                self.setTipText("");
                self.shakeStart();
            }).catch(function(e){
                console.log(e);
            });
        },
        //获取卡券列表
        renderList:function(){
            var dataModel = this.dataModel,
                ReactView = this.$$ReactView,
                dataModel = this.dataModel,
                userinfo = Models.userinfo.get() || {},
                state = this.stateModel,
                self = this;
            userShakeCardList.execute({
                event: dataModel.id,
                user: userinfo.id
            }).then(function(d){
                var renderData = buildRenderData(d);
                dataModel.slide = d.slideshow || "";
                dataModel.ibeacon.push.apply(dataModel.ibeacon, renderData.ibeacon);
                dataModel.cloud.push.apply(dataModel.cloud, renderData.cloud);
                dataModel.description = d.description;
                state.step = "finish";
                ReactView.setProps(dataModel);
                ReactView.setState(state);

                //处理微信分享
                var eventTitle = $location.search('et') || "";
                var title = "【"+ eventTitle +"】,福利领到手软，HAPPY停不下来！";
                var shareContent = {
                    title: title,
                    desc: "【" + eventTitle + "】，摇出福利无限大，玩出HAPPY好生活！",
                    link: window.location.href,
                    imgUrl: "http://ahappyapp.com/app/img/logo.jpg",
                    type: 'link',
                    dataUrl: "",
                    trigger: function(){
                        console.log(arguments);
                    },
                    success: function(){
                        console.log(arguments);
                    },
                    cancel: function(){
                        console.log(arguments);
                    },
                    fail: function (res) {
                        console.log(arguments);
                    }
                };
                $wx.wxShare(shareContent);
            },function(d){
                self.shakeStart();
            });

            /**
             * 构建用户列表渲染的数据
             * @param data
             * @returns {{}}
             */
            function buildRenderData(data){
                var cloud = data.timed_cards,
                    ibeacon = data.ibeacon_cards.concat(data.show_cards);
                cloud.sort(function(current, next){
                    return (buildDate(current.begin_time) - buildDate(next.begin_time));
                });
                ibeacon.sort(function(current, next){
                    return (buildDate(current.begin_time) - buildDate(next.begin_time));
                });
                return {
                    ibeacon:ibeacon,
                    cloud:cloud
                }
            }

            function buildDate(dstr){
                //return new Date(dstr.replace('T',' ').replace('Z','').replace("-","/"));
                return new Date(dstr);
            }
        },
        closeLayer: function(e){
            var state = this.stateModel,
                ReactView = this.$$ReactView;
            state.showLayer = false;
            ReactView.setState(state);
            //重新绑定摇一摇事件
            this.eventsBindShakeHand();
        },
        openShun: function(e){
            var $currentTarget = $(e.currentTarget),
                id = $currentTarget.data('card-id'),
                url = $currentTarget.data('url');
            if(url) {
                window.location.href = url;
                return ;
            }
            $location.url('sundetail/' + id);
        },
        viewHistory: function(e){
            var id = this.dataModel.id;
            $location.url('shakehis/' + id);
        },
        closeNotice: function(e){
            var state = this.stateModel;
            state.showNotice = !state.showNotice;
            this.$$ReactView.setState(state);
        },
        openPopLayer: function(e){
            var url = ($(e.currentTarget).data('url') || "").match(/url=(.*)/);
            if(url && url[1]) {
                this.openPop({
                    url: url[1]
                });
            }
        },
        openPop:function(parmas){
            var $popup = $('#js-location-viewer_detail');
            var url = "",
                ptitle = "";

            if(parmas){
                url = parmas.url;
            }
            if (!$popup.length) {
                var popup = document.createElement('div');
                popup.className = 'popup';
                popup.id = 'js-location-viewer_detail';
                popup.innerHTML = '<div class="popup_box"><div class="popup_header"><p>'+ptitle+'</p><a href="javascript:void(0)" class="bgimg icodeclose js-close"></a></div><div class="popup_content" style="-webkit-overflow-scrolling: touch;overflow-y:scroll;"><iframe src="' + url + '" style="border: 0; width: 100%; height: 100%;" width="100%" height="100%"></iframe></div></div>';
                document.body.appendChild(popup);
                $popup = $(popup);
                $popup.fadeIn();

                $popup.on('click', function(){
                    $popup.fadeOut();
                });
                $popup.on('click', '.popup_content', function(e){
                    e.stopPropagation();
                });
                $popup.on('click', '.js-close', function() {
                    $popup.fadeOut();
                });
            } else {
                $popup.find('iframe').hide().attr('src', url);
                $popup.fadeIn(300, function(){
                    $popup.find('iframe').show()
                });
            }
        }
    });

    return koala.pageView.shakeHander;
});