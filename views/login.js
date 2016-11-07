/**
 * Created by sqsun on 2015/9/22.
 */

define(['react', 'koala', 'jsx!loginViewComponent', 'RESTF', '$location','Fn', 'router','Models'/*, 'WX'*/],function(React, koala, LoginComp, RESTF, $location, Fn, Router, Models/*, WX*/){
    var getCurrentUserInfoModel = RESTF.getCurrentUserInfoModel.getInstance();       //微信登录成功之后，会获取用户信息
    var Toast = new koala.kUI.Toast();                                                  //toast提示
    /**
     * @{Name} : login
     * @{Desc} : 登录注册页
     */
    koala.pageView.login = koala.pageView.extend({
        tagName: "section"
        ,className: 'happyplay-login'
        ,backbtnFn: function(){
            window.history.go(-1);
        }
        ,onCreate: function(options){  //所有执行一次的事件都写在这里
            var loginComp = React.createFactory(LoginComp);
            var loginComp = loginComp({btnsConf:{backbtn: this.backbtnFn.bind(this)}});
            this.$$ReactView = React.render(loginComp, this.el);
        },
        onShow: function(params){
            //var userinfo = Models.userinfo.get();
            //if(userinfo && userinfo.id) {          //如果当前用户已经登录，则直接跳转到用户中心页面
            //    Router.navigate('usercenter');
            //    return ;
            //}
            //如果是在微信当中，当跳转到登录页面时，自动调起微信的登录授权
            var iswxlogin = $location.search('wxlogin');
            if(Fn.browser.isWeixin() && iswxlogin === undefined) {  //如果在微信当中，并且未权限时，则自动调起微信授权
                window.location.href= this.$$ReactView.buildWeiXinUrl();
                return ;
            }
            //微信登录成功之后的回调
            this.weiXinLoginCallback();
        },
        onLoad: function(params){
            this.saveFrom(params);
        },
        onHide: function(params){

        },
        weiXinLoginCallback: function(){
            if(Fn.browser.isWeixin()) {
                var is_from_login = $location.search('wxlogin'),        //是否从微信登录过来
                    is_need_add_info = $location.search('needinfo');    //是否需要添加用户信息
                if(is_from_login === 'true') {
                    /*if(is_need_add_info === 'true') {                    //如果需要完善用户信息
                        this.goRegister();
                    } else if(is_need_add_info === undefined) {*/
                        this.getUserInfo();
                    //}
                }
            }
        },
        /**
         * 如果发现当前用户登录，则去查找用户信息
         */
        getUserInfo: function(){
            var iswxlogin = $location.search('wxlogin');
            if(iswxlogin === 'true') { //如果发现wxlogin参数为true，就表示是从微信登录成功后返回到登录页面，此时，需要去获取用户信息，并写入到localstorage中
                Router.loading.show();
                getCurrentUserInfoModel.execute().then(function(data){
                    Router.loading.hide();
                    if(data && data.non_field_errors){
                        Toast.show({
                            Content: data.non_field_errors || '用户名或密码错误'
                        })
                    }else{
                        Models.userinfo.set(data);
                        var fr = (Models.LoginFromUrl.get() || {}).fr;
                        Router.navigate(fr || "index", true, true);
                        Models.LoginFromUrl.clear();
                    }
                },function(){
                    Router.loading.hide();
                    Toast.show({
                        Content: '网络不给力啊，请稍后再试'
                    });
                });
            }
        },
        /**
         * 如果发现当前用户未完成帐号的关联，则直接跳转到注册页面
         */
        goRegister: function(){
            var ReactView = this.$$ReactView;
            ReactView.signevent();
        },
        //保存来源URL
        saveFrom: function(param){
            var fr = Fn.getAttr(param, 'from.actionUrl');
            if(fr) {
                Models.LoginFromUrl.set({
                    fr: fr
                });
            }
        }
    });

    return koala.pageView.login;
});
