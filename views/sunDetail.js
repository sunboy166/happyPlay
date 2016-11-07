/**
 * Created by sqsun on 2015/9/22.
 */

define(['react', 'jsx!showViewComponent', 'koala', 'Models', 'router', 'RESTF'],function(React, ShowComp, koala, Models, Router, RESTF){
    var ModelShowDetail = RESTF.showDetailModel.getInstance();
    var ModelComment = RESTF.showcommentModel.getInstance();
    var Toast = new koala.kUI.Toast();
    var _preurl ="";
    /**
     * @{Name} : sunDetail
     * @{Desc} : 晒详情页
     */
    koala.pageView.sunDetail = koala.pageView.extend({
        tagName: "section"
        ,className: 'happyplay-sunDetail'
        ,backbtnFn: function(){
            if(Router && Router.previousView && Router.previousView.actionUrl){
              var _commenturl = Router.previousView.actionUrl;
                if(_commenturl.indexOf("comment/")>-1){
                    Router.navigate(_preurl);
                    return false;
                }
            }
            window.history.go(-1);
        }
        ,onCreate: function(options){  //所有执行一次的事件都写在这里
            var topicComp = React.createFactory(ShowComp);
            var topicComp = topicComp({title:"好玩瞬间", btnsConf:{backbtn: this.backbtnFn.bind(this), showcommentbtn: true }, model: Models.showDetail});
            React.render(topicComp, this.el);
        },
        onShow: function(params){
            var UData = {};
            if(Router && Router.previousView && Router.previousView.actionUrl){
               var _nourl = Router.previousView.actionUrl;
                if(_nourl.indexOf("event/detail")>-1){
                    _preurl = _nourl;
                }
            }
            ModelShowDetail.setParam({"id": params.params.id}).execute().then(function(data){
                if(data && data.non_field_errors){
                    Toast.show({
                        Content: data.non_field_errors || '获取晒详情失败，请稍后再试'
                    })
                }else{
                    //获取用户评论
                    ModelComment.setParam({show: params.params.id, pid: 0}).execute().then(function(data){
                        if(data && data.non_field_errors){
                            console.log(data.non_field_errors || '获取用户评论信息失败')
                        }else{
                            UData.commentData = data;
                            Models.showDetail.set(UData);
                        }
                    },function(){
                        console.log('获取用户评论信息失败')
                    }).catch(function(e){
                        console.log(e)
                    });
                    UData.result = data;
                    Models.showDetail.set(UData);
                }
            },function(){
                Toast.show({
                    Content: '网络不给力啊，请稍后再试'
                })
            }).catch(function(e){
                console.log(e)
            });
        },
        onLoad: function(params){

        },
        onHide: function(params){

        }
    });
    return koala.pageView.sunDetail;
})
