/**
 * Created by sqsun on 2015/9/22.
 */

define(['react', 'koala', 'jsx!messagesnsViewComponent', 'Models', 'RESTF'],function(React, koala, MessagesnsComp, Models, RESTF){
    var Toast = new koala.kUI.Toast();
    var ModelRestf = RESTF.esMessageListModel.getInstance();
    var ModelgetNotify = RESTF.getNotify.getInstance();
    /**
     * @{Name} : messages
     * @{Desc} : 消息页
     */
    koala.pageView.messagesns = koala.pageView.extend({
        tagName: "section"
        ,className: 'happyplay-messagesns'
        ,backbtnFn: function(){
            window.history.go(-1)
        }
        ,onCreate: function(options){  //所有执行一次的事件都写在这里

        },
        onShow: function(params){
            var self = this;
            var userinfo = Models.userinfo.get();
            if(!userinfo.id){
                window.location.href = '#login';
            }else{
                /*    ModelRestf.setParam({user: userinfo.id}).execute().then(function(data){
                    if(data && data.non_field_errors){
                        Toast.show({
                            Content: data.non_field_errors || '获取列表信息失败，请稍后再试'
                        })
                    }else{
                        Models.esMessagesList.set(data);console.log(data);
                        var messagesnsComp = React.createFactory(MessagesnsComp);
                        var messagesnsComp = messagesnsComp({title:"消息", btnsConf:{backbtn: self.backbtnFn}, model: Models.esMessagesList});
                        React.render(messagesnsComp, self.el);
                    }
                },function(){
                    Toast.show({
                        Content: '网络不给力啊，请稍后再试'
                    })
                }).catch(function(e){
                    console.log(e)
                });*/

                //用户消息列表
                var userParam = {user: userinfo.id};
                ModelgetNotify.setParam(userParam).execute().then(function (data) {
                    if (data && data.non_field_errors) {
                        console.log(data.non_field_errors || '获取社交通知失败')
                    } else {
                        var notifyNum = data.data || [];
                        if(notifyNum.length > 0){
                            Models.userMsglist.set(data);
                            var messagesnsComp = React.createFactory(MessagesnsComp);
                            var messagesnsComp = messagesnsComp({title:"消息", btnsConf:{backbtn: self.backbtnFn}, model: Models.userMsglist});
                            React.render(messagesnsComp, self.el);
                        }
                    }
                }, function () {
                    console.log('获取社交通知失败');
                }).catch(function (e) {
                    console.log(e);
                });


            }
        },
        onLoad: function(params){

        },
        onHide: function(params){

        }
    });
    return koala.pageView.messagesns;
})
