/**
 * Created by sqsun on 2015/9/22.
 */

define(['react', 'koala', 'jsx!ucenterSettingViewComponent', 'Models', 'router'],function(React, koala, UcsetComp, Models, Router){
    /**
     * @{Name} : userCenterSetting
     * @{Desc} : 用户中心 设置页
     */
    koala.pageView.userCenterSetting = koala.pageView.extend({
        tagName: "section"
        ,className: 'happyplay-userCenterSetting'
        ,backbtnFn: function(){
            window.history.go(-1)
        }
        ,onCreate: function(options){  //所有执行一次的事件都写在这里
            
        },
        onShow: function(params){
            var userinfo = Models.userinfo.get();
            if(!userinfo.id){
                window.location.href = '#login';
            }else{
                var ucsetComp = React.createFactory(UcsetComp);
                var ucsetComp = ucsetComp({title:"设置", btnsConf:{backbtn: this.backbtnFn}});
                React.render(ucsetComp, this.el);
            }
        },
        onLoad: function(params){

        },
        onHide: function(params){

        }
    });
    return koala.pageView.userCenterSetting;
})
