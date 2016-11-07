/**
 * Created by liuyang on 2016/6/20.
 * 我的好玩指数页面
 */

define(['react', 'koala','jsx!myFunIndexViewComponent'],function(React, koala,LoginComp){
    koala.pageView.myFunIndex = koala.pageView.extend({
        tagName: "section"
        ,className: 'happyplay-graphicDetail'
        ,onCreate: function(options){  //所有执行一次的事件都写在这里
            var self = this;
            var loginComp = React.createFactory(LoginComp);
            var loginComp = loginComp({
                btnsConf:{
                    myFunIndexBack: self.backbtnFn
                },
                title: "我的好玩指数",
                slide: ''
            });
            this.$$ReactView = React.render(loginComp, this.el);
        },
        onShow: function(params){
            this.$$ReactView.setProps({
                slide: "http://dimg04.c-ctrip.com/images/200g050000000gnd9A5F9_C_550_412.jpg|http://dimg04.c-ctrip.com/images/200i040000000bzkdD1BC_C_550_412.jpg"
            });
        },
        onLoad: function(params){

        },
        onHide: function(params){

        },
        backbtnFn: function(){
            history.back();
        }
    });
    return koala.pageView.myFunIndex;
})
