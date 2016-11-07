/**
 * Created by sqsun on 2015/9/22.
 */
define(['react', 'jsx!mainViewComponent', 'router', 'koala', 'Models', 'RESTF', 'react.backbone'], function(React, MainComp, Router, Koala, Models, RESTF) {
    var ModelRestf = RESTF.followsModel.getInstance();

    var Toast = new Koala.kUI.Toast();
    var FllowedArr = [];
    var Gnurl = null;
    var elTop = 0;
    var elBox = null;
    var PublishViewComponent = React.createBackboneClass({
        getInitialState: function() {
            return {upuser: 0};
        },
        componentDidUpdate: function() {
            if(elBox){
                setTimeout(function(){
                    $('.messageCont').scrollTop(elTop)
                })
            }
        },
        componentWillReceiveProps: function (nextProps) {
            this.setState({upuser: 0});
        },
        render: function() {
            var Uitem = {};
            var userinfo = Models.userinfo.get();
            var UObj = this.getModel().get();
            console.log(UObj);
            var UArr = UObj.results;
            var cuid = userinfo.id;
            var scrollEv = this.getMoreUser;
            Gnurl = UObj.nexturl;
            UArr.map(function(item, k){
                var showuid = 1;
                var uid = item.id;
                if(uid == cuid){
                    showuid = 0
                }
                Uitem[k] = <li className="messageList" data-id={item.id} onClick={this.fuserV.bind(this)}>
                                <div className="messageuicon">
                                    <div className="messageui"><img src={item.image} alt=""/></div>
                                    <div className="navbg messagev"></div>
                                </div>
                                <div className="messagename">
                                    {showuid &&
                                    <div className="messagectrbox">
                                        <div className="bgimg messagecuadd"  data-id={item.id} onClick={this.addFrend.bind(this)}></div>
                                        <div className="bgimg messagecunote"  data-id={item.id} onClick={this.toTalk.bind(this)}></div>
                                    </div>
                                    }
                                    <div className="messagen">{item.nick_name || '未设置昵称'}</div>
                                    <div className="messageulocal">
                                        <span className="messagecar">奥迪TT</span>
                                        <span className="messageuaddress"> · 上海</span>
                                    </div>
                                </div>
                                <div className="messagetxt">
                                    {item.remark}
                                </div>
                            </li>
            }.bind(this));

            if(!Gnurl){
                scrollEv = null;
            }
            return (
                <MainComp btnsConf={this.props.btnsConf} title={this.props.title} navClass="comp-nav-discoverbtn" gclass="messageCont" scrollEvent = {scrollEv}>
                    <div className="messageListBox" ref="messageListBox">
                        <ul className="messageLists discoverusers">
                            {Uitem}
                        </ul>
                    </div>
                </MainComp>
            )
        },
        fuserV (e){
            var Jtarget = $(e.currentTarget);
            var fuid = Jtarget.data('id');
            Router.navigate('fuser/' + fuid);
        },
        addFrend (e){
            e.preventDefault();
            e.stopPropagation();
            var Jobj = $(e.currentTarget);
            var founder = Jobj.data("id");
            var userinfo = Models.userinfo.get();
            var typeAction = 'post';
            var formData = {};

            if(FllowedArr[userinfo.id]){
                typeAction = 'delete'
            }else{
                formData.followed = founder;
                formData.follower = userinfo.id;
            }

            //加关注
            ModelRestf.execute(formData, {type: typeAction}).then(function(data){
                if(data && data.non_field_errors){
                    Toast.show({
                        Content: data.non_field_errors || '关注失败，请稍后再试'
                    })
                }else{
                    if(FllowedArr[userinfo.id]){
                        Jobj.removeClass("fllowed");
                        Toast.show({
                            Content: '取消关注成功'
                        });
                        FllowedArr[userinfo.id] = 0;
                    }else{
                        Jobj.addClass("fllowed");
                        Toast.show({
                            Content: '加关注成功'
                        });
                        FllowedArr[userinfo.id] = 1; 
                    }
                }
            },function(){
                Toast.show({
                    Content: '网络不给力啊，请稍后再试'
                })
            }).catch(function(e){
                console.log(e)
            });
        },
        toTalk (e){
            e.preventDefault();
            e.stopPropagation();
            var Jobj = $(e.currentTarget);
            var id = Jobj.data("id");
            Router.navigate('messages/private/'+ id);
        },
        getMoreUser(e){
            var boxel = e.target;
            var lscrollTop = boxel.scrollTop;
            var lscrollHeight = boxel.scrollHeight;
            var cHeight = boxel.clientHeight;
            var csHeight = lscrollTop + cHeight + 20;
            elBox = boxel;
            elTop = lscrollTop;
            if (csHeight >= lscrollHeight) {
                Router.loading.show();
                Koala.ajax(
                    Gnurl,
                    {},
                    {
                        type: "get",
                        sucBack: function(data){
                            if(data && data.non_field_errors){
                                Toast.show({
                                    Content: data.non_field_errors || '获取发现用户列表失败'
                                })
                            }else{
                                Router.loading.hide();
                                var puserModel = Models.userList.get();
                                var puserList = puserModel.results;
                                puserList = puserList.concat(data.results);
                                var tmpObj = {
                                    nexturl: data.next,
                                    results: puserList
                                }
                                Gnurl = data.next;
                                Models.userList.set(tmpObj);
                            }
                        },
                        errBack: function(err){
                            Toast.show({
                                Content: '网络不给力，请稍后再试'
                            })
                        }
                    }
                );
            }

        }
    });
    return PublishViewComponent;
})