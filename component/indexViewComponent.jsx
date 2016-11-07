/**
 * Created by sqsun on 2015/9/22.
 */
define(['react', 'jsx!mainViewComponent', 'router', 'Models', 'koala','RESTF','react.backbone'], function(React, MainComp, Router, Models, Koala,RESTF) {
    var setEventCollection = RESTF.setEventCollection.getInstance(),
        recommandEventsModel = RESTF.recommandEventsModel.getInstance(),            //给用户推荐的活动列表
        userSubscibedEventModel = RESTF.userSubscibedEventModel.getInstance(),      //用户订阅的活动查询
        userStartEventModel = RESTF.userStartEventModel.getInstance();               //用户发起的活动查询
    var ModelFllow = RESTF.followsModel.getInstance();
    var eventListModel = RESTF.eventListModel.getInstance();
    var eventpraise = RESTF.setEventpraise.getInstance();
    var showpraise = RESTF.setShowpraise.getInstance();
    var deleteEventpraise = RESTF.deleteEventpraise.getInstance();
    var deleteShowpraise = RESTF.deleteShowpraise.getInstance();
    var deletefollowsModel =  RESTF.deletefollowsModel.getInstance();
    var Toast = new Koala.kUI.Toast();
    var Gnurl = false;
    var ESJson = {show_offset: 0, event_offset: 0, limit: 10};
    var elTop = 0;
    var elBox = null;
    var getMX = true;

    var IndexViewComponent = React.createBackboneClass({
        getInitialState: function() {
            return {
                upstate: 0,
                tabType: 1           //1、推荐活动；2、订阅活动；3、我发起的活动
            };
        },
        componentDidUpdate: function() {
            if(elBox){
                setTimeout(function(){
                    $('.comp-content').scrollTop(elTop)
                })
            }else{
                setTimeout(function(){
                    $('.comp-content').scrollTop(0)
                })
            }
        },
        componentWillReceiveProps: function (nextProps) {
            getMX = true;
            this.setState({upstate: 0});
        },
        render: function() {
            var eventsData = this.getModel().get();
            var ESLists = eventsData.data;
            console.log(eventsData)
            var userinfo = Models.userinfo.get();
            var itemsList = {};
            var self = this;
            var scrollEv = this.getMoreEvent;
            var showShare = false;
            ESJson.show_offset = eventsData.show_offset;
            ESJson.event_offset = eventsData.event_offset;
            ESLists.map(function(item) {
                var eventItem = item.event;
                var showTags = false;
                var Tagstmp = {};
                //公共字段
                var Tags = item.tags;
                var cimgs = item.cover_image || [];
                var praises = item.praises || [];
                var collections = item.collections || [];
                var user = item.event.author || item.event.founder;
                var heatCount = item.praise_count + item.comment_count;//热度值
                var showEUser = './testimg/icon.jpg'; //晒活动用户头像
                var showEUsername = ''; //晒活动用户名
                var showEimg = './testimg/topicthurm.png'; //晒活动封面图
                var showET = ''; //晒活动时间
                var showEUnum = 0; //参于人数
                //查询当前用户点赞状态
                var praisesEd = false;
                var pkid = 0;
                praises.map(function(item, k){
                    var praUser = item.user;
                    if(praUser.id == userinfo.id){
                        pkid = item.id;
                        praisesEd = true;
                        return
                    }
                });

                //计算发帖和当前的时间差
                var edate = item.event_begin_time || item.updated_time;
                var timeLength = new Date().getTime() - new Date(item.created_time).getTime();
                edate = new Date(edate);
                var nowDateTime = edate.getFullYear();
                //判断当前活动创建时间是否小于24小时
                if(timeLength){
                    if(Math.floor(timeLength/1000/60/60/24) == 0){
                        var _hous = Math.floor(timeLength/1000/60/60);
                        if(_hous == 0){
                            //不足1小时
                            var _minute = Math.floor(timeLength/1000/60);
                            if(_minute == 0){
                                var _second = Math.floor(timeLength/1000);
                                if(_second == 0){
                                    _second = 1;
                                }
                                nowDateTime = _second + '秒前';
                            }else{
                                nowDateTime = _minute + '分钟前';
                            }
                        }else{
                            nowDateTime = _hous + '小时前';
                        }
                    }else{
                        nowDateTime = nowDateTime + ((edate.getMonth() + 1) < 10 ? "-0" + (edate.getMonth() + 1) : "-" + (edate.getMonth() + 1));
                        nowDateTime = nowDateTime + (edate.getDate() < 10 ? "-0" + edate.getDate() : "-" + edate.getDate());
                    }
                }
                var followtext = "";
                if(!eventItem){
                    if(user.follow_id){
                        followtext = "已关注";
                    }else {
                        if(userinfo && userinfo.id == user.id){
                            followtext = "";
                        }else {
                            followtext = "关注";
                        }
                    }
                }
                var gheader = <div className="topic-head">
                    <div className="thicon" data-id={user.id} onClick={self.toFuserCenter.bind(self)}>
                        <img src={user.image || './testimg/icon.jpg'} alt=""/>
                    </div>
                    <div className="thtitle">{user.full_name || '用户名'}</div>
                    <div className="thtime">{nowDateTime}</div>
                    <div className="followtext" data-followerid={user.follow_id} data-usereid={user.id}
                         onClick={self.followevent.bind(self)}>{followtext}</div>
                </div>

                //区分活动和晒
                if(eventItem){ //show列表
                    var eventImgsItem = {};
                    var showEventImg = false;
                    var seventAuth = eventItem.founder;
                    var seventAddress = eventItem.address;
                    var datetime = new Date(eventItem.event_begin_time);
                    var eeDate = new Date(eventItem.event_end_time);
                    showET = self.GetRTime(datetime, eeDate);
                    if(seventAuth.image){
                        showEUser = seventAuth.image
                    }
                    showEUsername = seventAuth.full_name;
                    showEUnum = eventItem.participants.length;
                    if(cimgs.length > 0){
                        cimgs = cimgs.split('||');
                        for(var i = 0 ;i<cimgs.length;i++)
                        {
                            if(cimgs[i] == "" || typeof(cimgs[i]) == "undefined")
                            {
                                cimgs.splice(i,1);
                                i= i-1;
                            }

                        }
                        if(cimgs.length > 1){
                            showEventImg = true;
                        }
                        cimgs.map(function(itemimg, index){
                            if(itemimg){
                                eventImgsItem['eimg-' + index] = <li className="topicthurm">
                                    <img src={cimgs[index]} data-id={item.id} onClick={self.changeImg.bind(self)}/>
                                </li>
                            }
                        });
                    }else{
                        cimgs[0] = './testimg/pic.png'
                    }
                    itemsList['item-' + item.id + eventItem] = <li className="index-item topicbox" data-id={item.id} onClick= {self.detailShow.bind(self)}>
                        {gheader}
                        <div className="topic-img">
                            <img src={cimgs[0] + "?imageMogr2/format/jpg"} width="100%" alt="" ref={"bigimg_" + item.id}/>
                        </div>
                        {showEventImg &&
                        <div className="topicthurmbox">
                            <ul className="topicthurms">
                                {eventImgsItem}
                            </ul>
                        </div>
                        }
                        <div className="topiceventbox">
                            <div className="truncationtext">{item.title}</div>
                            {showTags &&
                            <div className="teventags overhidden">
                                {Tagstmp}
                            </div>
                            }
                            <div className="topicuserbox" data-id={seventAuth.id} onClick={self.toFuserCenter.bind(self)}>
                                <div className="topicusericon">
                                    <img src={showEUser} alt=""/>
                                </div>
                                <div className="topicusername">{showEUsername}</div>
                            </div>
                            <div className="topiceventinfo" data-id={eventItem.id} onClick= {self.eventShow.bind(self)}>
                                <div className="teventimg">
                                    <img src={showEimg} />
                                </div>
                                <div className="teventname">{eventItem.title}</div>
                                <div className="teventaddress">{seventAddress.name || '中国'}</div>
                                <div className="teventstbox">
                                    <div className="teventstat">{showET}</div>
                                    {showEUnum > 0 &&
                                    <div className="teventunum">{showEUnum + '人参于'}</div>
                                    }
                                </div>
                            </div>
                            <div className="teventnbox">
                                <div className="teventnotice">
                                    <div className="eventmr">
                                        {item.comment_count > 0 &&
                                        <div className="commentcountdiv">
                                            <span className="bgimg commentcounticon"></span>
                                            <span className="teventnqnum">{item.comment_count}</span>
                                        </div>
                                        }
                                        {!praisesEd &&
                                        <div className="commentcountdiv">
                                            <span className="bgimg teventntlike" data-id={item.id} data-type ="1" data-pk={pkid}  onClick={self.liked.bind(self)} data-liked="0"></span>
                                            <span className="teventnqnum" ref={"likedBoxref_" + item.id + "1"}>
                                                {item.praise_count > 0 && item.praise_count}
                                            </span>
                                        </div>
                                        }
                                        {praisesEd &&
                                        <div className="commentcountdiv">
                                            <span className="bgimg teventntlike teventntliked" data-id={item.id} data-type ="1" data-pk={pkid} onClick={self.liked.bind(self)} data-liked="1"></span>
                                            <span className="teventnqnum likenum" ref={"likedBoxref_" + item.id + "1"}>
                                                {item.praise_count > 0 && item.praise_count}
                                            </span>
                                        </div>
                                        }
                                    </div>
                                </div>
                            </div>
                        </div>
                    </li>;
                }else{ //活动列表
                    var datetime = new Date(item.event_begin_time);
                    var eeDate = new Date(item.event_end_time);
                    var evDT = self.getYMD(datetime) + ' - ' + self.getYMD(eeDate, 'MMDD');
                    var sinDT = self.GetRTime(datetime, eeDate);
                    var addressJson = item.address || {};
                    var address = addressJson.name || '中国上海';
                    if(cimgs.length > 0){
                        cimgs = cimgs.split('||');
                    }else{
                        cimgs[0] = './testimg/pic.png'
                    }

                    //tags
                    Tags.map(function(item, index){
                        showTags = true;
                        var tagtxt = '#' + item.name;
                        var tagcss = 'teventag tthot';
                        if(index > 2){
                            tagcss = 'teventag'
                        }
                        Tagstmp[index] = <span className={tagcss}>{tagtxt}</span>
                    });

                    //查询当前用户收藏状态
                    var collectionsEd = false;
                    collections.map(function(item, k){
                        var praUser = item.user;
                        if(praUser.id == userinfo.id){
                            collectionsEd = true;
                            return
                        }
                    });

                    itemsList['item-' + item.id] =
                        <li className="index-item topicbox" data-id={item.id} onClick= {self.eventShow.bind(self)}>
                            {gheader}
                            <div className="topic-img">
                                <img src={cimgs[0] + "?imageMogr2/gravity/Center/crop/600x233"} width="100%" alt="" ref={"bigimg_" + item.id}/>
                                {!collectionsEd &&
                                <div className="favicon" data-fav="0" data-id={item.id}
                                     onClick={self.favEvent.bind(self)}></div>
                                }
                                {collectionsEd &&
                                <div className="favicon faviconed" data-fav="1" data-id={item.id}
                                     onClick={self.favEvent.bind(self)}></div>
                                }
                                <div className="detail-pric">
                                <span
                                    className={"sp-lit-price"}><sup>¥</sup>{item.ticket_amount == 0 ? '免费': item.ticket_amount}<i
                                    className="icon-lock-1"></i></span>
                                </div>
                            </div>
                            <div className="topiceventbox">
                                <div className="truncationtext">{item.title}</div>
                                <div className="detail-item indexdetail">
                                    <div className="detial-ibox">{evDT}</div>
                                    <div className="detail-itip">{sinDT}</div>
                                </div>
                                <div className="detail-iadress indexdetail-iadress">{address}</div>
                                {showTags &&
                                <div className="teventags overhidden">
                                    {Tagstmp}
                                </div>
                                }
                                <div className="teventnbox">
                                    {heatCount > 0 &&
                                    <div className="teventnhot">
                                        {heatCount + '条热度'}
                                    </div>
                                    }
                                    <div className="teventnotice">
                                        {showShare &&
                                        <div className="teventntnum">
                                            <span className="bgimg shareqicon"></span>
                                            <span className="teventnqnum">{item.transpond_count}</span>
                                        </div>
                                        }
                                        <div className="eventmr">
                                            {item.comment_count > 0 &&
                                            <div className="commentcountdiv">
                                                <span className="bgimg commentcounticon"></span>
                                                <span className="teventnqnum">{item.comment_count}</span>
                                            </div>
                                            }
                                            {!praisesEd &&
                                            <div className="commentcountdiv">
                                                <span className="bgimg teventntlike" data-id={item.id} data-type ="0"  data-pk={pkid} onClick={self.liked.bind(self)} data-liked="0"></span>
                                            <span className="teventnqnum" ref={"likedBoxref_" + item.id + "0"}>
                                                {item.praise_count > 0 && item.praise_count}
                                            </span>
                                            </div>
                                            }
                                            {praisesEd &&
                                            <div className="commentcountdiv">
                                                <span className="bgimg teventntlike teventntliked" data-id={item.id} data-type ="0"  data-pk={pkid} onClick={self.liked.bind(self)} data-liked="1"></span>
                                            <span className="teventnqnum likenum" ref={"likedBoxref_" + item.id + "0"}>
                                                {item.praise_count > 0 && item.praise_count}
                                            </span>
                                            </div>
                                            }
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </li>;
                }
            });

            if(Gnurl){
                scrollEv = null;
            }
            return (
                <MainComp btnsConf={this.props.btnsConf} title={this.props.title} navClass="comp-nav-indexbtn" scrollEvent = {scrollEv}>
                    <ul className="tabs" style={{
                        "line-height": "1.5em",
                        "text-align": "center",
                        "margin-top": "5px"
                    }} onClick={this.changeType}>
                        <li data-type="1">推荐活动</li>
                        <li data-type="2">订阅活动</li>
                        <li data-type="3">我发起的活动</li>
                    </ul>
                    <ul className="comp-indexitem">
                        {itemsList}
                    </ul>
                </MainComp>
            );
        },
        changeImg(e){
            e.preventDefault();
            e.stopPropagation();
            var Jtarget = $(e.currentTarget);
            var Timgurl = Jtarget.attr('src');
            var id = Jtarget.data('id');
            var bigimgref = "bigimg_" + id;
            var Jbigimg = this.refs[bigimgref];
            Jbigimg.setAttribute("src", Timgurl);
        },
        detailShow: function(e){
            e.preventDefault();
            e.stopPropagation();
            var listDom = e.currentTarget;
            var listId = $(listDom).data('id');
            if(listId !== undefined){
                Router.navigate("sundetail/" + listId);
            }
        },
        eventShow: function(e){
            e.preventDefault();
            e.stopPropagation();
            var listDom = e.currentTarget;
            var listId = $(listDom).data('id');
            if(listId !== undefined){
                Router.navigate("event/detail/" + listId);
            }
        },
        toFuserCenter:function(e){
            e.preventDefault();
            e.stopPropagation();
            var listDom = e.currentTarget;
            var uId = $(listDom).data('id');
            if(uId !== undefined){
                Router.navigate("fuser/" + uId);
            }
        },
        getMoreEvent(e){
            var boxel = e.target;
            var lscrollTop = boxel.scrollTop;
            var lscrollHeight = boxel.scrollHeight;
            var cHeight = boxel.clientHeight;
            var csHeight = lscrollTop + cHeight + 20;
            elBox = boxel;
            elTop = lscrollTop;
            if (csHeight >= lscrollHeight) {
                if(getMX){
                    Router.loading.show();
                    getMX = false;
                    var userinfo = Models.userinfo.get();
                    if(userinfo.id){
                        ESJson.user = userinfo.id
                    }
                    eventListModel.setParam(ESJson).execute().then(function(data){
                        Router.loading.hide();
                        getMX = true;
                        if(data && data.non_field_errors){
                            Toast.show({
                                Content: data.non_field_errors || '获取活动列表失败'
                            })
                        }else{
                            var peventModel = Models.indexItems.get();
                            var peventList = peventModel.data;
                            peventList = peventList.concat(data.data);
                            var tmpObj = {
                                show_offset: data.show_offset,
                                event_offset: data.event_offset,
                                data: peventList
                            };
                            Gnurl = data.data.length < 10;
                            Models.indexItems.set(tmpObj);
                        }
                    },function(){
                        getMX = true;
                        Router.loading.hide();
                        Toast.show({
                            Content: '网络不给力啊，请稍后再试'
                        })
                    }).catch(function(e){
                        console.log(e)
                    });
                }
            }
        },
        favEvent(e){
            e.preventDefault();
            e.stopPropagation();
            var userinfo = Models.userinfo.get();
            if(!userinfo.id){
                Toast.show({
                    Content: '您暂未登录，请登录后再来收藏',
                    callBack: function(){
                        Router.navigate("login");
                    }
                })
                return
            }
            var Jtarget = $(e.currentTarget);
            var faved = Jtarget.data("fav");
            var eventid= Jtarget.data("id");
            if(faved == '1'){
                setEventCollection.setParam({event: eventid, user: userinfo.id}, {type: "DELETE"}).execute().then(function(data){
                    Router.loading.hide();
                    if(data && data.non_field_errors){
                        Toast.show({
                            Content: data.non_field_errors || '删除收藏失败'
                        })
                    }else{
                        //删除收藏成功
                        Jtarget.removeClass('faviconed');
                        Jtarget.data("fav", "0");
                    }
                },function(){
                    Toast.show({
                        Content: '网络不给力啊，请稍后再试'
                    })
                }).catch(function(e){
                    console.log(e)
                });
            }else{
                setEventCollection.setParam({event: eventid, user: userinfo.id}).execute().then(function(data){
                    Router.loading.hide();
                    if(data && data.non_field_errors){
                        Toast.show({
                            Content: data.non_field_errors || '收藏活动失败'
                        })
                    }else{
                        //收藏成功
                        Jtarget.addClass('faviconed');
                        Jtarget.data("fav", "1");
                    }
                },function(){
                    Toast.show({
                        Content: '网络不给力啊，请稍后再试'
                    })
                }).catch(function(e){
                    console.log(e)
                });

            }
        },
        liked(e){
            e.preventDefault();
            e.stopPropagation();
            var userinfo = Models.userinfo.get();
            if(!userinfo.id){
                Toast.show({
                    Content: '您暂未登录，请登录后再来赞',
                    callBack: function(){
                        Router.navigate("login");
                    }
                })
                return
            }

            var Jtarget = $(e.currentTarget);
            var id = Jtarget.data("id");
            var type = Jtarget.data("type");
            var liked = Jtarget.data("liked");
            var likedBox = $(this.refs['likedBoxref_'+ id + type]);
            var likedNum = likedBox.text();
            var _fundObj = null;
            var _funParam = null;
            if(liked == 0){
                if(type && type =="1"){//晒得点赞
                    _fundObj = showpraise;
                    _funParam = {show: id, user: userinfo.id};
                }else {
                    _fundObj = eventpraise;
                    _funParam = {event: id, user: userinfo.id};
                }
                _fundObj.setParam(_funParam).execute().then(function(data){
                    //Router.loading.hide();
                    if(data && data.non_field_errors){
                        Toast.show({
                            Content: data.non_field_errors || '赞操作失败'
                        })
                    }else{
                        if(likedNum){
                            likedNum = parseInt(likedNum) + 1;
                        }else{
                            likedNum = 1;
                        }
                        likedBox.text(likedNum).addClass('likenum');
                        Jtarget.addClass('teventntliked');
                        Jtarget.data('liked', "1");
                        Jtarget.attr("data-pk",data.id);
                    }
                },function(){
                    Toast.show({
                        Content: '网络不给力啊，请稍后再试'
                    })
                }).catch(function(e){
                    console.log(e)
                });
            }else{
                var pkid = Jtarget.attr("data-pk")|| Jtarget.data("pk");
                if(pkid){
                    _funParam = {id:pkid};
                }else{
                    Toast.show({
                        Content: '取消赞出错！'
                    })
                    return;
                }
                if(type && type == "1"){
                    _fundObj = deleteShowpraise;
                }else{
                    _fundObj = deleteEventpraise;
                }
                _fundObj.setParam(_funParam).execute().then(function(data){
                    //Router.loading.hide();
                    if(data && data.non_field_errors){
                        Toast.show({
                            Content: data.non_field_errors || '取消赞操作失败'
                        })
                    }else{
                        if(likedNum && likedNum != "1"){
                            likedNum = parseInt(likedNum) - 1;
                        }else{
                            likedNum = "";
                        }
                        likedBox.text(likedNum).removeClass('likenum');
                        Jtarget.removeClass('teventntliked').addClass('teventntlike');
                        Jtarget.data('liked', "0");
                    }
                },function(){
                    Toast.show({
                        Content: '网络不给力啊，请稍后再试'
                    })
                }).catch(function(e){
                    console.log(e)
                });
            }
        },
        getYMD(data, fmt){
            var eventEY = data.getFullYear();
            var eventEM = (data.getMonth() + 1) < 10 ? "0" + (data.getMonth() + 1) : (data.getMonth() + 1);
            var eventED = data.getDate() < 10 ? "0" + data.getDate() : data.getDate();

            if(fmt == 'MMDD'){
                return eventEM + '月' + eventED + '日';
            }else{
                return eventEY + '年' + eventEM + '月' + eventED + '日';
            }
        },
        GetRTime(StartTime, EndTime){
            var NowTime = new Date();
            var t = StartTime.getTime() - NowTime.getTime();
            var e = EndTime.getTime() - NowTime.getTime();
            var d=0;
            var h=0;
            if(t > 0){
                d=Math.floor(t/1000/60/60/24);
                //h=Math.floor(e/1000/60/60%24);
                //return '距报名结束还剩' + d + '天' + h +  '小时';

                if(d == 0){
                    var _hous = Math.floor(t/1000/60/60);
                    if(_hous == 0){
                        //不足1小时
                        var _minute = Math.floor(t/1000/60);
                        if(_minute == 0){
                            var _second = Math.floor(t/1000);
                            if(_second == 0){
                                _second = 1;
                            }
                            return _second + '秒后开始';
                        }else{
                            return  _minute + '分钟后开始';
                        }
                    }else{
                        return  _hous + '小时后开始';
                    }
                }else{
                    return d +'天后开始';
                }
            }else if(t < 0 && e>0){
                return '报名已开始';
            }else {
                return '已结束';
            }

        },
        followevent(e){
            e.preventDefault();
            e.stopPropagation();
            var Jtarget = $(e.currentTarget);
            var followerid = Jtarget.data("followerid");
            var userid = Jtarget.data("usereid");
            var userinfo = Models.userinfo.get();
            if(!userinfo.id){
                Toast.show({
                    Content: '您暂未登录，请登录后再来关注',
                    callBack: function(){
                        Router.navigate("login");
                    }
                })
                return
            }

            if(followerid == '0'){
                ModelFllow.setParam({followed: userid, follower: userinfo.id}).execute().then(function(data){
                    Router.loading.hide();
                    if(data && data.non_field_errors){
                        Toast.show({
                            Content: data.non_field_errors || '关注用户失败'
                        })
                    }else{
                        Jtarget.text("已关注");
                        Jtarget.attr("data-followerid",data.id);
                    }
                },function(){
                    Toast.show({
                        Content: '网络不给力啊，请稍后再试'
                    })
                }).catch(function(e){
                    console.log(e)
                });
            }else{
                var fllowpk = Jtarget.attr("data-followerid")|| Jtarget.data("followerid");
                if(!fllowpk){
                    Toast.show({
                        Content: '取消关注出错！'
                    })
                }
                deletefollowsModel.setParam({id:fllowpk}).execute().then(function(data){
                    if(data && data.non_field_errors){
                        Toast.show({
                            Content: data.non_field_errors || '取消关注用户失败'
                        })
                    }else{
                        Jtarget.text("关注");
                        Jtarget.attr("data-followerid",0);
                    }
                },function(){
                    Toast.show({
                        Content: '网络不给力啊，请稍后再试'
                    })
                }).catch(function(e){
                    console.log(e)
                });
            }
        },
        changeType: function(e){
            var $currentTarget = $(e.target),
                type = ~~$currentTarget.data('type') || 1,
                state = this.state;
            if( state.tabType === type) return ;
            this.setState({
                tabType: type
            });
        },
        renderPage(){
            var state = this.state,
                type = state.tabType,
                user = Models.userinfo.get()|| {};
            switch (type){
                case 1:              //推荐的活动
                    recommandEventsModel.execute({
                        user: user.id,
                        page: 1,
                        page_size: 15
                    }).then(function(d){
                        //
                    },function(d){

                    });
                    break;
                case 2:              //订阅的活动
                    if(!user.id) {
                        return ;
                    }
                    userSubscibedEventModel.execute({}).then(function(d){

                    },function(d){

                    });
                    break;
                case 3:              //我发起的活动
                    if(!user.id) {

                    }
                    break;
            }
        }
    });

    return IndexViewComponent;
});