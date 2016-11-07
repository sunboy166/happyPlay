/**
 * Created by Myco on 2016/5/13.
 */
/**
 * Created by sqsun on 2015/9/22.
 */

define(['react', 'koala', 'jsx!commentlistComponent', 'Models','RESTF'],function(React, koala, ComentList, Models,RESTF){
    var ModelComment = RESTF.eventcommentModel.getInstance();
    var ModelSComment = RESTF.showcommentModel.getInstance();
    /**
     * @{Name} : comment
     * @{Desc} : 发表评论页
     */
    koala.pageView.commentlist = koala.pageView.extend({
        tagName: "section"
        ,className: 'happyplay-commentlist'
        ,onCreate: function(options){  //所有执行一次的事件都写在这里

        },
        backbtnFn: function(){
            window.history.go(-1);
        },
        onShow: function(params){
            var self = this;
            var eventid = params.params.id;
            var type = params.params.type;
            var _forms = {};
            if(type == 1){
                _forms = {event: eventid, pid: 0};
                //获取用户评论
                ModelComment.setParam(_forms).execute().then(function (data) {
                    if (data && data.non_field_errors) {
                        console.log(data.non_field_errors || '获取用户评论信息失败')
                    } else {
                        Models.eventdetailMoreComment.set(data);
                        var comentList = React.createFactory(ComentList);
                        var comentList = comentList({
                            title: "更多评论",
                            btnsConf: {backbtn: self.backbtnFn},
                            model: Models.eventdetailMoreComment,
                            event: eventid
                        });
                        React.render(comentList, self.el);
                    }
                }, function () {
                    console.log('获取用户评论信息失败')
                }).catch(function (e) {
                    console.log(e)
                });
            }else{
                _forms = {show: eventid, pid: 0};
                //获取用户评论
                ModelSComment.setParam(_forms).execute().then(function (data) {
                    if (data && data.non_field_errors) {
                        console.log(data.non_field_errors || '获取用户评论信息失败')
                    } else {
                        Models.eventdetailMoreComment.set(data);
                        var comentList = React.createFactory(ComentList);
                        var comentList = comentList({
                            title: "更多评论",
                            btnsConf: {backbtn: self.backbtnFn},
                            model: Models.eventdetailMoreComment,
                            event: eventid
                        });
                        React.render(comentList, self.el);
                    }
                }, function () {
                    console.log('获取用户评论信息失败')
                }).catch(function (e) {
                    console.log(e)
                });
            }

        },
        onLoad: function(params){

        },
        onHide: function(params){

        }
    });
    return koala.pageView.commentlist;
})
