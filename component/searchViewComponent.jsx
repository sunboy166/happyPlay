/**
 * Created by sqsun on 2015/9/22.
 */
define(['react', 'koala', 'router', 'Models', 'RESTF', 'react.backbone'], function(React, Koala, Router, Models, RESTF) {
    var ModelRestf = RESTF.searchModel.getInstance();
    var ModelUserRestf = RESTF.searchUserModel.getInstance();
    var ModelFllow = RESTF.followsModel.getInstance();
    var setEventCollection = RESTF.setEventCollection.getInstance();
    var Toast = new Koala.kUI.Toast();
    var Gnurl = null;
    var elTop = 0;
    var elBox = null;
    var getMX = true;
    var searched = null;
    var SearchViewComponent = React.createBackboneClass({
        getInitialState: function() {
            return {showtype: false, sbtntxt: '搜索', stype: 1};
        },
        componentDidUpdate: function() {
            if(elBox){
                setTimeout(function(){
                    $('.searchcomp-content').scrollTop(elTop)
                })
            }else{
                setTimeout(function(){
                    $('.searchcomp-content').scrollTop(0)
                })
            }
        },
        componentWillReceiveProps: function (nextProps) {
            //this.refs.searchInput.value = '';
        },
        render: function() {
            var self = this;
            var searchResult = self.getModel().get();
            var ESLists = searchResult.results;
            var userinfo = Models.userinfo.get();
            var itemsList = {};
            var scrollEv = self.getMoreEvent;
            var showShare = false;
            var stype = self.state.stype;
            if(!Gnurl){
                scrollEv = null;
            }

            if(stype == 1){
                ESLists.map(function(item) {
                    var eventId = item.event;
                    var showTags = false;
                    var Tagstmp = {};
                    //公共字段
                    var Tags = item.tags;
                    var cimgs = item.cover_image || [];
                    var praises = item.praises || [];
                    var collections = item.collections || [];
                    var user = item.author || item.founder;
                    if(!user){
                        return
                    }

                    //查询当前用户点赞状态
                    var praisesEd = false;
                    praises.map(function(item, k){
                        var praUser = item.user;
                        if(praUser.id == userinfo.id){
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
                    var gheader = <div className="topic-head">
                        <div className="thicon" data-id={user.id} onClick={self.toFuserCenter.bind(self)}>
                            <img src={user.image || './testimg/icon.jpg'} alt=""/>
                        </div>
                        <div className="thtitle">{user.full_name || '用户名'}</div>
                        <div className="thtime">{nowDateTime}</div>
                        <div className="followtext" data-fllowed="0" data-founder={user.id}
                             onClick={self.followevent.bind(self)}>关注</div>
                    </div>

                    //区分活动和晒
                    if(eventId){ //show列表

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
                            var tagtxt = '#' + item;
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
                                        {item.praise_count > 0 &&
                                        <div className="teventnhot">
                                            {item.praise_count + '条热度'}
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
                                                    <span className="bgimg teventntlike" data-id={item.id} onClick={self.liked.bind(self)} data-liked="0"></span>
                                            <span className="teventnqnum" ref={"likedBoxref" + item.id}>
                                                {item.praise_count > 0 && item.praise_count}
                                            </span>
                                                </div>
                                                }
                                                {praisesEd &&
                                                <div className="commentcountdiv">
                                                    <span className="bgimg teventntlike teventntliked" data-id={item.id} onClick={self.liked.bind(self)} data-liked="1"></span>
                                            <span className="teventnqnum likenum" ref={"likedBoxref" + item.id}>
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
            }else{
                ESLists.map(function(item, index) {
                    if(item.founder){
                        return
                    }
                    itemsList[index] = <li className="messageList searchulist" data-id={item.id} onClick={this.fuserV.bind(this)}>
                                            <div className="messageuicon">
                                                <div className="messageui"><img src={item.image || './testimg/icon.jpg'} alt=""/></div>
                                                <div className="navbg messagev"></div>
                                            </div>
                                            <div className="messagename">
                                                {item.full_name || '未设置昵称'}
                                            </div>
                                        </li>
                }.bind(this))
            }

            return (
                <section className="flex view-warp">
                    <section className="flex comp-header comp-sheader">
                        <div className="sheader-input sheader-crow flex">
                            <div className="sheader-stypebox">
                                <div className="sheader-stype" ref="stypeTxt" onClick={this.selectType.bind(this)}>活动</div>
                                {this.state.showtype &&
                                <div className="sheader-stypes" onClick={this.changeType.bind(this)}>
                                    <div className="sheader-type" data-type="1">活动</div>
                                    <div className="sheader-type" data-type="2">用户</div>
                                </div>
                                }
                            </div>
                            <div className="sheader-sinput sheader-crow">
                                <input type="search" className="searchInput" ref="searchInput" placeholder="搜索" onInput={this.search.bind(this)} />
                            </div>
                        </div>
                        <div className="sheader-btn" onClick={this.cancelSearch.bind(this)} ref="searchBtn">搜索</div>
                    </section>
                    <section className="comp-content searchcomp-content" onScroll={scrollEv}>
                        {ESLists.length == 0 &&
                        <div className="search-rtxt">
                            <span className="search-tiptxt">搜索不到你要的结果，为你推荐</span>
                        </div>
                        }
                        <ul className="messageLists discoverusers">
                        {itemsList}
                        </ul>
                    </section>
                </section>
            );
        },
        fuserV (e){
            var Jtarget = $(e.currentTarget);
            var fuid = Jtarget.data('id');
            Router.navigate('fuser/' + fuid);
        },
        cancelSearch(e){
            var Jtarget = $(e.currentTarget);
            var itxt = Jtarget.text();
            if(itxt == '取消'){
                window.history.go(-1)
            }else{
                this.refs.searchInput.focus();
            }
        },
        selectType (){
            var cstate = this.state.showtype;
            if(cstate){
                this.setState({showtype: false});
            }else{
                this.setState({showtype: true});
            }
        },
        changeType(e) {
            var cobj = $(e.target),
                ctypeTxt = this.refs.stypeTxt,
                sinput = this.refs.searchInput,
                sbtn = this.refs.searchBtn;
            sinput.value = '';
            sbtn.innerText = '搜索';
            ctypeTxt.innerHTML = cobj.text();
            this.setState({showtype: false, stype: cobj.data('type')});
        },
        search(e){
            var self = this;
            var Jtarget = $(e.target);
            var searchBtn = this.refs.searchBtn;
            var key = $.trim(Jtarget.val())

            if(key.length < 1){
                searchBtn.innerText = '搜索';
                Jtarget.focus();
                return
            }else{
                searchBtn.innerText = '取消';
            }
            //获取活动晒
            if(searched){
                clearTimeout(searched);
                searched = setTimeout(function() {
                    self.getSearch(key)
                },1000);
            }else{
                searched = setTimeout(function() {
                    self.getSearch(key)
                },1000);
            }
        },
        getSearch(key){
            var userinfo = Models.userinfo.get();
            var stype = this.state.stype;
            if(stype == 1){
                ModelRestf.setParam({
                    query: key,
                    user: userinfo.id
                }).execute().then(function (data) {
                    if (data && data.non_field_errors) {
                        Toast.show({
                            Content: data.non_field_errors || '获取搜索信息失败，请稍后再试'
                        })
                    } else {
                        Models.searchItems.set(data)
                    }
                }, function () {
                    Toast.show({
                        Content: '获取搜索信息失败，请稍后再试'
                    })
                }).catch(function (e) {
                    console.log(e)
                });
            }else{
                ModelUserRestf.setParam({
                    query: key,
                    user: userinfo.id
                }).execute().then(function (data) {
                    if (data && data.non_field_errors) {
                        Toast.show({
                            Content: data.non_field_errors || '获取搜索信息失败，请稍后再试'
                        })
                    } else {
                        Models.searchItems.set(data)
                    }
                }, function () {
                    Toast.show({
                        Content: '获取搜索信息失败，请稍后再试'
                    })
                }).catch(function (e) {
                    console.log(e)
                });
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
                    Koala.ajax(
                        Gnurl,
                        {},
                        {
                            type: "get",
                            sucBack: function(data){
                                Router.loading.hide();
                                getMX = false;
                                if(data && data.non_field_errors){
                                    Toast.show({
                                        Content: data.non_field_errors || '获取搜索结果列表失败'
                                    })
                                }else{
                                    var peventModel = Models.searchItems.get();
                                    var peventList = peventModel.results;
                                    peventList = peventList.concat(data.results);
                                    var tmpObj = {
                                        next: data.next,
                                        results: peventList
                                    }
                                    Gnurl = data.next;
                                    Models.searchItems.set(tmpObj)
                                }
                            },
                            errBack: function(err){
                                getMX = false;
                                Router.loading.hide();
                                Toast.show({
                                    Content: '网络不给力，请稍后再试'
                                })
                            }
                        }
                    );
                }
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
        followevent(e){
            e.preventDefault();
            e.stopPropagation();
            var Jtarget = $(e.currentTarget);
            var founder = Jtarget.data("founder");
            var fllowed = Jtarget.data("fllowed");
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

            if(fllowed == '0'){
                ModelFllow.setParam({followed: founder, follower: userinfo.id}).execute().then(function(data){
                    Router.loading.hide();
                    if(data && data.non_field_errors){
                        Toast.show({
                            Content: data.non_field_errors || '关注用户失败'
                        })
                    }else{
                        Jtarget.text("已关注");
                        //Jtarget.addClass('fllowicned');
                        Jtarget.data("fllowed","1");
                    }
                },function(){
                    Toast.show({
                        Content: '网络不给力啊，请稍后再试'
                    })
                }).catch(function(e){
                    console.log(e)
                });
            }else{
                ModelFllow.execute({followed: founder, follower: userinfo.id}, {type: "DELETE"}).then(function(data){
                    if(data && data.non_field_errors){
                        Toast.show({
                            Content: data.non_field_errors || '取消关注用户失败'
                        })
                    }else{
                        Jtarget.text("关注");
                        //Jtarget.removeClass('fllowicned');
                        Jtarget.data("fllowed","0");
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
        eventShow: function(e){
            var listDom = e.currentTarget;
            var listId = $(listDom).data('id');
            if(listId !== undefined){
                Router.navigate("event/detail/" + listId);
            }
        },
        liked(e){
            e.preventDefault();
            e.stopPropagation();
            var Jtarget = $(e.currentTarget);
            var id = Jtarget.data("id");
            var liked = Jtarget.data("liked");
            var likedBox = $(this.refs['likedBoxref'+ id]);
            var likedNum = likedBox.text();
            if(liked == 0){
                if(likedNum){
                    likedNum = parseInt(likedNum) + 1;
                }else{
                    likedNum = 1;
                }
                likedBox.text(likedNum).addClass('likenum');
                Jtarget.addClass('teventntliked');
                Jtarget.data('liked', "1");
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
        }
    });
    return SearchViewComponent;
})