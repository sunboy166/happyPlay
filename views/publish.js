/**
 * Created by sqsun on 2015/9/22.
 */

define(['react', 'koala', 'jsx!publishViewComponent', 'Models', 'router'],function(React, koala, PublishComp, Models, Router){
    /**
     * @{Name} : publish
     * @{Desc} : 发布页
     */
    koala.pageView.publish = koala.pageView.extend({
        tagName: "section"
        ,className: 'happyplay-publish'
        ,backbtnFn: function (){
            window.history.go(-1);
        }
        ,onCreate: function(options){  //所有执行一次的事件都写在这里

        },
        onShow: function(params){
            var userinfo = Models.userinfo.get();
            if(userinfo.id){
                var publishComp = React.createFactory(PublishComp);
                var publishComp = publishComp({title:"发布活动", btnsConf:{backbtn: this.backbtnFn}});
                React.render(publishComp, this.el);
            }else{
                window.location.href = '#login';
            }
        },
        onLoad: function(params){

        },
        onHide: function(params){

        }
    });
    return koala.pageView.publish;
})
