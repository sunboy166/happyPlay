/**
 * Created by sqsun on 2015/9/22.
 */

define(['react', 'koala', 'jsx!indexViewComponent', 'Models','RESTF', 'router'],function(React, Koala, IndexComp, Models, RESTF, Router){
    var eventListModel = RESTF.eventListModel.getInstance();
    var recommandEventsModel = RESTF.recommandEventsModel.getInstance(),                   //向某个用户推荐的活动查询
        userSubscibedEventModel = RESTF.userSubscibedEventModel.getInstance(),             //某个用户关注的活动查询
        userStartEventModel = RESTF.userStartEventModel.getInstance();                      //某用户发起的活动查询
    var Toast = new Koala.kUI.Toast();

    Koala.pageView.index = Koala.pageView.extend({
        tagName: "section"
        ,className: 'happyplay-index'
        ,eventConfig: {
            swipeBackPage: 0
        }
        ,onCreate: function(options){  //所有执行一次的事件都写在这里
            var indexComp = React.createFactory(IndexComp);
            var indexComp = indexComp({title:"Happy", model:Models.indexItems});
            React.render(indexComp, this.el);
        },
        onShow: function(params){
            var userinfo = Models.userinfo.get() || {};
            var formData = {limit: 10, show_offset: 0, event_offset: 0};
            if(userinfo.id){
                formData.user = userinfo.id
            }
            setTimeout(function () {
                Router.loading.show();
            });
            /*eventListModel.setParam(formData).execute().then(function(data){
                Router.loading.hide();
                if(data && data.non_field_errors){
                    Toast.show({
                        Content: data.non_field_errors || '获取列表失败'
                    });
                }else{
                    Models.indexItems.set(data);
                }
            },function(){
                Toast.show({
                    Content: '网络不给力啊，请稍后再试'
                });
                Router.loading.hide()
            }).catch(function(e){
                console.log(e)
            });*/
            recommandEventsModel.execute({
                user:userinfo.id,
                page: 1,
                page_size: 15
            }).then(function(data){
                Router.loading.hide();
                if(data && data.non_field_errors){
                    Toast.show({
                        Content: data.non_field_errors || '获取列表失败'
                    });
                }else{
                    Models.indexItems.set({
                        data: data.results
                    });
                }
            },function(d){
                Toast.show({
                    Content: '网络不给力啊，请稍后再试'
                });
                Router.loading.hide()
            }).catch(function(e){
                console.log(e);
            });
        },
        onLoad: function(params){

        },
        onHide: function(params){

        }
    });
    return Koala.pageView.index;
})
