/**
 * Created by sqsun on 2015/9/22.
 */

define(['react', 'koala', 'jsx!ucenterViewComponent', 'Models', 'RESTF','$location'],function(React, koala, UcenterComp, Models,RESTF,$location){
    var ModelCert = RESTF.CertificateModel.getInstance();
    var ModelNotificationCount = RESTF.getNotification_count.getInstance();
    /**
     * @{Name} : userCenter
     * @{Desc} : 用户中心页
     */
    koala.pageView.userCenter = koala.pageView.extend({
        tagName: "section"
        ,className: 'happyplay-userCenter'
        ,backbtnFn: function(e){
            if(e === "config") {
                $location.url('/usercenter/setting');
                return '';
            }
            history.back();
        }
        ,onCreate: function(options){  //所有执行一次的事件都写在这里

        },
        onShow: function(data){
            var userinfo = Models.userinfo.get();
            var ucenterComp = React.createFactory(UcenterComp);
            var self = this;
            if(userinfo && userinfo.id){
                var ucComp = ucenterComp({title:"我", btnsConf:{userbackbtn: self.backbtnFn,backbtn:self.backbtnFn}, model: Models.userinfo});
                React.render(ucComp, self.el);
                ModelCert.execute({user: userinfo.id}, {type: 'get'}).then(function(data){
                    if(data && data.non_field_errors){
                        console.log('获取驾照信息失败，请稍后再试')
                    }else{
                        var cnum = data.count;
                        if(cnum > 0){
                            var cresult = data.results[cnum - 1];
                            Models.userinfo.set("carType", cresult.car_type);
                        }
                    }
                },function(){
                    console.log('获取驾照信息失败，请稍后再试')
                }).catch(function(e){
                    console.log(e)
                });
               var timeMarkerObj =  Models.notificationCount_getTime.get();

                var timeMarker = "";
                if(timeMarkerObj && timeMarkerObj.notification_count_date){
                    timeMarker = timeMarkerObj.notification_count_date;
                    console.log(timeMarker);
                }else {
                    var myDate = new Date();
                    myDate.setDate(myDate.getDate()-1);
                    timeMarker = Math.floor(myDate.getTime()/1000);
                }
                ModelNotificationCount.execute({user:userinfo.id,since:timeMarker}).then(function(data){
                    if(data && data.non_field_errors){
                        console.log('获取社交通知信息数量，请稍后再试')
                    }else{
                        Models.notificationCount_getTime.set({notification_count_date:Math.floor(new Date().getTime()/1000)});
                        var cnum = data.count;
                        if(cnum > 0){
                            $("#notificationCountDom").removeClass("none").find(".ucrnum-notice").html( cnum + '条新消息<i className="icon-angle-left"></i>');
                        }
                    }
                },function(){
                    console.log('获取社交通知信息数量，请稍后再试')
                }).catch(function(e){
                    console.log(e)
                });
            }else{
                window.location.href = '#login';
            }
        },
        onLoad: function(params){

        },
        onHide: function(params){

        }
    });
    return koala.pageView.userCenter;
})
