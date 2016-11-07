/**
 * Created by sqsun on 2015/9/22.
 */

define(['react', 'koala'],function(React, koala){
    /**
     * @{Name} : discoverTopic
     * @{Desc} : 发现话题详情页
     */
    koala.pageView.discoverTopic = koala.pageView.extend({
        tagName: "section"
        ,className: 'happyplay-discoverTopic'
        ,onCreate: function(options){  //所有执行一次的事件都写在这里

        },
        onShow: function(params){

        },
        onLoad: function(params){

        },
        onHide: function(params){

        }
    });
    return koala.pageView.discoverTopic;
})
