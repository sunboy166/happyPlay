/**
 * Created by sqsun on 2015/9/22.
 */

define(['react', 'koala', 'jsx!eventDetailViewComponent', 'Models', 'router', 'RESTF','$location', 'Fn'],function(React, Koala, DetailComp, Models, Router, RESTF,$location,Fn){
    var ModelRestf = RESTF.getEventModel.getInstance();
    var ModelShows = RESTF.getEventShowListModel.getInstance();
    var ModelTopShows = RESTF.top_Dshows.getInstance();
    var ModelOtherShows = RESTF.other_Dshows.getInstance();
    var ModelgetNotify = RESTF.getNotify.getInstance();
    var ModelBroadcast = RESTF.getBroadcast.getInstance();//获取活动广播消息

    var Toast = new Koala.kUI.Toast();
    /**
     * @{Name} : eventDetail
     * @{Desc} : 活动详情页
     */
    Koala.pageView.eventDetail = Koala.pageView.extend({
        tagName: "section"
        ,className: 'happyplay-eventDetail'
        ,userBtn: function(){
            var userinfo = Models.userinfo.get() || {};
            /*if(userinfo && userinfo.id){
                Router.navigate('fuser/' + userinfo.id);
            }else{
                Router.navigate('login');
            }*/
            if(Fn.browser.isWeixin() || userinfo.id){
                Router.navigate('usercenter');
            } else  {
                var $showMaks = $('#talkmaskbox');
                var $img = $showMaks.find('img');
                $img.attr('src', 'http://7xpyh6.com1.z0.glb.clouddn.com/FrKwDHl2UrddFYPcLedoIp-KaST6??????????url=');
                $showMaks.show();
            }
        }
        ,photobtn: function () {
            $("#showmask").show()
            //Router.navigate('#graphic/detail/edit/'+ 14 +'?show=true');
        }
        ,onCreate: function(options){  //所有执行一次的事件都写在这里

        },
        events: {
            //跳转摇一摇页面检测
            'click .js_shake_hand': function(e){
                if(!Fn.browser.isWeixin()) {
                    Toast.show({
                        Content: "此功能仅对微信用户开放"
                    });
                    e.preventDefault();
                    return ;
                }
            }
        },
        onShow: function(params){
            window.Orientation = 0;
            //如果需要登录
            if(this.checkLogin()) {
                return ;
            }
            var self = this;
            var id = params.params.id;
            var detailComp = React.createFactory(DetailComp);
            var userinfo = Models.userinfo.get();
            var _param = {id: id};
            self.$el.find('#showmask').hide();
            if(userinfo && userinfo.id){
                _param.user = userinfo.id;
            }
            var detailComp = detailComp(
                {
                    title: "<i class='icon-happy fz30 c-green pos_center' style='font-size:80px;'></i>",
                    btnsConf: {
                        userBtn: self.userBtn,
                        userIcon: userinfo.image || "style/images/huser.png",
                        photobtn: self.photobtn,
                        commentbtn: false
                    },
                    model: Models.eventdetail
                }
            );
            React.render(detailComp, self.el);
            self.$el.find("#sliderimg").show();
            ModelRestf.setParam(_param).execute().then(function(data) {
                if (data && data.non_field_errors) {
                    Toast.show({
                        Content: data.non_field_errors || '获取活动详情信息，请稍后再试'
                    })
                } else {
                    Models.eventdetail.set(data);
                    var evData = data;

                    _showsParam={event: id};
                    if(userinfo && userinfo.id){
                        _showsParam.user = userinfo.id;
                    }

                    //获取活动晒
                    ModelShows.setParam(_showsParam).execute().then(function (data) {
                        if (data && data.non_field_errors) {
                            console.log(data.non_field_errors || '获取活动晒失败')
                        } else {
                            //var scoun = data.count;
                            //Models.eventdetail.set("showCount", scoun);
                            Models.eventdetail.set("wodesunjianArr",data.result[1]);
                        }
                    }, function () {
                        console.log('获取活动晒失败');
                    }).catch(function (e) {
                        console.log(e);
                    });

                    //推荐的晒
                    ModelTopShows.setParam(_showsParam).execute().then(function (data) {
                        if (data && data.non_field_errors) {
                            console.log(data.non_field_errors || '获取活动推荐晒失败')
                        } else {
                            Models.eventdetail.set("TopshowArr", data.shows);
                        }
                    }, function () {
                        console.log('获取活动推荐晒失败');
                    }).catch(function (e) {
                        console.log(e);
                    });

                    //其它的晒
                    ModelOtherShows.setParam(_showsParam).execute().then(function (data) {
                        if (data && data.non_field_errors) {
                            console.log(data.non_field_errors || '获取活动晒失败')
                        } else {
                            var tmpresults = {
                                nextPage : data.next,
                                showArrs : data.results
                            }
                            Models.eventdetail.set("showArr", tmpresults);
                        }
                    }, function () {
                        console.log('获取活动晒失败');
                    }).catch(function (e) {
                        console.log(e);
                    });


                    //获取用户评论

                    /***
                    ModelComment.setParam({event: params.params.id, pid: 0}).execute().then(function (data) {
                        if (data && data.non_field_errors) {
                            console.log(data.non_field_errors || '获取用户评论信息失败')
                        } else {
                            Models.eventdetail.set("commentData", data);
                        }
                    }, function () {
                        console.log('获取用户评论信息失败')
                    }) .catch(function (e) {
                        console.log(e)
                    });
                     */
                }
            });

            //用户信息
            var userParam = {};
            if(userinfo && userinfo.id){
                userParam.user = userinfo.id;
            }
            ModelgetNotify.setParam(userParam).execute().then(function (data) {
                if (data && data.non_field_errors) {
                    console.log(data.non_field_errors || '获取社交通知失败')
                } else {
                    var notifyNum = data.data || [];
                    if(notifyNum.length > 0){
                        for(var x = 0,l=notifyNum.length;x<l;x++){
                            if(notifyNum[x].social_type =="show-praise"){
                                self.$el.find("#comp-h-duser").addClass("comp-h-userIF");
                                break;
                            }
                        }
                    }
                }
            }, function () {
                console.log('获取社交通知失败');
            }).catch(function (e) {
                console.log(e);
            });

            showBroadcast();
            this.showBc = setInterval(showBroadcast,1000*60);
            //获取活动广播
            function showBroadcast(){
                ModelBroadcast.setParam({page:1,page_size:1,event:id}).execute().then(
                    function (data) {
                        if (data && data.non_field_errors) {
                            Models.showToast.set({closeShow:true,broadcastID:0});
                            //console.log(data.non_field_errors || '获取社交通知失败')
                        } else {
                            var broadcastData = data.results[0] || [];
                            var isShowObj =  Models.showToast.get();
                            var broadcastID = 0;
                            if(isShowObj && isShowObj.broadcastID){
                                broadcastID = isShowObj.broadcastID;
                            }
                            if(broadcastData && broadcastData.id > broadcastID){
                                Models.showToast.set({isShow:true,broadcastID:0});

                                Models.eventdetail.set("topBroadCost", broadcastData);

                                /*var topnoticeBox = self.$el.find('#topnotice_box');
                                var http_url = "";
                                if(/((http:\/\/)|(https:\/\/))/.test(broadcastData.url)){
                                    http_url = 'href="' + broadcastData.url + '"';
                                }
                                var tmpnotice = '<a class="noticelink" data-id="'+ broadcastData.id +'" '+ http_url +' ">'+ broadcastData.content + '</a>'
                                topnoticeBox.find('.tnoticec').html(tmpnotice);
                                topnoticeBox.show();*/
                            }
                        }
                    },
                    function () {
                        console.log('获取社交通知失败');
                    }).catch(
                    function (e) {
                        console.log("获取社交通知失败"+e);
                    });
            }
        },
        onLoad: function(params){

        },
        onHide: function(params){
            this.$el.find('#sliderimg').hide();
            this.$el.find("#comp-h-duser").removeClass("comp-h-userIF");
            window.swiper = null;
            document.title = "Happy";
            if(this.showBc){
                clearInterval(this.showBc)
            }
        },
        //微信直接进入需要强制登录
        checkLogin: function(){
            var userinfo = Models.userinfo.get() || {};
            var isLogin = !!(userinfo && userinfo.id && userinfo.token);
            var needLogin = $location.search('nlgn') === "true";
            var isInWx = Fn.browser.isWeixin();
            if(!isLogin && needLogin && isInWx) {
                Router.navigate('login');
                return true;
            }
            return false;
        }
    });
    return Koala.pageView.eventDetail;
});
