/**
 * Created by sqsun on 2015/9/22.
 */

define(['react', 'koala', "jsx!alreadyUserViewComponent","Models"],function(React, koala, MainComp,Models){
    /**
     * @{Name} : alreadyUsers
     * @{Desc} : 已报名用户列表页
     */
    koala.pageView.alreadyUsers = koala.pageView.extend({
        tagName: "section"
        ,className: 'happyplay-alreadyUsers'
        ,onCreate: function(options){  //所有执行一次的事件都写在这里
            var duserComp = React.createFactory(MainComp);
            var duserComp = duserComp({title:"已参与玩家", btnsConf:{backbtn: function(){
                history.go(-1)
            }}, model: Models.userList});
            this.$$ReactView = React.render(duserComp, this.el);
        },
        onShow: function(params){
            this.renderPageList();
        },
        onLoad: function(params){

        },
        onHide: function(params){

        },
        renderPageList: function(){
            var userList = Models.alreadySignStore.get(),
                ReactView = this.$$ReactView;
            ReactView.setProps({
                userList: userList || []
            });
        }
    });
    return koala.pageView.alreadyUsers;
})
