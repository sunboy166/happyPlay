/**
 * Created by sqsun on 2015/9/22.
 */

define(['react', 'koala'],function(React, koala){
    /**
     * @{Name} : graphicDetailEdit
     * @{Desc} : 图文详情页编辑页面
     */
    koala.pageView.graphicDetailAdd = koala.pageView.extend({
        tagName: "section"
        ,className: 'happyplay-graphicDetailAdd'
        ,onCreate: function(options){  //所有执行一次的事件都写在这里

        },
        onShow: function(params){

        },
        onLoad: function(params){

        },
        onHide: function(params){

        }
    });
    return koala.pageView.graphicDetailAdd;
})
