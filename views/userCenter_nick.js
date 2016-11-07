/**
 * Created by sqsun on 2015/9/22.
 */

define(['react', 'koala'],function(React, koala){
    /**
     * @{Name} : userCenterNick
     * @{Desc} : 用户中心 修改昵称页
     */
    koala.pageView.userCenterNick = koala.pageView.extend({
        tagName: "section"
        ,className: 'happyplay-userCenterNick'
        ,onCreate: function(options){  //所有执行一次的事件都写在这里

        },
        onShow: function(params){

        },
        onLoad: function(params){

        },
        onHide: function(params){

        }
    });
    return koala.pageView.userCenterNick;
})
