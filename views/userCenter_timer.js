/**
 * Created by sqsun on 2015/9/22.
 */

define(['react', 'koala', 'jsx!ucenterTimerViewComponent', 'Models'],function(React, koala, UtimerComp, Models){
    /**
     * @{Name} : userCenterTimer
     * @{Desc} : 用户中心 选择活动日期页
     */
    koala.pageView.userCenterTimer = koala.pageView.extend({
        tagName: "section"
        ,className: 'happyplay-userCenterTimer'
        ,onCreate: function(options){  //所有执行一次的事件都写在这里
            var utimerComp = React.createFactory(UtimerComp);
            var utimerComp = utimerComp({title:"活动日历", btnsConf:{backbtn: this.backbtnFn}, model: Models.eventDateList});
            React.render(utimerComp, this.el);
        },
        backbtnFn: function(){
            window.history.go(-1)
        },
        onShow: function(params){
            var userinfo = Models.userinfo.get();
            if(!userinfo.id){
                window.location.href = '#login';
            }
        },
        onLoad: function(params){

        },
        onHide: function(params){

        }
    });
    return koala.pageView.userCenterTimer;
})
