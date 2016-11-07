/**
 * Created by sqsun on 2015/9/22.
 */
define(['react', 'jsx!navViewComponent','Fn' , 'router', 'RESTF', 'Models', 'koala', 'react.backbone' ], function(React, NavComp, Fn, Router, RESTF, Models, Koala) {
    var ModelRestf = RESTF.followsModel.getInstance();
    var nearbyModelRestf = RESTF.nearbyModel.getInstance();
    var setEventCollection = RESTF.setEventCollection.getInstance();
    var Toast = new Koala.kUI.Toast();
    var geoData = null;
    var mapKey = "OB4BZ-D4W3U-B7VVO-4PJWW-6TKDJ-WPB77";
    var mapReferer = "HappyPlay";
    var dProps = [];
    var nProps = [];
    var Gnurl = null;
    var elTop = 0;
    var elBox = null;
    var getMX = true;
    var IndexViewComponent = React.createBackboneClass({
        getInitialState: function() {
            return {upstate: false};
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
        },
        render: function() {
            var props = this.props,
                self = this;
            var Tmp = {};
            geoData = props.geoData
            if(!this.state.upstate){
                dProps = props.list;
                Gnurl = props.next;
            }else{
                dProps = nProps.results;
                Gnurl = nProps.next;
            }

            var scrollEv = self.getMoreEvent;

            if(dProps && dProps.length > 0){
                dProps.map(function (v,k) {
                    if(v.type == 1){
                        Tmp[k] = this.renderActive.call(this, v, k);
                    }else{
                        Tmp[k] = this.renderShow.call(this, v,k)
                    }
                }.bind(self))
            }else{
                if(this.state.upstate){
                    Tmp[0] = <li><div className="nonear">暂未找到您周边的活动</div></li>
                }
            }

            if(!Gnurl){
                scrollEv = null;
            }
            return (
                <section className="flex view-warp showlistwarp">
                    <header className="comp-header">
                        <div className="cm-header bgcfff">
                            <div className="cm-header-left" onClick={self.geolocation.bind(self)}>
                                <i className="icon-location c-999"></i>
                            </div>
                            <div className="cm-header-center">
                                <ul className="tabs tabs-style-1" onClick={self.ctab.bind(self)}>
                                    <li className="current" data-v="0">推荐</li>
                                    <li data-v="1">附近</li>
                                </ul>
                            </div>
                            <div className="cm-header-right" onClick={self.csearch.bind(self)}>
                                <i className="demo-icon icon-search c-999"></i>
                            </div>
                        </div>
                    </header>
                    <section className="container comp-content publish-cont" onScroll={scrollEv}>
                        <ul className="sp-list">
                            {Tmp}
                        </ul>
                    </section>
                    <NavComp navClass='comp-nav-discoverbtn' />
                </section>
            );
        },
        csearch(e){
            Router.navigate('search')
        },
        ctab(e){
            var self = this;
            var Jtarget = $(e.target);
            var V = Jtarget.data('v');
            if(V == '1'){
                if(!geoData){
                    Toast.show({
                        Content: '自动获取当前地址失败，请手动点击左上角按钮，先获取当前地址再试',
                        callBack: function() {
                            self.geolocation();
                        }
                    })
                }else{
                    Jtarget.addClass('current').siblings().removeClass('current');
                    self.getNear();
                }
            }else{
                Jtarget.addClass('current').siblings().removeClass('current');
                self.setState({upstate: false})
            }
        },
        getNear(){
            var self = this;
            nearbyModelRestf.setParam({lat: geoData.latitude, lng: geoData.longitude}).execute().then(function(data){
                if(data && data.non_field_errors){
                    Toast.show({
                        Content: data.non_field_errors || '获取周边数据失败'
                    })
                }else{
                    nProps = data;
                    self.setState({upstate: true})
                }
            },function(){
                Toast.show({
                    Content: '网络不给力啊，请稍后再试'
                })
            }).catch(function(e){
                console.log(e)
            });
        },
        vrouter(e){
            var Jtarget = $(e.currentTarget);
            var id = Jtarget.data("key");
            if(id !== undefined){
                Router.navigate("event/detail/" + id);
            }
        },
        //渲染页面的活动
        renderActive(v, k){
            var founder = v.founder || v.author;
            var datetime = new Date(v.created_time);
            var nowDateTime = datetime.getFullYear();
            var sdatetime = new Date(v.event_begin_time);
            var eeDate = new Date(v.event_end_time);
            var sinDT = this.GetRTime(sdatetime, eeDate);
            nowDateTime = nowDateTime + ((datetime.getMonth() + 1) < 10 ? "-0" + (datetime.getMonth() + 1) : "-" + (datetime.getMonth() + 1));
            nowDateTime = nowDateTime + (datetime.getDate() < 10 ? "-0" + datetime.getDate() : "-" + datetime.getDate());
            return (
                 <li data-key={v.id} onClick={this.vrouter}>
                        <header className="sp-list-header tabs tabs-center">
                            <div className="no-fixed">
                                <div className="user-litpic">
                                    <img src={founder.image} alt=""/>
                                </div>
                            </div>
                            <div className="sp-list-user-desc">
                                <h2>{founder.nick_name}</h2>
                                <time datetime="2015-06-01" className="c-999">{nowDateTime}</time>
                            </div>
                            <div className="bgimg fllowicn" data-fllowed="0" data-founder={founder.id} onClick={this.followevent.bind(this)}>
                            </div>
                        </header>
                        <main className="sp-list-body">
                            <div className={"sp-lit-pic img-auto-wrap " + (v.cover_image[0] ? "" : "pic-placeholder")}>
                                <img src={v.cover_image[0]} alt=""/>
                                <span className={"sp-lit-price " + (v["ticket_amount"] > 0 ? "" : "dn") }><sup>¥</sup>{v["ticket_amount"]}<i className="icon-lock-1"></i></span>
                                <div className="favicon" data-fav="0" data-id={v.id} onClick={this.favEvent.bind(this)}></div>
                            </div>
                        </main>
                        <footer className="sp-list-footer">
                            <h1>{v.title}</h1>
                            <div className="c-999 sp-list-footer-desc">
                                <p><time datetime="2016-04-05 - 4 - 17">{Fn.Date.format(v.signup_begin_time, 'yyyy年MM月dd日')} - {Fn.Date.format(v.event_end_time, 'MM月dd日')}</time>&nbsp;<span className="c-green fr">{sinDT}</span></p>
                                <p>{v.address}</p>
                            </div>
                            <div className="sp-list-tags">
                                {v.tags.map(function(v){
                                    return (
                                        <span>{v.name}</span>
                                    );
                                })}
                            </div>
                            <div className="teventnbox">
                                {v.praise_count > 0 &&
                                <div className="teventnhot">
                                    {v.praise_count + '条热度'}
                                </div>
                                }
                                <div className="teventnotice">
                                    <div className="teventntnum">
                                        <span className="bgimg teventntlike" data-id={v.id} onClick={this.liked.bind(this)} data-liked="0"></span>
                                        <span className="teventnqnum" ref={"likedBoxref" + v.id}>{v.praise_count> 0 && v.praise_count}</span>
                                    </div>
                                </div>
                            </div>
                        </footer>
                 </li>
            );
        },
        srouter(e){
            var Jtarget = $(e.currentTarget);
            var id = Jtarget.data("key");
            if(id !== undefined){
                Router.navigate('sundetail/' + id)
            }
        },
        changeImg(){

        },
        //渲染页面的活动
        renderShow(v, k){
            var founder = v.founder || v.author;
            var datetime = new Date(v.created_time);
            var nowDateTime = datetime.getFullYear();
            var showEventImg = false;
            var eventImgsItem = {};
            var cimgs = v.cover_image;
            nowDateTime = nowDateTime + ((datetime.getMonth() + 1) < 10 ? "-0" + (datetime.getMonth() + 1) : "-" + (datetime.getMonth() + 1));
            nowDateTime = nowDateTime + (datetime.getDate() < 10 ? "-0" + datetime.getDate() : "-" + datetime.getDate());
            //图片
            if(cimgs){
                cimgs = cimgs.split('||');
                cimgs.map(function(itemimg, index){
                    if(itemimg){
                        if(index > 0){
                            showEventImg = true;
                        }
                        eventImgsItem['eimg-' + index] = <li className="topicthurm">
                            <img src={itemimg} data-id={v.id} onClick={this.changeImg.bind(this)}/>
                        </li>
                    }
                }.bind(this));
            }
            return (
                <li data-key={v.id} onClick={this.srouter}>
                    <header className="sp-list-header tabs tabs-center">
                        <div className="no-fixed">
                            <div className="user-litpic img-auto-wrap">
                                <img src={founder.image} alt=""/>
                            </div>
                        </div>
                        <div className="sp-list-user-desc">
                            <h2>{founder.nick_name}</h2>
                            <time datetime="2015-06-01" className="c-999">{nowDateTime}</time>
                        </div>
                        <div className="bgimg fllowicn" data-fllowed="0" data-founder={founder.id} onClick={this.followevent.bind(this)}>
                        </div>
                    </header>
                    <main className="sp-list-body">
                        <div className={"sp-lit-pic img-auto-wrap " + (v.cover_image[0] ? "" : "pic-placeholder")}>
                            <img src={v.cover_image[0]} alt=""/>
                            <div className="favicon" data-fav="0" data-id={v.id} onClick={this.favEvent.bind(this)}></div>
                        </div>
                        {showEventImg &&
                        <div className="topicthurmbox">
                            <ul className="topicthurms">
                                {eventImgsItem}
                            </ul>
                        </div>
                        }
                    </main>
                    <footer className="sp-list-footer">
                        <h1>{v.title}</h1>
                        <div className="sp-list-tags">
                            {v.tags.map(function(v){
                                return (
                                    <span>{v.name}</span>
                                );
                            })}
                        </div>
                        <div className="teventnbox">
                            {v.praise_count > 0 &&
                                <div className="teventnhot">
                                    {v.praise_count + '条热度'}
                                </div>
                            }
                            <div className="teventnotice">
                                <div className="teventntnum">
                                    <span className="bgimg teventntlike" data-id={v.id} onClick={this.liked.bind(this)} data-liked="0"></span>
                                    <span className="teventnqnum" ref={"likedBoxref" + v.id}>{v.praise_count> 0 && v.praise_count}</span>
                                </div>
                            </div>
                        </div>
                    </footer>
                </li>
            );
        },
        //渲染页面的专题
        renderSpecial(v){
            return (
                <li className="special-swiper-slide-wrapper">
                    <div>
                        <div className="swiper-container">
                            <div className="swiper-wrapper">
                                <div className="swiper-slide">Slide 1</div>
                                <div className="swiper-slide">Slide 2</div>
                                <div className="swiper-slide">Slide 3</div>
                            </div>
                            {/* 如果需要分页器 */}
                            <div className="swiper-pagination"></div>

                            {/* 如果需要导航按钮 */}
                            <div className="swiper-button-prev"></div>
                            <div className="swiper-button-next"></div>

                            {/* 如果需要滚动条 */}
                            <div className="swiper-scrollbar"></div>
                        </div>
                    </div>
                </li>
            );
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
                        window.location.href = '#login';
                    }
                })
                return
            }

            if(fllowed == '0'){
                ModelRestf.setParam({followed: founder, follower: userinfo.id}).execute().then(function(data){
                    if(data && data.non_field_errors){
                        Toast.show({
                            Content: data.non_field_errors || '关注用户失败'
                        })
                    }else{
                        Jtarget.addClass('fllowicned');
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
                ModelRestf.execute({followed: founder, follower: userinfo.id}, {type: "DELETE"}).then(function(data){
                    if(data && data.non_field_errors){
                        Toast.show({
                            Content: data.non_field_errors || '取消关注用户失败'
                        })
                    }else{
                        Jtarget.removeClass('fllowicned');
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
                            Content: data.non_field_errors || '取消收藏失败'
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
        geolocation(){
            // TODO popup 抽出模块
            // TODO 搜索位置 抽出模块
            var self = this;
            var $popup = $('#js-location-picker');
            if (!$popup.length) {
                var popup = document.createElement('div');
                popup.className = 'popup';
                popup.id = 'js-location-picker';
                popup.innerHTML = '<div class="popup_box"><div class="popup_header"><p>选择地址</p><a href="javascript:void(0)" class="bgimg icodeclose js-close"></a></div><div class="popup_content"><iframe src="' + "http://3gimg.qq.com/lightmap/components/locationPicker2/index.html?search=1&type=1&referer=" + mapReferer + "&key=" + mapKey + '" style="border: 0; width: 100%; height: 100%;"></iframe></div></div>';
                document.body.appendChild(popup);
                $popup = $(popup);
                $popup.fadeIn();
                $popup.on('click', function(){
                    $popup.fadeOut();
                });
                $popup.on('click', '.popup_content', function(e){
                    e.stopPropagation();
                });
                $popup.on('click', '.js-close', function() {
                    $popup.fadeOut();
                });
            } else {
                $popup.fadeIn();
            }

            var selectLocationHandle = function(event) {
                // 接收位置信息，用户选择确认位置点后选点组件会触发该事件，回传用户的位置信息
                var loc = event.data;

                //防止其他应用也会向该页面post信息，需判断module是否为'locationPicker'
                if (loc && loc.module == 'locationPicker') {
                    $popup.fadeOut();
                    window.removeEventListener('message', selectLocationHandle, false);
                    var latlng = loc.latlng || {};
                    geoData = {
                        name: loc.poiaddress,
                        country: '中国',
                        province: '',
                        city: loc.cityname,
                        city_zone: '',
                        longitude: latlng.lng,
                        latitude: latlng.lat
                    };
                    if(self.state.upstate){
                        self.getNear()
                    }
                }
            }
            window.addEventListener('message', selectLocationHandle, false);
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
                                        Content: data.non_field_errors || '获取列表失败'
                                    })
                                }else{
                                    var peventList = nProps.results;
                                    peventList = peventList.concat(data.results);
                                    Gnurl = data.next;
                                    nProps.next = data.next;
                                    nProps.results = peventList;
                                    //Models.showListDetail.set(tmpObj);
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
        }
    });

    return IndexViewComponent;
});