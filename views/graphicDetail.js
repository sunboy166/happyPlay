/**
 * Created by sqsun on 2015/9/22.
 */

define(['react', 'koala'],function(React, koala){
    /**
     * @{Name} : graphicDetail
     * @{Desc} : 图文详情页
     */
    koala.pageView.graphicDetail = koala.pageView.extend({
        tagName: "section"
        ,className: 'happyplay-graphicDetail'
        ,onCreate: function(options){  //所有执行一次的事件都写在这里

        },
        onShow: function(params){

        },
        onLoad: function(params){

        },
        onHide: function(params){

        }
    });
    return koala.pageView.graphicDetail;
})
