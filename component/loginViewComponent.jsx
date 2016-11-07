/**
 * Created by sqsun on 2015/9/22.
 */
define(['react', 'jsx!headerViewComponent', 'koala', 'Models', 'router', 'RESTF','C','Fn','$location', '$q','react.backbone'], function(React, HeaderComp, Koala, Models, Router, RESTF, C, Fn, $location, $q) {
    var ModelLogin = RESTF.loginModel.getInstance();
    var ModelSign = RESTF.signModel.getInstance();
    var ModelVerify = RESTF.verifyModel.getInstance();
    var ModelMessage = RESTF.getMessageModel.getInstance();
    var wxConnectUserModel = RESTF.wxConnectUserModel.getInstance();         //去检测当前用户是否存在
    var setUserPasswordModel = RESTF.setUserPasswordModel.getInstance();     //给用户设置密码
    var Toast = new Koala.kUI.Toast(),
        Confirm = new Koala.kUI.Confirm({});
    var signForm = {};

    var VerifyComponent = React.createClass({
        getInitialState: function() {
            return {
              secondsRemaining: 60
            };
        },
        tick: function(){
            this.setState({secondsRemaining: this.state.secondsRemaining - 1});
            if (this.state.secondsRemaining <= 0) {
                this.interval && clearInterval(this.interval);
                this.interval = null;
                this.setState({secondsRemaining: 60});
            }
        },
        componentWillReceiveProps(nextProps) {
            this.setState({secondsRemaining: 60});
            this.interval && clearInterval(this.interval);
            this.interval = null;
        },
        componentWillUnmount: function() {
            this.interval && clearInterval(this.interval);
            this.interval = null;
        },
        countDown: function(){
            var self = this;
            return self.props.clickEvent(function(){
                self.interval = setInterval(self.tick, 1000);
            })
        },
        render: function(){
            var content;
            var clickEventFn = null;
            if(this.state.secondsRemaining == 60) {
              content = '获取验证码';
              clickEventFn = this.countDown;
            } else {
              content = '('+ this.state.secondsRemaining + ')重新获取';
            }
            return(
                <div className="getpwdCode" onClick={clickEventFn}>{content}</div>
            )
        }
    });


    var LoginViewComponent = React.createBackboneClass({
        getInitialState: function() {
            return { headerTitle: "", showLoginBtn: true, showLoginForm: false, showgetpwdForm: false, showLogo: true, showpwdForm: false, btnName: "下一步", btnClass: "login-getpwdbtn", getpwdOk: false};
        },
        componentWillReceiveProps: function (nextProps) {
            this.setState({headerTitle: "", showLoginBtn: true, showLoginForm: false, showgetpwdForm: false, showLogo: true, showpwdForm: false, btnName: "下一步", btnClass: "login-getpwdbtn", getpwdOk: false});
        },
        render: function() {
            var weiXinClass ="login-btn login-tbtn " + ( /*Fn.browser.isWeixin()*/ false ? "db" : " dn"),
                weiXinUrl = this.buildWeiXinUrl();
            //console.log(weiXinUrl)
            return (
                <section className={"flex view-warp " + (Fn.browser.isWeixin() ? "dn" : "")}>
                    <div className="login-header">
                        <div className="login-backbtn" onClick={this.backevent.bind(this)}><span className="loginnewicon">返回</span></div>
                        {this.state.headerTitle}
                    </div>
                    <div className="logoele">
                        <div className="logoele_bg"></div>
                    </div>
                    <div className="login-logobox">
                        HAPPY
                    </div>
                    <div className={this.state.showLogo ? "login-mainbox" : "login-mainbox getpwdbox"}>
                        {this.state.showLoginBtn &&
                            <div>
                                <a className={weiXinClass} href={ weiXinUrl }>微信登录</a>
                                <div className="login-btn" onClick={this.loginevent.bind(this)}>登录</div>
                                <div className="login-btn" onClick={this.signevent.bind(this)}>注册</div>
                            </div>
                        }
                        {this.state.showLoginForm &&
                            <div className="login-forme">
                                <div className="login-filed">
                                    <label className="bgimg login-label">手机号码</label>
                                    <div className="login-inputbox">
                                        <input className="login-input" autoFocus type="text" ref="loginMobile" placeholder="请输入手机号码" maxLength="11" />
                                    </div>
                                </div>
                                <div className="login-filed">
                                    <label className="bgimg login-label">密码</label>
                                    <div className="login-inputbox">
                                        <input className="login-input" type="password" ref="loginPassword" placeholder="请输入密码" maxLength="32" />
                                    </div>
                                </div>
                                <div className="login-submit">
                                    <div className="login-submitbtn" onClick={this.submitLogin.bind(this)}>登录</div>
                                </div>
                                <div className="login-getpwd" onClick={this.getpwd.bind(this)}>忘记密码？</div>
                            </div>
                        }
                        {this.state.showpwdForm &&
                            <div className="getpwd-forme">
                                <div className="login-filed">
                                    <label className="bgimg login-label pwdlabel">密码</label>
                                    <div className="login-inputbox">
                                        <input className="login-input" autoFocus type="password" ref="GPassword" placeholder="请输入密码" maxLength="32" />
                                    </div>
                                </div>
                                <div className="login-filed">
                                    <label className="bgimg login-label">密码</label>
                                    <div className="login-inputbox">
                                        <input className="login-input" type="password" ref="rGPassword" placeholder="再次输入密码" maxLength="32" />
                                    </div>
                                </div>
                                <div className="login-submit">
                                    <div className={this.state.btnClass} onClick={this.getpwdOk.bind(this)}>{this.state.btnName}</div>
                                </div>
                            </div>
                        }
                        {this.state.showgetpwdForm &&
                        <div className="getpwd-forme">
                            <div className="login-filed">
                                <label className="bgimg login-label">手机号码</label>
                                <div className="login-inputbox">
                                    <input className="login-input" autoFocus type="tel" ref="getpwdMobile" placeholder="请输入手机号码" maxLength="11" />
                                </div>
                            </div>
                            <div className="login-filed">
                                <label className="bgimg login-label login-vcode">验证码</label>
                                <div className="login-inputbox">
                                    <input className="login-input" type="tel" ref="getpwdVerify" placeholder="请输入验证码" maxLength="6" />
                                    <VerifyComponent clickEvent={this.getVerify} />
                                </div>
                            </div>
                            <div className="login-submit">
                                <div className={this.state.btnClass} onClick={this.getpwdNext.bind(this)}>{this.state.btnName}</div>
                            </div>
                        </div>
                        }
                        {this.state.getpwdOk &&
                        <div className="getpwd-forme">
                            <div className="bgimg scuessIcon"></div>
                            <div className="scuessText">新密码设置成功</div>
                            <div className="scuessBtn" onClick={this.doLoging.bind(this)}>立即登录</div>
                        </div>
                        }
                    </div>
                </section>
            );
        },
        backevent: function(){
            if(Router.previousView.actionUrl){
                window.history.back();
                return ;
            }
            window.location.href = '#index'
        },
        weiclogin: function(){
            Toast.show({
                Content: '微信登录'
            })
        },
        loginevent: function(){
            this.setState({ headerTitle: "", showLoginBtn: false, showLoginForm: true, showgetpwdForm: false, showLogo: true, showpwdForm: false, btnName: "下一步", btnClass: "login-getpwdbtn getpwdbtn-ok", getpwdOk: false });
        },
        signevent: function(){
            this.setState({ headerTitle: "", showLoginBtn: false, showLoginForm: false, showgetpwdForm: true, showLogo: true, showpwdForm: false, btnName: "下一步", btnClass: "login-getpwdbtn getpwdbtn-ok", getpwdOk: false });
        },
        submitLogin: function(){
            var mobileInput = this.refs.loginMobile;
            var passwordInput = this.refs.loginPassword;
            var mobileVal = $.trim(mobileInput.value);
            var reg = /^1\d{10}$/;
/*            if(mobileVal == '' || !reg.test(mobileVal)){
                alert('请输入正确的手机号码');
                mobileInput.focus();
                return
            }*/

            if(passwordInput.value == ''){
                passwordInput.focus();
                return
            }

            ModelLogin.setParam({
                "username": $.trim(mobileInput.value),
                "password": passwordInput.value,
                "verify_code": "1"
            })
            .execute()
            .then(function(data){
                if(data && data.non_field_errors){
                    Toast.show({
                        Content: data.non_field_errors || '用户名或密码错误'
                    })
                }else{
                    Models.userinfo.set(data);
                    if(Router.previousView && Router.previousView.actionUrl){//进入登录如果有历史页面则直接进入历史页面，没有则进入首页
                        Router.navigate(Router.previousView.actionUrl);
                    }else{
                        Router.navigate('index');
                    }
                    //获取用户私信
                    ModelMessage.setParam({
                        "receiver": data.id
                    })
                    .execute()
                    .then(function(data){
                        if(data && data.non_field_errors){
                            console.log(data.non_field_errors || '获取用户私信失败！！')
                        }else{
                            Models.userMessages.set(data);
                        }
                    },function(){
                        console.log('获取用户私信失败！！')
                    }).catch(function(e){
                        console.log(e)
                    });
                }
            },function(){
                Toast.show({
                    Content: '网络不给力啊，请稍后再试'
                })
            }).catch(function(e){
                console.log(e)
            });
        },
        getpwd: function(){
            this.setState({ headerTitle: "密码重置", showLoginBtn: false, showLoginForm: false, showgetpwdForm: true, showLogo: false, showpwdForm: false, btnName: "下一步", btnClass: "login-getpwdbtn", getpwdOk: false });
        },
        //下一步（此处存在逻辑，如果当前用户的手机号码已经）
        getpwdNext: function(){
            var mobileInput = this.refs.getpwdMobile;
            var verifyInput = this.refs.getpwdVerify;
            var mobileVal = $.trim(mobileInput.value);
            var verifyVal = $.trim(verifyInput.value);
            var reg = /^1\d{10}$/;
            var self = this;

            if(mobileVal == '' || !reg.test(mobileVal)){
                Toast.show({
                    Content: '请输入正确的手机号码'
                });
                mobileInput.focus();
                return
            }

            if(verifyVal == '' || verifyVal.length < 6){
                Toast.show({
                    Content: '请输入正确的手机验证码'
                });
                verifyInput.focus();
                return
            }
            //如果是从微信过来，则需要关联帐号信息
            if($location.search("needinfo") === "true" && $location.search("wxlogin")==="true") {
                var defer = $q.defer();
                wxConnectUserModel.execute({
                    mobile: mobileVal,
                    verify_code: verifyVal
                }).then(function(d){           //如果当前用户已经关联过帐号，则直接登录成功
                    if(d.user) {               //如果当前用户存在
                        var userInfo = d.user;
                        userInfo.token = d.token;
                        Models.userinfo.set(userInfo);
                        if(!userInfo.has_password) {        //如果需要设置密码，则引导用户去设置密码
                            Confirm = new Koala.kUI.Confirm({
                                message: '立即给您的帐号设置密码？',
                                buttons: [{
                                    text: '取消',
                                    click: function () {
                                        this.hide();
                                        Toast.show({
                                            Content: '登录成功，正在跳转用户中心'
                                        });
                                        window.setTimeout(function(){
                                            Router.navigate('usercenter');
                                        },1000);
                                    }
                                },{
                                    text: '确定',
                                    click: function () {
                                        this.hide();
                                        goNext();
                                    }
                                }]
                            });
                            Confirm.show()
                        } else {
                            Toast.show({
                                Content: '登录成功，正在跳转用户中心'
                            });
                            window.setTimeout(function(){
                                Router.navigate('usercenter');
                            },1000);
                        }
                    }
                },function(){
                    Toast.show({
                        Content: "网络错误"
                    });
                }).catch(function(e){
                    console.log(e)
                });
                return ;
            }
            goNext();

            /**
             * 微信登录下一步处理函数
             */
            function goNext(){
                signForm.username = mobileVal;
                signForm.mobile = mobileVal;
                signForm.verify_code = verifyVal;
                if(self.state.showLogo){
                    self.setState({ headerTitle: "", showLoginBtn: false, showLoginForm: false, showgetpwdForm: false, showLogo: true, showpwdForm: true, btnName: "注册", btnClass: "login-getpwdbtn getpwdbtn-ok", getpwdOk: false });
                } else {
                    self.setState({ headerTitle: "密码重置", showLoginBtn: false, showLoginForm: false, showgetpwdForm: false, showLogo: false, showpwdForm: true, btnName: "确定", btnClass: "login-getpwdbtn getpwdbtn-ok", getpwdOk: false });
                }
            }
        },
        getpwdOk: function(){
            var pwd = this.refs.GPassword;
            var rpwd = this.refs.rGPassword;
            var pwdV = $.trim(pwd.value);
            var rpwdV = $.trim(rpwd.value);
            var self = this;

            if(pwdV !== rpwdV){
                Toast.show({
                    Content: '两次密码输入的不一致'
                });
                return
            }

            if(pwdV.length < 6){
                Toast.show({
                    Content: '您输入的密码长度太短,最少需要6位'
                });
                return
            }
            if($location.search("needinfo") === "true" && $location.search("wxlogin")==="true") {
                var id = (Models.userinfo.get() || {}).id;
                setUserPasswordModel.execute({
                    user: id,
                    password:pwdV,
                    retype_password: rpwdV
                })
                .finally(function(){
                    Toast.show({
                        Content: '登录成功，正在跳转用户中心'
                    });
                    window.setTimeout(function(){
                        Router.navigate('usercenter');
                    },1000);
                });
                return ;
            }
            signForm.password = pwdV;
            Router.loading.show();
            ModelSign.setParam(signForm).execute().then(function(data){
                if(data && data.non_field_errors){
                    Toast.show({
                        Content: data.non_field_errors || '用户名或密码错误'
                    })
                }else{
                    Router.loading.hide();
                    self.setState({ headerTitle: "密码重置", showLoginBtn: false, showLoginForm: false, showgetpwdForm: false, showLogo: false, showpwdForm: false, btnName: "确定", btnClass: "login-getpwdbtn getpwdbtn-ok", getpwdOk: true });
                }
            },function(){
                Router.loading.hide();
                Toast.show({
                    Content: '网络不给力啊，请稍后再试'
                })
            }).catch(function(e){
                console.log(e)
            });
        },
        doLoging: function (){
            this.setState({ headerTitle: "", showLoginBtn: false, showLoginForm: true, showgetpwdForm: false, showLogo: true, showpwdForm: false, btnName: "确定", btnClass: "login-getpwdbtn getpwdbtn-ok", getpwdOk: false });
        },
        getVerify: function (callback){
            var mobileInput = this.refs.getpwdMobile;
            var mobileVal = $.trim(mobileInput.value);
            var reg = /^1\d{10}$/;
            var self = this;

            if(mobileVal == '' || !reg.test(mobileVal)){
                Toast.show({
                    Content: '请输入正确的手机号码'
                })
                mobileInput.focus();
                return
            }
            Router.loading.show();
            ModelVerify.setParam({mobile: mobileVal}).execute().then(function(data){
                if(data && data.non_field_errors){
                    Toast.show({
                        Content: data.non_field_errors || '发送验证码失败'
                    })
                }else{
                    Router.loading.hide();
                    if(callback){
                        return callback();
                    }
                }
            },function(){
                Router.loading.hide();
                Toast.show({
                    Content: '网络不给力啊，请稍后再试'
                })
            }).catch(function(e){
                console.log(e)
            });
        },
        /**
         * 构建微信的URL
         */
        buildWeiXinUrl: function(){
            var weiXinUrl = $location.url();
            weiXinUrl += weiXinUrl.indexOf('?') === -1 ? "?wxlogin=true": "&wxlogin=true";
            weiXinUrl = $location.absUrl().replace(/#.*/, '#' + weiXinUrl);
            weiXinUrl = window.encodeURIComponent(weiXinUrl);
            return (C['WX_LOGIN_URL'] + weiXinUrl);
        }
    });

    return LoginViewComponent;
})