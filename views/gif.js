/**
 * Created by sqsun on 2015/9/22.
 */

define(['react', 'koala', 'jsx!gifViewComponent', 'Models', 'router'],function(React, koala, GifComp, Models, Router){
    /**
     * @{Name} : topic
     * @{Desc} : 话题详情页
     */
    koala.pageView.gif = koala.pageView.extend({
        tagName: "section"
        ,className: 'happyplay-gif'
        ,backbtnFn: function(){
            window.history.go(-1)
        }
        ,onCreate: function(options){  //所有执行一次的事件都写在这里

        },
        onShow: function(data){
            var userinfo = Models.userinfo.get();
            if(!userinfo.id){
                window.location.href = '#login';
            }else{
                var gifComp = React.createFactory(GifComp);
                var gifComp = gifComp({title:"预览", btnsConf:{backbtn: this.backbtnFn}, event: data.params.event});
                React.render(gifComp, this.el);
            }

        },
        onLoad: function(params){

        },
        onHide: function(params){

        }
    });
    return koala.pageView.gif;
})
