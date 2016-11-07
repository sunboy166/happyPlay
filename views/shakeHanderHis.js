/**
 * Created by liuyang on 2016/5/01.
 * 摇一摇历史页面
 */

define(['react', 'koala', 'jsx!shakeHanderHisViewComponent', 'RESTF', '$location','Fn', 'router','Models', '$WX','Shake'],function(React, koala, LoginComp, RESTF, $location, Fn, Router, Models, $wx,Shake){
    var userShakeCardListHistoryModel = RESTF.userShakeCardListHistoryModel.getInstance();          //用户取卡记录

    var Toast = new koala.kUI.Toast();                                                  //toast提示
    /**
     * @{Name} : login
     * @{Desc} : 登录注册页
     */
    koala.pageView.shakeHanderHis = koala.pageView.extend({
        tagName: "section"
        ,className: 'bgcgrey'
        ,backbtnFn: function(){
            window.history.go(-1);
        },
        dataModel: {},
        stateModel: {
            type: 'cloud',                     //type: 'cloud' || 'ibeacon'
            text: '',                          //:展示提示文案
            showLayer: false,                  //是否展示显示卡
            resultType: ''
        }
        ,onCreate: function(options){  //所有执行一次的事件都写在这里
            var loginComp = React.createFactory(LoginComp);
            var loginComp = loginComp({
                btnsConf:{backbtn: this.backbtnFn},
                title: "摇到的历史"
            });
            this.$$ReactView = React.render(loginComp, this.el);
        },
        onShow: function(params){
            //渲染页面
            this.renderPage(params);

        },
        onHide: function(params){

        },
        renderPage: function(param){
            var dataModel = this.dataModel = {
                    id: ~~param.params.event,
                    list: []
                },
                stateModel = this.stateModel = {
                    type: 'cloud',                     //type: 'card' || 'shun'
                    text: '',
                    showLayer: false,
                    resultType:''
                },
                ReactView = this.$$ReactView,
                userinfo = Models.userinfo.get() || {};
            userShakeCardListHistoryModel.execute({
                user: userinfo.id || 85,
                page: 1,
                page_size: 15
            }).then(function(d){
                dataModel.list.push.apply(dataModel.list, d.results);
                ReactView.setState(stateModel);
                ReactView.setProps(dataModel);
            },function(d){

            });
            ReactView.setProps(dataModel);
            ReactView.setState(stateModel);
        },
        events: {
            'click .js_view_wx_card': 'openWxCard'
        },
        //打开微信卡券
        openWxCard: function(e){
            var cardid = $(e.currentTarget).data('wx-id');
            $wx.addCard({
                card_id: cardid,
                code: ''
            },function(d){
                console.log(d);
            });
        }
    });

    return koala.pageView.shakeHanderHis;
});