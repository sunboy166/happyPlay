/**
 * Created by sqsun on 2015/9/22.
 */

define(['react', 'koala', 'jsx!messagecardViewComponent','RESTF', 'Models'],function(React, koala, MessagecardComp,RESTF,Models){
    var showCardsListModel = RESTF.showCardsListModel.getInstance();

    /**
     * @{Name} : messages card
     * @{Desc} : 卡券消息页
     */
    koala.pageView.messagecard = koala.pageView.extend({
        tagName: "section"
        ,className: 'happyplay-messagecard'
        ,backbtnFn: function(){
            window.history.go(-1)
        }
        ,onCreate: function(options){  //所有执行一次的事件都写在这里
            var messagecardComp = React.createFactory(MessagecardComp);
            var messagecardComp = messagecardComp({title:"卡券通知", btnsConf:{backbtn: this.backbtnFn},model: Models.cardList});
            React.render(messagecardComp, this.el);
        },
        onShow: function(params){
            showCardsListModel.execute({
                page: 1,
                page_size: 15
            }).then(function(d){
                Models.cardList.set('list', d.results);
            },function(d){
                //获取卡卷数据失败

            })
        },
        onLoad: function(params){

        },
        onHide: function(params){

        }
    });
    return koala.pageView.messagecard;
})
