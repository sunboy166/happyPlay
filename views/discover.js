/**
 * Created by sqsun on 2015/9/22.
 */

define(['react', 'koala', 'jsx!discoverViewComponent', 'RESTF','listBaseView', 'underscore', 'geo'],function(React, koala, DiscoverComp, RESTF, listBaseView, _){

    var eventListModel = RESTF.specialtopicModel.getInstance();          //活动列表数据
    var geoData = null;

    /**
     * @{Name} : discover
     * @{Desc} : 发现页
     */
    koala.pageView.discover = listBaseView.extend({
        tagName: "section"
        ,className: 'happyplay-discover'
        ,onCreate: function(options){  //所有执行一次的事件都写在这里
            var self = this;
            var discoverComp = React.createFactory(DiscoverComp);
            var discoverComp = discoverComp({title:"发现"});
            self.$$ReactView = React.render(discoverComp, this.el);
            self.$el.append('<iframe id="geoPage" width=0 height=0 frameborder=0  style="display:none;" scrolling="no" src="http://apis.map.qq.com/tools/geolocation?key=OB4BZ-D4W3U-B7VVO-4PJWW-6TKDJ-WPB77&referer=myapp"></iframe>');
            window.addEventListener('message', function(event) {
                // 接收位置信息
                geoData = event.data;
                self.$$ReactView.setProps({geoData: geoData})
            }, false);
        },
        onShow: function(params){
            this.renderPage();
        },
        onLoad: function(params){

        },
        onHide: function(params){

        },
        renderPage: function(){
            var self = this,
                ReactView = this.$$ReactView;
            eventListModel
            .execute({})
            .then(function(d){
                var dataModel = d.results;
                var self = this;
                var Arr = [];
                dataModel.map(function (v, k) {
                    //console.log(v.event)
                    var arrEach = new Array(9);
                    var show = v.show;
                    var topic = v.topic;
                    var type = v.type;
                    var vresult = v.event;
                    var rjson = {};
                    if(type == 2) {
                        vresult = show;
                        var images = arrEach.map(function(value, i){
                            return vresult['image' + (i + 1)];
                        });
                        images = images.filter(function(v){
                            return !!v;
                        });
                        rjson = {
                            id: vresult.id,
                            title: vresult.title,
                            address: vresult.address,
                            comment_count: vresult.comment_count,
                            content: vresult.content,
                            cover_image: (vresult.cover_image || "").split('||'),
                            images: images,
                            tags: vresult.tags,
                            founder: vresult.author,
                            transpond_count: vresult.transpond_count,
                            praise_count: vresult.praise_count,
                            updated_time: new Date(vresult.updated_time).getTime(),
                            created_time: new Date(vresult.created_time).getTime(),
                            type: type
                        };
                    }else{
                        var images = arrEach.map(function(value, i){
                            return vresult['image' + (i + 1)];
                        });
                        images = images.filter(function(v){
                            return !!v;
                        });
                        rjson = {
                            id: vresult.id,
                            title: vresult.title,
                            address: vresult.address,
                            comment_count: vresult.comment_count,
                            content: vresult.content,
                            cover_image: (vresult.cover_image || "").split('||'),
                            event_begin_time: new Date(vresult.event_begin_time).getTime(),
                            event_end_time: new Date(vresult.event_end_time).getTime(),
                            created_time: new Date(vresult.event_begin_time).getTime(),
                            founder: vresult.founder,
                            images: images,
                            participant_limit: vresult.participant_limit,
                            participant_number: vresult.participant_count,
                            praise_count: vresult.praise_count,
                            signup_begin_time: new Date(vresult.signup_begin_time).getTime(),
                            signup_end_time: new Date(vresult.signup_end_time).getTime(),
                            tags: vresult.tags,
                            ticket_amount: vresult.ticket_amount,
                            transpond_count: vresult.transpond_count,
                            updated_time: new Date(vresult.updated_time).getTime(),
                            type: type
                        };
                    }
                    Arr.push(rjson)
                });
                ReactView.setProps({list: Arr, geoData: geoData});
            },function(d){
            });
        }
    });
    return koala.pageView.discover;
})
