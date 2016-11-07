/**
 * Created by sqsun on 2015/9/22.
 */

define(['react', 'koala', 'jsx!commentViewComponent', 'Models'],function(React, koala, ComentComp, Models){
    /**
     * @{Name} : comment
     * @{Desc} : 发表评论页
     */
    koala.pageView.comment = koala.pageView.extend({
        tagName: "section"
        ,className: 'happyplay-comment'
        ,onCreate: function(options){  //所有执行一次的事件都写在这里

        },
        backbtnFn: function(){
            window.history.go(-1);
        },
        onShow: function(data){
            var uinfo = Models.userinfo.get();
            if(!uinfo.id){
                window.location.href = '#login'
            }else{
                var comentComp = React.createFactory(ComentComp);
                console.log(data)
                var comentComp = comentComp({title:"发表评论", btnsConf:{myFunIndexBack: this.backbtnFn}, id: data.params.id, rid: data.params.rid, from: data.params.from});
                React.render(comentComp, this.el);
            }
        },
        onLoad: function(params){

        },
        onHide: function(params){

        }
    });
    return koala.pageView.comment;
})
