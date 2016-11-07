/**
 * Created by sqsun on 2015/9/22.
 */

define(['react', 'koala', 'jsx!messagePrivateViewComponent', 'Models', 'RESTF'], function(React, koala, messagePrivComp, Models, RESTF){
    /**
     * @{Name} : messagesPrivate
     * @{Desc} : 发布私信页
     */
    var Toast = new koala.kUI.Toast();
    var ModelRestf = RESTF.getMessageModel.getInstance();
    var webAWork = null;
    koala.pageView.messagesPrivate = koala.pageView.extend({
        tagName: "section"
        ,className: 'happyplay-messagesPrivate'
        ,backbtnFn: function(){
            window.history.go(-1)
        }
        ,onCreate: function(params){  //所有执行一次的事件都写在这里
            var msPrivComp = React.createFactory(messagePrivComp);
            var msPrivComp = msPrivComp({title:"私信", btnsConf:{backbtn: this.backbtnFn}, uid: params.uid, model: Models.message});
            React.render(msPrivComp, this.el);
        },
        onShow: function(params){
            var userinfo = Models.userinfo.get();
            var getMessage = function(callback){
                ModelRestf.setParam({sender: userinfo.id, receiver: params.params.uid}).execute().then(function(data){
                    if(data && data.non_field_errors){
                        Toast.show({
                            Content: data.non_field_errors || '获取私信失败，请稍后再试'
                        })
                    }else{
                        Models.message.set(data.results);
                        if(callback){
                            return callback();
                        }
                    }
                },function(){
                    Toast.show({
                        Content: '网络不给力啊，请稍后再试'
                    })
                }).catch(function(e){
                    console.log(e)
                });
            }
            if(userinfo.id){
                getMessage(function(){
                    webAWork = setInterval(function(){
                        getMessage();
                    }, 10000)
                })
            }else{
                Models.message.set([
                {
                    "id": 0,
                    "sender": 0,
                    "receiver": 0,
                    "content": "快给我发私信吧",
                    "send_date": "2016-04-04T09:45:09Z"
                }]);
            }            
        },
        onLoad: function(params){

        },
        onHide: function(params){
            if(webAWork){
                clearInterval(webAWork);
                webAWork = null;
            }
        }
    });
    return koala.pageView.messagesPrivate;
})
