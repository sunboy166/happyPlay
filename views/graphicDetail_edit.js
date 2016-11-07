/**
 * Created by sqsun on 2015/9/22.
 */

define(['react', 'koala', 'jsx!piceditViewComponent', 'Models', 'router', '$location'],function(React, koala, PiceditComp, Models, Router, $location){
    /**
     * @{Name} : graphicDetailEdit
     * @{Desc} : 图文详情页编辑页面
     */
    koala.pageView.graphicDetailEdit = koala.pageView.extend({
        tagName: "section"
        ,className: 'happyplay-graphicDetailEdit'
        ,backbtnFn: function (){
            window.history.go(-1);
        }
        ,onCreate: function(options){  //所有执行一次的事件都写在这里

        },
        onShow: function(data){
            var piceditComp = React.createFactory(PiceditComp);
            var piceditComp = piceditComp({title:"编辑照片", btnsConf:{myFunIndexBack: this.backbtnFn}, eventid: data.params.id});
            this.$$ReactView = React.render(piceditComp, this.el);

            this.renderNext();
        },
        onLoad: function(params){

        },
        onHide: function(params){
            Models.showimgbase.set(" ")
        },
        renderNext: function(){
            var self = this,
                ReactView = self.$$ReactView,
                show = $location.search('show') === "true",
                state = {};
            if(show) {
                state = {
                    first: false,
                    secend: true,
                    nextbtn: ReactView.endbtnFn,
                    btxt: '发布',
                    forms: {}
                };
            } else {
                state = {
                    first: true,
                    secend: false,
                    nextbtn: ReactView.nextbtnFn,
                    btxt: null,
                    cmtab: 2,
                    forms: {},
                    reImg: true
                }
            }
            ReactView.setState(state);
        }
    });
    return koala.pageView.graphicDetailEdit;
})
