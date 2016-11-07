/**
 * Created by sqsun on 2015/9/22.
 */

define(['react', 'koala', 'jsx!messageViewComponent', 'Models', 'RESTF'],function(React, koala, MessageComp, Models, RESTF){
    var ModelMessage = RESTF.getMessageModel.getInstance();
    var ModelesMessage = RESTF.esMessageModel.getInstance();
    var Toast = new koala.kUI.Toast();
    /**
     * @{Name} : messages
     * @{Desc} : 消息页
     */
    koala.pageView.messages = koala.pageView.extend({
        tagName: "section"
        ,className: 'happyplay-messages'
        ,backbtnFn: function(){
            window.history.go(-1)
        }
        ,onCreate: function(options){  //所有执行一次的事件都写在这里
            var messageComp = React.createFactory(MessageComp);
            var messageComp = messageComp({title:"消息", btnsConf:{backbtn: this.backbtnFn}, model: Models.userMessages});
            React.render(messageComp, this.el);
        },
        onShow: function(params){
            var userinfo = Models.userinfo.get();
            if(!userinfo.id){
                window.location.href = '#login';
            }else{
                //获取用户私信
                ModelMessage.setParam({receiver: userinfo.id}).execute().then(function(data){
                    if(data && data.non_field_errors){
                        Toast.show({
                            Content: data.non_field_errors || '获取用户私信失败！！'
                        });
                    }else{
                        if(data.count > 0){
                            Models.userMessages.set(data);
                        }
                    }
                },function(){
                    Toast.show({
                        Content: '网络不给力啊，请稍后再试'
                    })
                }).catch(function(e){
                    console.log(e)
                });

                //获取活动提示
                ModelesMessage.setParam({user: userinfo.id}).execute().then(function(data){
                    if(data && data.non_field_errors){
                        console.log(data.non_field_errors || '获取用户私信失败！！');
                    }else{
                        var num = 0;
                        for(var key in data){
                            num += data[key]
                        }
                        if(num > 0){
                            Models.userMessages.set("esMessageNum", num);
                        }
                    }
                },function(){
                    console.log('网络不给力啊，请稍后再试');
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
    return koala.pageView.messages;
})