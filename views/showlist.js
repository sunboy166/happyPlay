/**
 * Created by sqsun on 2015/9/22.
 */

define(['react', 'jsx!showlistViewComponent', 'koala', 'Models', 'RESTF', '$location'],function(React, ShowlistComp, koala, Models, RESTF, $location){
    var ModelRestf = RESTF.getEventShowListModel.getInstance();
    var Toast = new koala.kUI.Toast();
    /**
     * @{Name} : sunDetailAdd
     * @{Desc} : 晒的发布页
     */
    koala.pageView.showlist = koala.pageView.extend({
        tagName: "section"
        ,className: 'happyplay-showlist'
        ,backbtnFn: function(){
            window.history.go(-1)
        }
        ,onCreate: function(options){  //所有执行一次的事件都写在这里

        },
        dataModel: {
            title: "",
            btnsConf:{}
        },
        stateModel: {
            menutItem: [
                {
                    key: 0,
                    value: "全部好玩瞬间"
                },
                {
                    key: 1,
                    value: "发起者的瞬间"
                },
                {
                    key:2,
                    value: "参与者的瞬间"
                }
            ],
            selectedItemIndex: 0,
            showSelectTab: false
        },
        onShow: function(data){
            var eventid = data.params.id,
                userinfo = Models.userinfo.get() || {},
                _param = {};
            Models.showListDetail.set({});
            if(userinfo.id){
                _param = {
                    event:eventid,
                    user: userinfo.id || ""
                };
            }else{
                _param = {
                    event:eventid
                };
            }

            var self = this,
                state = this.stateModel;
            state.selectedItemIndex = ~~$location.search('sitm');
            //获取活动地址
            ModelRestf.setParam(_param).execute().then(function(data){
                if(data && data.non_field_errors){
                    Toast.show({
                        Content: data.non_field_errors || '获取好玩瞬间列表失败'
                    })
                }else{
                    Models.showListDetail.set(data);
                    var topicComp = React.createFactory(ShowlistComp);
                    var topicComp = topicComp(_.extend(self.dataModel, {
                        title: self.buildTitle(),
                        btnsConf: {myFunIndexBack: self.backbtnFn},
                        model: Models.showListDetail,
                        eventid:eventid
                    }));
                    self.$$ReactView = React.render(topicComp, self.el);
                    self.$$ReactView.setState(state);
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

        },
        events: {
            'click .js_select_show_type': "showSelectType",             //选择好玩舜间
            'click .js_select_show_type_item > li': "selectShowSelectItem", //选择好玩舜间的每一条数据
        },
        showSelectType: function(e){
            var ReactView = this.$$ReactView,
                state = this.stateModel;
            state.showSelectTab = !state.showSelectTab;
            ReactView.setState(state);
        },
        //选择好玩舜间中的对应条
        selectShowSelectItem: function(e){
            var ReactView = this.$$ReactView,
                lastShowSelectTab = ReactView.state.showSelectTab;
                $currentTarget = $(e.currentTarget),
                state = this.stateModel,
                dataModel = this.dataModel;
            state.selectedItemIndex = ~~$currentTarget.data('index');
            state.showSelectTab = !state.showSelectTab;
            dataModel.title = this.buildTitle();
            ReactView.setState(state);
            ReactView.setProps(dataModel);
        },
        buildTitle: function(){
            var state = this.stateModel;
            var title = state.menutItem[state.selectedItemIndex].value;
            return "<span class='js_select_show_type fz16'>" + title + "<i class='icon-angle-down'></i></span>";
        }
    });
    return koala.pageView.showlist;
})
