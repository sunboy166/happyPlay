/**
 * Created by sqsun on 2015/9/22.
 */
define(['react', 'jsx!headerViewComponent', 'router', 'Models', 'RESTF', 'koala', 'Fn', 'react.backbone'], function(React, HeaderComp, Router, Models, RESTF, Koala, Fn) {
    var ModelRestf = RESTF.followsModel.getInstance();
    var setShowpraise = RESTF.setShowpraise.getInstance();
    var deleteShowpraise = RESTF.deleteShowpraise.getInstance();
    var Toast = new Koala.kUI.Toast();
    var Gnurl = null;
    var elTop = 0;
    var elBox = null;
    var getMX = true;
    var eventid = 1;
    var ShowViewComponent = React.createBackboneClass({
        getInitialState: function() {
            return {
                showSelectTab: false,
                selectedItemIndex: 0,         //表示所有的
                menutItem: []
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
            setTimeout(function(){
                $('.comp-content').scrollTop(0)
            });
            //初始化滚动图片
            var swiper = new Swiper('#sliderimg1', {
                autoplay: 2500,
                autoplayDisableOnInteraction: false,
                pagination: '#detail-imagedot1',
                paginationClickable: true
            });
        },
        componentWillReceiveProps: function (nextProps) {
            getMX = true;
        },
        wxshareFn(){

        },
        render: function() {
            var self = this,
                state = this.state;
            var showDetail = self.getModel().get();
            var userinfo = Models.userinfo.get();
            var tempResults = showDetail.result,
                showResults = [];

            if(state.selectedItemIndex === 0) {        //所有的晒
                Gnurl = showDetail.next;
                _.each(tempResults, function(k, v){
                    showResults = showResults.concat(v);
                });
            } else if(state.selectedItemIndex === 1) {  //发起者的晒
                Gnurl = showDetail.next_founder;
                showResults = tempResults[1];
            } else if(state.selectedItemIndex === 2) {  //参与者的晒
                Gnurl = showDetail.next_other;
                showResults = tempResults[2];
            }
            var scrollEv = this.getMoreEvent;

            var btnsConf = self.props.btnsConf;
            var itemsList = {};
            var showTagstmp = {};
            var showTags = false;
            btnsConf.wxsharebtn = self.wxshareFn;
            var showShare  = false;
            eventid = self.props.eventid || 1;
            showResults.map &&　showResults.map(function(item, index){
                var cimgs = item.cover_image || [];
                var eventImgsItem = {};
                var showEventImg = false;
                var heatCount = item.praise_count + item.comment_count;//热度值
                //图片
                if(cimgs.length > 0){
                    cimgs = cimgs.split('||');
                    if(cimgs.length > 2){
                        showEventImg = true;
                        cimgs.map(function(itemimg, index){
                            if(itemimg){
                                eventImgsItem['eimg-' + index] = <li className="topicthurm">
                                    <img src={cimgs[index]} data-id={item.id} onClick={self.changeImg.bind(self)}/>
                                </li>
                            }
                        });
                    }
                }

                //tags
                item.tags.map(function(item, index){
                    var tag = "#" + item;
                    showTags = true;
                    showTagstmp[index] = <span className="teventag">{tag}</span>
                });

                //查询当前用户点赞状态
                var praisesEd = false;
                var pkid = 0;
                var praisesed = item.praises || [];
                praisesed.map(function(item, k){
                    var praUser = item.user;
                    if(userinfo && praUser.id == userinfo.id){
                        praisesEd = true;
                        pkid = item.id;
                        return
                    }
                });
                itemsList[index] = <div className="topicbox showdetailbox" data-id={item.id} onClick={self.showDetail.bind(self)}>
                                        <div className="topic-head">
                                            <div className="thicon">
                                                <img src={item.author.image|| './testimg/icon.jpg'} alt=""/>
                                            </div>
                                            <div className="thtitle">{item.author.full_name || "Happy用户"}</div>
                                            <div className="thtime">{Fn.Date.format(item.created_time.replace(/\..*/gi, '').replace('T', ' '), 'MM-dd')}</div>
                                            <div className="fllowicn" data-fllowed="0" data-founder={item.author.id} onClick={self.followevent.bind(self)}>
                                            </div>
                                        </div>
                                        <div className={"topic-img img-auto-wrap " + (cimgs[0] ? "" : "dn")} style={{'padding-top': '100%'}}>
                                            <img src={cimgs[0] + '?imageView2/1/h/500/format/jpg'} alt="" ref={"bigimg_" + item.id}/>
                                        </div>
                                        {showEventImg &&
                                        <div className="topicthurmbox">
                                            <ul className="topicthurms">
                                                {eventImgsItem}
                                            </ul>
                                        </div>
                                        }
                                        <div className="topiceventbox">
                                            <div className="topictxt">{item.content || "好玩瞬间内容"}</div>
                                            {showTags &&
                                            <div className="teventags">
                                                {showTagstmp}
                                            </div>
                                            }
                                            <div className="teventnbox">
                                                {heatCount > 0 &&
                                                <div className="teventnhot">
                                                    <span className="c-green">{heatCount}</span><span className="c-grey">条热度</span>
                                                </div>
                                                }
                                                <div className="teventnotice">
                                                    {showShare &&
                                                    <div className="teventntnum">
                                                        <span className="bgimg shareqicon"></span>
                                                        <span className="teventnqnum">{item.transpond_count}</span>
                                                    </div>
                                                    }
                                                    <div className="commentcountdiv">
                                                        <i className="icon-comment-1 fz22 c-bbb"></i>
                                                        <span className="teventnqnum">{item.comment_count}</span>
                                                    </div>
                                                    <div className="commentcountdiv">
                                                        <div className="teventntnum" data-pk={pkid} data-id={item.id} onClick={self.liked.bind(self)} data-liked={praisesEd ? "1" : "0"}>
                                                            <i ref={"likediele" + item.id} className={praisesEd ? "icon-heart fz20 c-red" : "icon-heart-empty fz20 c-bbb"}></i>
                                                            <span className={praisesEd ? "teventnqnumred":"teventnqnum"} ref={"likedBoxref" + item.id}>{item.praise_count > 0 && item.praise_count}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
            });
            if(!Gnurl){
                scrollEv = null;
            }

            //头部图片
            var toubuhuodongtupian ="",
                showSwap = [];
            for(var i = 0, j = showResults.length; i<j && i <=3; i++){
                if(showResults[i].cover_image) {
                    var tempArr = showResults[i].cover_image.split('|');
                    tempArr = tempArr.filter(function(v){
                        return !!v;
                    });
                    showSwap.push.apply(showSwap, tempArr);
                }
                if(showSwap.length >= 3) break;
            }
            if(!toubuhuodongtupian){
                toubuhuodongtupian = <div className="detail-images">
                    <div id="sliderimg1" className="swipebox swiper-container">
                        <div className="swipe-wrap swiper-wrapper">
                            {showSwap.map(function(v){
                                return (
                                    <div className="swiper-slide">
                                        <img src={v} width="100%" height="auto" alt=""/>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                    <div className="detail-imagebtn" id="detail-imagedot1"></div>
                </div>
            }


            var state = this.state;
            return (
                <section className="flex view-warp showlistwarp">
                    <HeaderComp btnsConf={this.props.btnsConf} title={this.props.title} />
                    <ul className={"select_show_type js_select_show_type_item  " + (state.showSelectTab ? "" : "dn")}>
                        {state.menutItem.map(function(v){
                            if(v.key) return (
                                <li className={state.selectedItemIndex === v.key ? "current": ""} data-index={v.key}>{v.value}</li>
                            )
                        })}
                    </ul>
                    <section className="comp-content publish-cont topic" onScroll={scrollEv}>
                        <div>
                            {/*<div className="coverimgbox">
                                <img src="./testimg/pic.png" width="100%" alt=""/>
                                <div className="showtitlebox">2016 FORMULA1 中国大奖赛  独家优惠抢票（数量有限300名）</div>
                            </div>*/}
                            <div className="showlistMbox">
                                {itemsList}
                            </div>
                        </div>
                    </section>
                    <div className="showPhotoBox">
                        <div className="showadd_pbtn showadd_pbtn_fixed">
                            <i className="icon-picture pos_center"></i>
                            <input className="pblish-photo" type="file" capture="microphone" onChange={self.camPhoto.bind(self)} accept="image/*"/>
                        </div>
                    </div>
                </section>
            )
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
            var liked = Jtarget.data("liked");
            var colordom = $(this.refs["likediele" + id]);
            var likedBox = $(this.refs["likedBoxref" + id]);
            var likedNum = likedBox.text();
            if(liked == 0){
                setShowpraise.setParam({show: id, user: userinfo.id}).execute().then(function(data){
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
                        likedBox.text(likedNum).removeClass('teventnqnum').addClass('teventnqnumred');
                        colordom.removeClass('icon-heart-empty').removeClass('c-bbb').addClass('icon-heart').addClass('c-red');
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
                if(!pkid){
                    Toast.show({
                        Content: '取消赞出错！'
                    })
                    return;
                }
                deleteShowpraise.setParam({id: pkid}).execute().then(function(data){
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
                        likedBox.text(likedNum).removeClass('teventnqnumred').addClass('teventnqnum');
                        colordom.removeClass('icon-heart').removeClass('c-red').addClass('icon-heart-empty').addClass('c-bbb');
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
        camPhoto(e){
            var userinfo = Models.userinfo.get();
            if(!userinfo.id){
                Toast.show({
                    Content: '您暂未登录，请登录后再来报名',
                    callBack: function(){
                        window.location.href = '#login';
                    }
                });
                return
            }
            var _this = e.currentTarget;
            var src = _this.files;
            var reader = new FileReader();
            if(src[0]){
                reader.readAsDataURL(src[0]);
                reader.onload = function(e){
                    Models.showimgbase.set(this.result);
                    Router.navigate('graphic/detail/edit/' + eventid);
                }
            }
        },
        showDetail(e){
            var Jitem = $(e.currentTarget);
            var id = Jitem.data("id");
            Router.navigate('sundetail/' + id)
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
                    Router.loading.hide();
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
        getMoreEvent(e){
            var _state = this.state;
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
                                        Content: data.non_field_errors || '获取瞬间列表失败'
                                    })
                                }else{
                                    var peventModel = Models.showListDetail.get();
                                    var peventList = peventModel.result;
                                    //peventList = peventList.concat(data.result);
                                    peventList[0] = peventList[0].concat(data.result[0]);
                                    peventList[1] = peventList[1].concat(data.result[1]);
                                    peventList[2] = peventList[2].concat(data.result[2]);

                                    if(peventList && peventList.length){
                                        for (var i in peventList){
                                            if(peventList[i] && peventList[i].length){
                                                peventList[i].sort(function(a,b){
                                                    var a_dt =  new  Date(a.created_time).getTime();;
                                                    var b_dt =  new  Date(b.created_time).getTime();;
                                                    return a_dt > b_dt ? 0:1;
                                                });
                                            }
                                        }
                                    }
                                    var tmpObj = {
                                        next: data.next,
                                        next_founder:data.next_founder,
                                        next_other:data.next_other,
                                        result: peventList
                                    };
                                    if(_state.selectedItemIndex === 0) {        //所有的晒
                                        Gnurl = data.next;
                                    } else if(_state.selectedItemIndex === 1) {  //发起者的晒
                                        Gnurl = data.next_founder;
                                    } else if(_state.selectedItemIndex === 2) {  //参与者的晒
                                        Gnurl = data.next_other;
                                    }

                                    Models.showListDetail.set(tmpObj);
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
    return ShowViewComponent;
})