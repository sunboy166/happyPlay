/**
 * Created by sqsun on 2015/9/22.
 */

define(['react', 'koala'],function(React, koala){
    /**
     * @{Name} : userCenterCar
     * @{Desc} : 用户中心 车主认证页
     */
    koala.pageView.userCenterCar = koala.pageView.extend({
        tagName: "section"
        ,className: 'happyplay-userCenterCar'
        ,onCreate: function(options){  //所有执行一次的事件都写在这里

        },
        onShow: function(params){

        },
        onLoad: function(params){

        },
        onHide: function(params){

        }
    });
    return koala.pageView.userCenterCar;
})
