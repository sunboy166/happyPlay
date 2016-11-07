/**
 * Created by sqsun on 2015/9/22.
 */
define(['react', 'jsx!mainViewComponent', 'router', 'Models', 'koala', 'RESTF'], function(React, MainComp, Router, Models, Koala, RESTF) {
    var ModelRestf = RESTF.userSettingModel.getInstance();
    var ModelToken = RESTF.getTokenModel.getInstance();
    var ModelCert = RESTF.CertificateModel.getInstance();
    var ModelUpCert = RESTF.UpCertificateModel.getInstance();

    var Toast = new Koala.kUI.Toast();
    var uptoken = '';
    var imgCDN = 'http://7xpyh6.com1.z0.glb.clouddn.com/';
    var Vcarimg = './testimg/carimg.png';
    var Vcardata = null;
    var SettingViewComponent = React.createClass({
        getInitialState: function() {
            return {scrollable: "set"};
        },
        componentDidMount: function(){
            ModelToken.setParam({}).execute().then(function(data){
                if(data && data.non_field_errors){
                    Toast.show({
                        Content: data.non_field_errors || '获取Token失败，请稍后再试'
                    })
                }else{
                    uptoken = data.token;
                }
            },function(){
                Toast.show({
                    Content: '网络不给力啊，请稍后再试'
                })
            }).catch(function(e){
                console.log(e)
            });
        },
        componentWillReceiveProps: function (nextProps) {
            Vcardata = null;
            this.setState({scrollable: "set"});
        },
        render: function() {
            var cuserinfo = Models.userinfo.get();
            return (
                <MainComp btnsConf={this.props.btnsConf} title={this.props.title} navClass="comp-nav-ucenterbtn" gclass="settingCont">
                    {this.state.scrollable == "set" &&
                    <ul className="setbox">
                        <li className="setitem" onClick={this.niceSet.bind(this)}>
                            <div className="ucnicename">{cuserinfo.nick_name || '未设置昵称'}</div>
                            <div className="bgimg seticon"></div>
                            <div className="setlabel">更改昵称</div>
                        </li>
                        <li className="setitem dn" onClick={this.signSet.bind(this)}>
                            <div className="ucnicename">{cuserinfo.email || '更改签名'}</div>
                            <div className="bgimg seticon"></div>
                            <div className="setlabel">更改签名</div>
                        </li>
                        <li className="setitem dn" onClick={this.changePwd.bind(this)}>
                            <div className="bgimg seticon"></div>
                            <div className="setlabel">修改密码</div>
                        </li>
                        <li className="setitem dn" onClick={this.carSet.bind(this)}>
                            <div className="bgimg seticon"></div>
                            <div className="setlabel">认证车主资格</div>
                        </li>
                    </ul>
                    }

                    {this.state.scrollable == "nice" &&
                        <div className="niceset">
                            <div className="niceinputbox">
                                <input type="text" className="niceinput" ref="niceName" defaultValue={cuserinfo.nick_name || '未设置昵称'}/>
                            </div>
                            <div className="nicesubmit" onClick={this.niceChange.bind(this)}>保存</div>
                        </div>
                    }
                    {this.state.scrollable == "sign" &&
                        <div className="niceset">
                            <div className="niceinputbox">
                                <input type="text" className="niceinput" ref="sign" defaultValue={cuserinfo.email || '未设置签名'}/>
                            </div>
                            <div className="nicesubmit" onClick={this.signChange.bind(this)}>保存</div>
                        </div>
                    }

                    {this.state.scrollable == "car" &&
                        <div className="carbox">
                            <div className="carimg">
                                <img src={Vcarimg} width="100%" />
                            </div>
                            <div className="driverNAME">
                                <label className="driverlab">姓名：</label>
                                <input type="text" ref="driverName" className="drivernameinput" defaultValue={Vcardata.driver_name}/>
                            </div>
                            <div className="driverNAME">
                                <label className="driverlab">汽车型号：</label>
                                <input type="text" ref="cardType" className="drivernameinput" defaultValue={Vcardata.car_type}/>
                                <input type="hidden" ref="cardid" className="drivernameinput" defaultValue={Vcardata.id}/>
                            </div>
                            {Vcardata == null &&
                            <div>
                            <div className="cartip">请横向拍摄正页<br />照片上不要有阴影或反光</div>
                            < div className="carfilebox">
                                <div className="carfilebtn">上传行驶证照片</div>
                                <input className="pblish-photo" type="file" ref="carPhoto" onChange={this.upcarID.bind(this)}/>
                            </div>
                            </div>
                            }
                            {Vcardata != null &&
                            <div>
                                < div className="carfilebox">
                                    <div className="carfilebtn">更新行驶证信息</div>
                                    <input className="pblish-photo" type="file" ref="carPhoto" onChange={this.upcarID.bind(this)}/>
                                </div>
                            </div>
                            }
                        </div>
                    }
                    {this.state.scrollable == "password" &&
                    <div className="getpwd-forme">
                        <div className="login-filed">
                            <label className="bgimg login-label pwdlabel">当前密码</label>
                            <div className="login-inputbox">
                                <input className="login-input" autoFocus type="password" ref="CPassword"
                                       placeholder="请输入当前的密码" maxLength="32"/>
                            </div>
                        </div>
                        <div className="login-filed">
                            <label className="bgimg login-label pwdlabel">密码</label>
                            <div className="login-inputbox">
                                <input className="login-input" type="password" ref="GPassword"
                                       placeholder="请输入密码" maxLength="32"/>
                            </div>
                        </div>
                        <div className="login-filed">
                            <label className="bgimg login-label pwdlabel">密码</label>
                            <div className="login-inputbox">
                                <input className="login-input" type="password" ref="rGPassword" placeholder="再次输入密码"
                                       maxLength="32"/>
                            </div>
                        </div>
                        <div className="carfilebox">
                            <div className="carfilebtn" onClick={this.setpwdOk.bind(this)}>修改密码</div>
                        </div>
                    </div>
                    }
                </MainComp>
            )
        },
        changePwd(){
            this.setState({scrollable: "password"});
        },
        setpwdOk(){
            var cpwd = this.refs.CPassword.value;
            var gpwd = this.refs.GPassword.value;
            var rgpwd = this.refs.rGPassword.value;
            var userinfo = Models.userinfo.get();
            if(cpwd.length < 6 || gpwd.length < 6){
                Toast.show({
                    Content: '请正确输入密码，密码长度最少6位'
                })
                return
            }
            if(gpwd != rgpwd){
                Toast.show({
                    Content: '要修改的密码，两次输入不一致'
                })
                return
            }
            ModelRestf.execute({id: userinfo.id, password: gpwd}, {type: 'PUT'}).then(function(data){
                if(data && data.non_field_errors){
                    Toast.show({
                        Content: data.non_field_errors || '修改用户密码失败，请稍后再试'
                    })
                }else{
                    Models.userinfo.clear();
                    Toast.show({
                        Content: '密码修改成功'
                    })
                    window.location.href = '#login';
                }
            },function(){
                Router.loading.hide();
                Toast.show({
                    Content: '修改用户密码失败，请稍后再试'
                })
            }).catch(function(e){
                console.log(e)
            });
        },
        niceSet(){
            this.setState({scrollable: "nice"});
        },
        carSet(){
            var userinfo = Models.userinfo.get();
            var self = this;
            Router.loading.show();
            ModelCert.execute({user: userinfo.id}, {type: 'get'}).then(function(data){
                if(data && data.non_field_errors){
                    Toast.show({
                        Content: data.non_field_errors || '获取驾照图片失败，请稍后再试'
                    })
                }else{
                    var cnum = data.count;
                    if(cnum > 0){
                        var cresult = data.results[cnum - 1];
                        Vcarimg = cresult.certificate_image;
                        Vcardata = cresult;
                    }
                    Router.loading.hide();
                    self.setState({scrollable: "car"});
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
        upcarID(e){
            var self = this;
            var files = e.currentTarget.files;
            var file = files[0];
            var userinfo = Models.userinfo.get();
            if(file.type){
                if(!/image\/\w+/.test(file.type)){
                    Router.loading.hide();
                    Toast.show({
                        Content: '请确保文件为图像类型'
                    })
                    return;
                }
                var reader = new FileReader();
                Router.loading.show();
                reader.readAsDataURL(file);
                reader.onload = function(e){
                    var picdata = this.result;
                    var spicdata = picdata.split("base64,")[1];
                    var fileName = new Date().valueOf() + "_" + file.name;
                    var url = "http://up.qiniu.com/putb64/-1/" + fileName;
                    var xhr = new XMLHttpRequest();
                    xhr.onreadystatechange=function(){
                        if (xhr.readyState == 4 && xhr.status == 200 && xhr.responseText != "") {
                            var blkRet = JSON.parse(xhr.responseText);
                            var cid = self.refs.cardid.value;
                            var dname = self.refs.driverName.value;
                            var cartype = self.refs.cardType.value;
                            if(Vcardata){
                                ModelUpCert.execute({id:cid, audit_status: "1",car_type: cartype, user: userinfo.id, driver_name: dname, certificate_image: imgCDN + blkRet.key}).then(function(data){
                                    if(data && data.non_field_errors){
                                        Toast.show({
                                            Content: data.non_field_errors || '上传驾照图片失败，请稍后再试'
                                        })
                                    }else{
                                        Router.loading.hide();
                                        Toast.show({
                                            Content: '上传驾照图片成功，等待管理员验证',
                                            callBack: function(){
                                                Router.navigate('usercenter');
                                            }
                                        })
                                    }
                                },function(){
                                    Router.loading.hide();
                                    Toast.show({
                                        Content: '网络不给力啊，请稍后再试'
                                    })
                                }).catch(function(e){
                                    console.log(e)
                                });
                            }else{
                                ModelCert.execute({audit_status: "1",car_type: cartype, user: userinfo.id, driver_name: dname, certificate_image: imgCDN + blkRet.key}).then(function(data){
                                    if(data && data.non_field_errors){
                                        Toast.show({
                                            Content: data.non_field_errors || '上传驾照图片失败，请稍后再试'
                                        })
                                    }else{
                                        Router.loading.hide();
                                        Toast.show({
                                            Content: '上传驾照图片成功，等待管理员验证',
                                            callBack: function(){
                                                Router.navigate('usercenter');
                                            }
                                        })
                                    }
                                },function(){
                                    Router.loading.hide();
                                    Toast.show({
                                        Content: '网络不给力啊，请稍后再试'
                                    })
                                }).catch(function(e){
                                    console.log(e)
                                });
                            }
                        } else if (xhr.status != 200 && xhr.responseText) {
                            alert('图片上传失败，请确认您选择的是图片文件！')
                        }
                    }
                    xhr.open("POST", url, true);
                    xhr.setRequestHeader("Content-Type", "application/octet-stream");
                    xhr.setRequestHeader("Authorization", "UpToken " + uptoken);
                    xhr.send(spicdata);
                }
            }
        },
        niceChange(){
            var self = this;
            var nicename = this.refs.niceName.value;
            var cuserinfo = Models.userinfo.get();
            nicename = $.trim(nicename);
            if(nicename.length == 0 && nicename.length > 12){
                Toast.show({
                    Content: '请正确输入您的昵称，长度不能多于12个字符'
                });
                return
            }

            ModelRestf.execute({nick_name: nicename, id: cuserinfo.id}, {type: 'PUT'}).then(function(data){
                if(data && data.non_field_errors){
                    Toast.show({
                        Content: data.non_field_errors || '修改昵称失败，请稍后再试'
                    })
                }else{
                    Models.userinfo.set("nick_name",data.nick_name);
                    self.setState({scrollable: "set"});//重置状态，返回设置页面，重新渲染页面
                    Toast.show({
                        Content: '修改昵称成功'
                    });
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
        //更改签名
        signSet(){
            this.setState({scrollable: "sign"});
        },
        //保存签名
        signChange(){
            var self = this;
            var nicename = this.refs.sign.value;
            var cuserinfo = Models.userinfo.get();
            nicename = $.trim(nicename);
            if(nicename.length == 0 && nicename.length > 12){
                Toast.show({
                    Content: '请正确输入您的签名，长度不能多于12个字符'
                });
                return
            }

            ModelRestf.execute({email: nicename, id: cuserinfo.id}, {type: 'PUT'}).then(function(data){
                if(data && data.non_field_errors){
                    Toast.show({
                        Content: data.non_field_errors || '修改签名失败，请稍后再试'
                    })
                }else{
                    Models.userinfo.set("email",data.email);
                    self.setState({scrollable: "set"});//重置状态，返回设置页面，重新渲染页面
                    Toast.show({
                        Content: '修改签名成功'
                    });
                }
            },function(){
                Router.loading.hide();
                Toast.show({
                    Content: '网络不给力啊，请稍后再试'
                })
            }).catch(function(e){
                console.log(e)
            });
        }
    });
    return SettingViewComponent;
})