/**
 * Created by sqsun on 2015/9/22.
 */

define(['react', 'koala', 'jsx!topicViewComponent'],function(React, koala, TopicComp){
    /**
     * @{Name} : topic
     * @{Desc} : 话题详情页
     */
    koala.pageView.topic = koala.pageView.extend({
        tagName: "section"
        ,className: 'happyplay-topic'
        ,backbtnFn: function(){
            window.history.go(-1)
        }
        ,onCreate: function(options){  //所有执行一次的事件都写在这里

        },
        onShow: function(params){
            var topicComp = React.createFactory(TopicComp);
            var topicComp = topicComp({title:"话题", btnsConf:{backbtn: this.backbtnFn}});
            React.render(topicComp, this.el);
        },
        onLoad: function(params){

        },
        onHide: function(params){

        }
    });
    return koala.pageView.topic;
})
