/**
 * Created by sqsun on 2015/9/22.
 */
define(['react', 'jsx!mainViewComponent', 'router', 'Models', 'koala', 'RESTF', 'react.backbone'], function(React, MainComp, Router, Models, Koala, RESTF) {
    var ModelUShow = RESTF.userShowModel.getInstance();
    var ModelUFollow = RESTF.followsModel.getInstance();
    var ModelUEvent = RESTF.userEventModel.getInstance();
    var ModelToken = RESTF.getTokenModel.getInstance();
    var ModelUserinfo = RESTF.userSettingModel.getInstance();


    var Toast = new Koala.kUI.Toast();
    var UserEvent = [];
    var UserEventLists = {};
    var isGetEvent = false;//是否已拉取活动数据标志位
    var uptoken = '';
    var imgCDN = 'http://7xpyh6.com1.z0.glb.clouddn.com/';
    var PublishViewComponent = React.createBackboneClass({
        getInitialState: function() {
            return {first: false, secend: true, upuevent: 0};
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
                console.log('获取Token失败，请稍后再试');
            }).catch(function(e){
                console.log(e)
            });
        },
        componentWillReceiveProps: function (nextProps) {
            this.setState({first: false, secend: true, upuevent: 0});
        },
        componentDidUpdate: function () {//每次渲染结束后调用此方法，完成图片懒加载
            var self = this;
            var userinfo = this.getModel().get();
            var cuserinfo = Models.userinfo.get();
            var getuid = 0;
            if(userinfo.id !== cuserinfo.id && userinfo.id){
                getuid = userinfo.id
            }else{
                getuid = cuserinfo.id
            }

            Router.loading.show();
            ModelUShow.setParam({user: getuid}).execute().then(function(data){
                if(data && data.non_field_errors){
                    Toast.show({
                        Content: data.non_field_errors || '获取用户瞬间失败，请稍后再试'
                    })
                }else{
                    showDataList = data.results;
                    Router.loading.hide();
                    //self.setState({upuevent: 1});
                }
            },function(){
                Router.loading.hide();
                Toast.show({
                    Content: '网络不给力啊，请稍后再试'
                })
            }).catch(function(e){
                console.log(e)
            });
            return false;
            if(this.state.secend){
               var _showimglist = $(".uctabox .ucpsunbox li div img");
                if(_showimglist.length){
                    for(var m in _showimglist){
                        var $imgEle = $(_showimglist[m]);
                        var div_width = $imgEle.parent().width();
                        var _src = $imgEle.data("src");
                        if(_src){
                            (function(imgele,src){
                                var _imgObj = new Image();
                                _imgObj.src = src;
                                _imgObj.onload = function () {
                                    var _ele_height = _imgObj.height*div_width/_imgObj.width;
                                    imgele.src = src;
                                    imgele.width(div_width);
                                    imgele.height(_ele_height);
                                }
                            })($imgEle,_src)
                        }
                    }
                }
            }
        },
        render: function() {
            var userinfo = this.getModel().get();
            var cuserinfo = Models.userinfo.get();
            var showDataList = userinfo["showucenter"] || [];
            var showlength = showDataList.length;
            var showDomList = [];
            var sunItem = <div className="none_result_tip fz16">暂无瞬间</div>;
            if(showlength > 0){
                var imgitem = [], z =0;
                for(var i=0; i< showlength; i++){
/*                    if(i>3 && i<6){
                        showDataList[i].cover_image="";
                    }*/
                    var coverImg = showDataList[i].cover_image + '';
                    coverImg = coverImg.split('||');
                    var cImg = coverImg[0];
                    if(!cImg){
                        imgitem[z]  =<div className="uc-sun" data-id={showDataList[i].id}>
                            <div className="text_two_line top55" data-id={showDataList[i].id}>{showDataList[i].title}</div>
                        </div>
                    }else{
                        cImg = cImg + '?imageView2/2/w/200/format/jpg';
                        imgitem[z] = <div className="uc-sun">
                            <div className="img-auto-wrap img-auto-wrap2  rate100 img-bg-auto-wrap" style={{
                                'background-image': 'url(' + cImg + ')'
                            }} data-id={showDataList[i].id}>
                            </div>
                        </div>;
                    }
                    ++z;
                    if(i+1 == showlength || (i!=0 && (i+1)%3 == 0)){
                        var emptyDiv = <div className="uc-sun"></div>,
                            showDmo = [emptyDiv,emptyDiv,emptyDiv];
                        for(var x=0,y = imgitem.length;x<y;x++){
                            showDmo[x] = imgitem[x];
                        }
                        showDomList[showDomList.length] =<li className="flex uc-sunbox">{showDmo}</li>;
                        imgitem.length = 0;
                        z = 0;
                    }
                }
            }else{
                showDomList[0] = <li className="flex uc-sunbox">{sunItem}</li>;
            }
            return (
                <MainComp btnsConf={this.props.btnsConf} title={this.props.title} navClass="comp-nav-ucenterbtn" gclass="messageCont">
                    <div className="messageListBox">
                        <div className="ucenteribox">
                           
                            <div className="ucenterimgbox img-auto-wrap img-auto-wrap2">
                                <img src={userinfo.image || ""} width="233px" height="auto" alt=""/>
                                {userinfo.id == cuserinfo.id &&
                                <input className="pblish-photo" type="file" onChange={this.changeUIimg.bind(this)}
                                       accept="image/*"/>
                                }
                            </div>
                            
                        </div>
                        <div className="ucenterinfobox">
                            <div className="ucentername">
                                <span className="ucname" onClick={this.niceName.bind(this)}>{userinfo.nick_name || '未设置昵称'}</span>
                                <span className="ucvify"></span>
                            </div>
                            <div className="ucentersig">{userinfo.remark}</div>
                            <div className="ucenteropt dn">
                                <span className="messagecar">{userinfo.carType}</span>
                                <span className="messageuaddress"> · 上海</span>
                            </div>
                        </div>
                        <div className="flex ucenterctr">
                            <div className="ucrow">
                                <div className="ucrnum c-deep-yellow" onClick={this.goToMyFunIndex.bind(null)}>{userinfo.show_count}</div>
                                <div className="ucrlabel">好玩指数</div>
                            </div>
                            <div className="ucrow">
                                <div className="ucrnum c-green">{userinfo.follower_count}</div>
                                <div className="ucrlabel">粉丝</div>
                            </div>
                            <div className="ucrow">
                                <div className="ucrnum c-green">{userinfo.following_count}</div>
                                <div className="ucrlabel">关注</div>
                            </div>
                        </div>
                        <div id="notificationCountDom" className="tac mb20 none">
                            <span className="ucrnum-notice" onClick={this.shownotification.bind(this)}></span>
                        </div>
                        <div className="uctabs">
                            <div className="uctab uctcur" onClick={this.csun.bind(this)}>瞬间</div>
                            <div className="uctab" onClick={this.cevent.bind(this)}>活动</div>
                        </div>
                        <div className="uctabox">
                            {this.state.first &&
                                <div>
                                    {UserEventLists}
                                </div>
                            }

                            {this.state.secend &&
                                <ul className="ucpsunbox" ref="ucsunBox" onClick={this.showD.bind(this)}>
                                    {showDomList}
                                </ul>
                            }
                        </div>
                    </div>
                </MainComp>
            )
        },
        cevent (e){
            var cobj = $(e.target);
            cobj.addClass('uctcur').siblings().removeClass('uctcur');
            if(isGetEvent){
                this.setState({first: true, secend: false});
                return;
            }
            var self = this;
            var userinfo = this.getModel().get();
            var cuserinfo = Models.userinfo.get(),
                getuid = null;
            if(userinfo.id !== cuserinfo.id){
                getuid = userinfo.id
            }else{
                getuid = cuserinfo.id
            }
            Router.loading.show();
            ModelUEvent.setParam({founder: getuid}).execute().then(function(data){
                Router.loading.hide();
                if(data && data.non_field_errors){
                    Toast.show({
                        Content: data.non_field_errors || '获取用户活动失败，请稍后再试'
                    })
                }else{
                    isGetEvent = true;
                  var UserEvent = data.results;
                    if(UserEvent.length < 1){
                        UserEventLists[0] = <div className="ucpsunbox"><div className="none_result_tip fz16">暂无活动</div></div>
                    }else{
                        UserEvent.map(function(item, index){
                            var esDate = new Date(item.event_begin_time);
                            var eeDate = new Date(item.event_end_time);
                            var evDT = self.getYMD(esDate) + ' - ' + self.getYMD(eeDate, 'MMDD');
                            var sinDT = self.GetRTime(esDate, eeDate);
                            var coverImg = item.cover_image + '';
                            var address = item.address || "";
                            var addresstxt = '';
                            if(address.content != ''){
                                addresstxt = address.content
                            } else {
                                addresstxt = address.name
                            }
                            coverImg = coverImg.split('||');
                            if(coverImg[0].length > 0 ){
                                coverImg = coverImg[0]
                            }else{
                                coverImg = './testimg/pic.png'
                            }
                            UserEventLists[index] = <div className="ucevents" data-id={item.id} onClick={self.navEventDetil.bind(self)}>
                                <div className="detail-images">
                                    <div className="detail-imagebox img-auto-wrap img-bg-auto-wrap" style={{'background-image': 'url(' + coverImg +
'?imageMogr2/gravity/Center/crop/600x233)'}}>
                                        <img className="hd" src={coverImg + "?imageMogr2/gravity/Center/crop/600x233"} width="100%" height="auto" alt=""/>
                                    </div>
                                    {/*item.ticket_amount > 0 &&
                                     <div className="detail-pric">
                                     <span className={"sp-lit-price"}><sup>¥</sup>{item.ticket_amount}<i className="icon-lock-1"></i></span>
                                     </div>
                                     */}
                                </div>
                                <div className="uc-htitle">{item.title}</div>
                                <div className="uc-ptime">
                                    <div className="uc-ptltime">{sinDT}</div>
                                    <div className="uc-ptdate">{evDT}</div>
                                </div>
                                <div className="uc-ptaddress">{addresstxt}</div>
                            </div>;
                        })
                    }
                    self.setState({first: true, secend: false});
                }
            },function(){
                Router.loading.hide();
                Toast.show({
                    Content: '网络不给力啊，请稍后再试'
                })
            }).catch(function(e){
                Router.loading.hide();
                console.log(e)
            });
        },
        csun (e){
            var cobj = $(e.target);
            cobj.addClass('uctcur').siblings().removeClass('uctcur');
            this.setState({first: false, secend: true});
        },
        showD(e){
            var Jtarget = $(e.target);
            var id = Jtarget.data('id');
            if(id) Router.navigate('sundetail/' + id)
        },
        niceName(){
            Router.navigate('usercenter/setting')
        },
        fllowed(e){
            var Jobj = $(e.currentTarget);
            var founder = Jobj.data("id");
            var userinfo = Models.userinfo.get();
            ModelUFollow.setParam({followed: founder, follower: userinfo.id}).execute().then(function(data){
                if(data && data.non_field_errors){
                    Toast.show({
                        Content: data.non_field_errors || '加关注失败，请稍后再试'
                    })
                }else{
                    Jobj.addClass("ucenterfbtn");
                    Toast.show({
                        Content: '加关注成功'
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
        talkcall(e){
            var Jobj = $(e.currentTarget);
            var id = Jobj.data("id");
            Router.navigate('messages/private/'+ id);
        },
        getYMD(data, fmt){
            var eventEY = data.getFullYear();
            var eventEM = (data.getMonth() + 1) < 10 ? "0" + (data.getMonth() + 1) : (data.getMonth() + 1);
            var eventED = data.getDate() < 10 ? "0" + data.getDate() : data.getDate();

            if(fmt == 'MMDD'){
                return eventEM + '月' + eventED + '日';
            }else{
                return eventEY + '年' + eventEM + '月' + eventED + '日';
            }
        },
        GetRTime(StartTime, EndTime){
            var NowTime = new Date();
            var t = StartTime.getTime() - NowTime.getTime();
            var e = EndTime.getTime() - NowTime.getTime();
            var d=0;
            var h=0;
            if( e > 0){
                //d=Math.floor(e/1000/60/60/24);
                //h=Math.floor(e/1000/60/60%24);
                return '已开始';
            }else{
                return '已结束';
            }
        },
        navEventDetil(e){
            var Jobj = $(e.currentTarget);
            var id = Jobj.data("id");
            Router.navigate('event/detail/' + id);
        },
        changeUIimg(e){
            var self = this;
            var _this = e.currentTarget;
            var src = _this.files;
            var file = src[0];
            if(file){
                if(file.type){
                    if(!/image\/\w+/.test(file.type)){
                        Toast.show({
                            Content: '请确保文件为图像类型'
                        })
                        return;
                    }
                    var reader = new FileReader();
                    reader.readAsDataURL(file);
                    reader.onload = function(e){
                        self.compressImg(this.result, function(data){
                            var spicdata = data.split("base64,")[1];
                            var url = "http://up.qiniu.com/putb64/-1/";
                            var xhr = new XMLHttpRequest();
                            xhr.onreadystatechange=function(){
                                if (xhr.readyState == 4 && xhr.status == 200 && xhr.responseText != "") {
                                    var blkRet = JSON.parse(xhr.responseText);
                                    var uicon = imgCDN + blkRet.key;
                                    var cuserinfo = Models.userinfo.get();
                                    ModelUserinfo.execute({id:cuserinfo.id, image: uicon}, {type: 'PUT'}).then(function(data){
                                        if(data && data.non_field_errors){
                                            Toast.show({
                                                Content: data.non_field_errors || '更新用户头像失败，请稍后再试'
                                            })
                                        }else{
                                            Models.userinfo.set("image", uicon);
                                        }
                                    },function(){
                                        Toast.show({
                                            Content: '网络不给力啊，请稍后再试'
                                        })
                                    }).catch(function(e){
                                        console.log(e)
                                    });
                                } else if (xhr.status != 200 && xhr.responseText) {
                                    alert('图片上传失败，请确认您选择的是图片文件！')
                                }
                            }
                            xhr.open("POST", url, true);
                            xhr.setRequestHeader("Content-Type", "application/octet-stream");
                            xhr.setRequestHeader("Authorization", "UpToken " + uptoken);
                            xhr.send(spicdata);
                        })
                    }
                }
            }
        },
        compressImg(date, callback){
            var img = new Image();
            img.onload = function () {
                var that = this;
                //生成比例
                var w = that.width,
                    h = that.height,
                    scale = w / h;
                w = 640 || w;              //480  你想压缩到多大，改这里
                h = w / scale;
                //生成canvas
                var canvas = document.createElement('canvas');
                var ctx = canvas.getContext('2d');
                $(canvas).attr({width : w, height : h});
                ctx.drawImage(that, 0, 0, w, h);
                var base64 = canvas.toDataURL('image/jpeg', 0.7 || 0.7 );   //1最清晰，越低越模糊
                img = canvas = null;
                if(callback){
                    return callback(base64)
                }else{
                    return base64;
                }
            }
            img.src = date;
        },
        goToMyFunIndex(){
            $location.url('/myfunindex');
        },
        shownotification(){
            $location.url('messages/sns/');
        }
});
    return PublishViewComponent;
});