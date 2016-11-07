/**
 * Created by sqsun on 2015/9/22.
 */

define(['react', 'koala'],function(React, koala){
    /**
     * @{Name} : userCenterPwd
     * @{Desc} : 用户中心 修改密码页
     */
    koala.pageView.userCenterPwd = koala.pageView.extend({
        tagName: "section"
        ,className: 'happyplay-userCenterPwd'
        ,onCreate: function(options){  //所有执行一次的事件都写在这里

        },
        onShow: function(params){

        },
        onLoad: function(params){

        },
        onHide: function(params){

        }
    });
    return koala.pageView.userCenterPwd;
})
