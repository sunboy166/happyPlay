/**
 * Created by sqsun on 2015/9/22.
 */

define(['react', 'koala', 'jsx!ucenterViewComponent', 'Models', 'router', 'RESTF'],function(React, koala, UcenterComp, Models, Router, RESTF){
    var ModelUser = RESTF.getEventUserModel.getInstance();
    var ModelUShow = RESTF.userShowModel.getInstance();

    var Toast = new koala.kUI.Toast();
    /**
     * @{Name} : userCenter
     * @{Desc} : 用户中心页
     */
    koala.pageView.fuserCenter = koala.pageView.extend({
        tagName: "section"
        ,className: 'happyplay-fuserCenter'
        ,backbtnFn: function(){
            window.history.go(-1)
        }
        ,onCreate: function(options){  //所有执行一次的事件都写在这里

        },
        onShow: function(data){
            var self = this;
            if(data.params.id){
                ModelUser.setParam({id: data.params.id}).execute().then(function(data){
                    if(data && data.non_field_errors){
                        console.log(data.non_field_errors || '获取用户信息失败')
                    }else{
                        Models.fuserinfo.set(data);
                        var ucenterComp = React.createFactory(UcenterComp);
                        var ucComp = ucenterComp({
                            title:"详细信息",
                            btnsConf:{
                                backbtn: self.backbtnFn,
                                //userbackbtn: true
                            },
                            model: Models.fuserinfo
                        });
                        React.render(ucComp, self.el);
                    }
                },function(){
                    console.log('获取用户信息失败')
                }).catch(function(e){
                    console.log(e)
                });

                var cuserinfo = Models.userinfo.get();
                var getuid = 0;
                if(data.params.id !== cuserinfo.id){
                    getuid = data.params.id
                }else{
                    getuid = cuserinfo.id
                }

                ModelUShow.setParam({user: getuid}).execute().then(function(data){
                    if(data && data.non_field_errors){
                        Toast.show({
                            Content: data.non_field_errors || '获取用户瞬间失败，请稍后再试'
                        })
                    }else{
                        Models.fuserinfo.set("showucenter", data.results);
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
            }
        },
        onLoad: function(params){

        },
        onHide: function(params){

        }
    });
    return koala.pageView.fuserCenter;
})
