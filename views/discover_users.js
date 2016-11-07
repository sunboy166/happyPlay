/**
 * Created by sqsun on 2015/9/22.
 */

define(['react', 'koala', 'jsx!dusersViewComponent', 'Models', 'RESTF'],function(React, koala, DuserComp, Models, RESTF){

    var ModelRestf = RESTF.userDescoverModel.getInstance();
    /**
     * @{Name} : discoverUsers
     * @{Desc} : 发现用户列表页
     */
    koala.pageView.discoverUsers = koala.pageView.extend({
        tagName: "section"
        ,className: 'happyplay-discoverUsers'
        ,backbtnFn: function(){
            window.history.go(-1);
        }
        ,onCreate: function(options){  //所有执行一次的事件都写在这里
            var duserComp = React.createFactory(DuserComp);
            var duserComp = duserComp({title:"用户", btnsConf:{backbtn: this.backbtnFn}, model: Models.userList});
            React.render(duserComp, this.el);
        },
        onShow: function(params){
            //获取用户列表
            ModelRestf.setParam({}).execute().then(function(data){
                if(data && data.non_field_errors){
                    Toast.show({
                        Content: data.non_field_errors || '获取发现用户列表失败'
                    })
                }else{
                    var tmpObj = {
                            nexturl: data.next,
                            results: data.results
                        }
                        Models.userList.set(tmpObj);
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
    return koala.pageView.discoverUsers;
})
