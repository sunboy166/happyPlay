/**
 * Created by sqsun on 2015/9/22.
 */

define(['react', 'koala', 'jsx!messagecardinfoViewComponent'],function(React, koala, MessagecardinfoComp){
    /**
     * @{Name} : messages card
     * @{Desc} : 卡券消息页
     */
    koala.pageView.messagecardinfo = koala.pageView.extend({
        tagName: "section"
        ,className: 'happyplay-messagecardinfo'
        ,backbtnFn: function (){
            window.history.go(-1)
        }
        ,onCreate: function(options){  //所有执行一次的事件都写在这里

        },
        onShow: function(params){
            var messagecardinfoComp = React.createFactory(MessagecardinfoComp);
            var messagecardinfoComp = messagecardinfoComp({title:"详情", btnsConf:{backbtn: this.backbtnFn}});
            React.render(messagecardinfoComp, this.el);
        },
        onLoad: function(params){

        },
        onHide: function(params){

        }
    });
    return koala.pageView.messagecardinfo;
})
