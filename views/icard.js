/**
 * Created by sqsun on 2015/9/22.
 */

define(['react', 'koala', 'jsx!icardViewComponent'],function(React, koala, IcardComp){
    /**
     * @{Name} : icode
     * @{Desc} : 二维码
     */
    koala.pageView.icard = koala.pageView.extend({
        tagName: "section"
        ,className: 'happyplay-icard'
        ,backbtnFn: function(){
            window.history.go(-1);
        }
        ,onCreate: function(options){  //所有执行一次的事件都写在这里
            var icardComp = React.createFactory(IcardComp);
            var icardComp = icardComp({title:"我的卡券", btnsConf:{backbtn: this.backbtnFn}});
            React.render(icardComp, this.el);
        },
        onShow: function(params){

        },
        onLoad: function(params){

        },
        onHide: function(params){

        }
    });
    return koala.pageView.icard;
})
