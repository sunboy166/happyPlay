/**
 * Created by sqsun on 2015/9/22.
 */
define(['react', 'jsx!headerViewComponent', 'router', 'Models', 'RESTF', 'koala','$WX', 'Fn', 'react.backbone'], function(React, HeaderComp, Router, Models, RESTF, Koala, $wx, Fn) {
    var Toast = new Koala.kUI.Toast();
    var ModelRestf = RESTF.followsModel.getInstance();
    var setShowpraise = RESTF.setShowpraise.getInstance();
    var deleteShowpraise = RESTF.deleteShowpraise.getInstance();
    var FDArr = [];
    var showid = 0;
    var cindex = 0;
    var siobj = null;
    var ShowViewComponent = React.createBackboneClass({
        getInitialState: function() {
            return {};
        },
        componentWillReceiveProps: function (nextProps) {
            this.setState({});
        },
        componentDidUpdate: function () {
            var JshowImgthurm = $(this.refs.showImgthurm).find('img');
            var imgthurmLen = JshowImgthurm.length;
            cindex = 1;
            if(imgthurmLen > 1){
                siobj = setInterval(function(){
                    if(cindex == imgthurmLen){
                        cindex = 0;
                    }
                    JshowImgthurm.eq(cindex).trigger('click');
                    cindex++;
                }, 2000)
            }else{
                if(siobj){
                    clearInterval(siobj)
                }
            }
            var title = Fn.getAttr(this.props, 'model.attributes.result.content');
            if(title && this.$$lastTitle != title) {
                var shareTitle = "【" + title.substr(0,20) + "】,会玩的人都用HAPPY";
                this.$$lastTitle = shareTitle;
                document.title = shareTitle + '-- 好玩瞬间';
                var img = Fn.getAttr(this.props, 'model.attributes.result.cover_image', "").split("|")[0],
                    shareContent = {
                        title: shareTitle,
                        desc: "【" + title.substr(0,20) + "】，这样好玩的活动瞬间在HAPPY还有很多！",
                        link: window.location.href,
                        imgUrl: img || "http://ahappyapp.com/app/img/logo.jpg",
                        //logo: 'http://ahappyapp.com/app/img/getheadimg.png',
                        type: 'link',
                        dataUrl: "",
                        trigger: function(){
                            console.log(arguments);
                        },
                        success: function(){
                            console.log(arguments);
                        },
                        cancel: function(){
                            console.log(arguments);
                        },
                        fail: function (res) {
                            console.log(arguments);
                        }
                    };
                $wx.wxShare(shareContent);
            }
        },
        wxshareFn(){

        },
        commentbtnFn(){
            Router.navigate('#comment/'+showid + '/1')
        },
        render: function() {
            var showDetail = this.getModel().get();
            var userinfo = Models.userinfo.get();
            var btnsConf = this.props.btnsConf;
            var showResult = showDetail.result;
            var suser = showResult.author;
            var commentLists = showDetail.commentData;
            var showImgs = [];
            var showImgstmp = {};
            var showTagstmp = {};
            var commentmp = {};
            var showTags = false;
            var showComment = false;
            var share = false;
            var userIcon = suser.image || './testimg/icon.jpg';
            var ctime = showResult.created_time;
            var esDate = '';
            var sDateTime = '-.-';
            var heatCount = showResult.praise_count + commentLists.count;//热度值
            if(ctime){
                esDate = new Date(ctime);
                sDateTime = esDate.getFullYear();
                var _hour = ( 10 > esDate.getHours() ) ? '0' + esDate.getHours() : esDate.getHours();
                var _minute = ( 10 > esDate.getMinutes() ) ? '0' + esDate.getMinutes() : esDate.getMinutes();
                var _second = ( 10 > esDate.getSeconds() ) ? '0' + esDate.getSeconds() : esDate.getSeconds();
                sDateTime = sDateTime + ((esDate.getMonth() + 1) < 10 ? "-0" + (esDate.getMonth() + 1) : "-" + (esDate.getMonth() + 1));
                sDateTime = sDateTime + (esDate.getDate() < 10 ? "-0" + esDate.getDate() : "-" + esDate.getDate());
                sDateTime = sDateTime + ' '  + _hour + ':' + _minute + ':' + _second + '  ·  ';
            }


            showid = showResult.id;
            FDArr[showResult.founder] = 2;
            btnsConf.wxsharebtn = this.wxshareFn;
            btnsConf.commentbtn = this.commentbtnFn;
            if(showResult.cover_image){
                showImgs = showResult.cover_image.split('||')
            }

            //查询当前用户点赞状态
            var praisesEd = false;
            var pkid = 0;
            var praisesed = showResult.praises || [];
            praisesed.map(function(item, k){
                var praUser = item.user;
                if(praUser.id == userinfo.id){
                    praisesEd = true;
                    pkid = item.id;
                    return
                }
            });

            //好玩瞬间图片
            var showEventImg = false;
            var eventImgsItem = {};
            var showdImgsItem = {};
            showImgs.map(function(item,index){
                if(item){
                    if(index > 1){
                        showEventImg = true;
                    }
                    showdImgsItem['dimg-' + index] = <li className="show-dimgitem">
                        <div className="topic-img img-auto-wrap" style={{'padding-top': '100%'}}>
                                                        <img src={item} width="100%" alt=""/>
                            </div>
                                                    </li>
                    eventImgsItem['eimg-' + index] = <li className="topicthurm">
                                                <div className="topic-img img-auto-wrap  img-auto-wrap2" style={{'padding-top': '100%'}}>
                                                        <img src={item} data-index={index} onClick={this.changeImg.bind(this)}/>
                                                    </div>
                                                    </li>
                }
            }.bind(this));


            //tags
            showResult.tags.map(function(item, index){
                var tag = "#" + item;
                showTags = true;
                showTagstmp[index] = <span className="teventag">{tag}</span>
            });

            if((showResult.founder !== userinfo.id) && FDArr[showResult.founder] !=0){
                FDArr[showResult.founder] = 2;
            }

            //commnet
            commentLists.results.map(function(citem, index){
                var reComment = citem.reply;
                var userinfo = citem.user;
                var reCommentmp = {};
                var esDate = new Date(citem.created_at);
                var nowDateTime = esDate.getFullYear();
                var _hour = ( 10 > esDate.getHours() ) ? '0' + esDate.getHours() : esDate.getHours();
                var _minute = ( 10 > esDate.getMinutes() ) ? '0' + esDate.getMinutes() : esDate.getMinutes();
                var _second = ( 10 > esDate.getSeconds() ) ? '0' + esDate.getSeconds() : esDate.getSeconds();
                nowDateTime = nowDateTime + ((esDate.getMonth() + 1) < 10 ? "-0" + (esDate.getMonth() + 1) : "-" + (esDate.getMonth() + 1));
                nowDateTime = nowDateTime + (esDate.getDate() < 10 ? "-0" + esDate.getDate() : "-" + esDate.getDate());
                nowDateTime = nowDateTime + ' '  + _hour + ':' + _minute + ':' + _second + '  ·  ';

                showComment = true;
                reComment.map(function(ritem, rindex){
                    var ruser = ritem.user;
                    reCommentmp[rindex] = <div className="recommentbox">
                        <div className="thicon">
                            <img src={ruser.image || "./testimg/icon.jpg"} alt=""/>
                        </div>
                        <div className="ucomment">
                            <div className="username">{ruser.full_name}</div>
                            <div className="ucommenttxt">
                                {ritem.content}
                            </div>
                        </div>
                    </div>
                });
                commentmp[index] = <div className="usercommentsbox">
                    <div className="usercommentbox">
                        <div className="thicon">
                            <img src={userinfo.image || "./testimg/icon.jpg"} alt=""/>
                        </div>
                        <div className="ucomment">
                            <div className="username">{userinfo.full_name}</div>
                            <div className="ucommenttxt">
                                {citem.content}
                            </div>
                            <div className="commentdatebox">
                                <span className="commentimer">{nowDateTime}</span>
                                <a href={"#comment/"+ showResult.id +"/r/" + citem.id + "/1"} className="recomment">回复</a>
                            </div>
                        </div>
                    </div>
                    {reCommentmp}
                </div>
            });
            return (
                <section className="flex view-warp">
                    <HeaderComp btnsConf={this.props.btnsConf} title={this.props.title} />
                    <section className="comp-content publish-cont showcdetail">
                        <div className="topicbox showdetailbox">
                            <div className="topic-head">
                                <div className="thicon">
                                    <img src={userIcon} alt=""/>
                                </div>
                                <div className="thtitle">{suser.full_name || "好玩瞬间标题"}</div>
                                <div className="thtime">{sDateTime}</div>
                                <div className="bgimg fllowicn" data-fllowed="0" data-founder={showResult.author.id} onClick={this.followevent.bind(this)}></div>
                            </div>
                            <div className="show-dimg">
                                <ul className="show-dimgbox" ref="showdImgs">
                                    {showdImgsItem}
                                </ul>
                            </div>
                            {showEventImg &&
                            <div className="topicthurmbox">
                                <ul className="topicthurms" ref="showImgthurm">
                                    {eventImgsItem}
                                </ul>
                            </div>
                            }
                            <div className="topiceventbox">
                                <div className="topictxt">{showResult.content || "好玩瞬间内容"}</div>
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
                                        {share &&
                                        <div className="commentcountdiv">
                                            <span className="bgimg shareqicon"></span>
                                            <span className="teventnqnum">{showResult.transpond_count || null}</span>
                                        </div>
                                        }
                                        <div className="commentcountdiv" onClick={this.addComment.bind(this, showid)}>
                                            <i className="icon-comment-1 fz22 c-bbb"></i>
                                            <span className="teventnqnum">{commentLists.count || null}</span>
                                        </div>
                                        <div className="commentcountdiv">
                                            <div className="teventntnum" data-pk={pkid} data-id={showResult.id} onClick={this.liked.bind(this)} data-liked={praisesEd ? "1" : "0"}>
                                                <i ref={"likediele"} className={praisesEd ? "icon-heart fz20 c-red" : "icon-heart-empty fz20 c-bbb"}></i>
                                                <span className={praisesEd ? "teventnqnumred":"teventnqnum"} ref={"likedBoxref"}>{showResult.praise_count > 0 && showResult.praise_count || null}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {showComment &&
                            <div className="showcommentbox">
                                <div className="scommenthead">
                                    <a href={"#commentlist/"+ showResult.id + "/0"} className="morecomment">{'更多评论>'}</a>
                                    <div className="scommentnums">
                                        <span className="scommentxt">评论</span>
                                        <span className="scommentnum">{commentLists.count}</span>
                                        <span className="scommentxt">条</span>
                                    </div>
                                </div>
                                {commentmp}
                            </div>
                            }
                            {!showComment &&
                                <div className="nocommentbox">
                                    <div className="noctxt">好玩的活动更需要你的好玩点评，快来一吐为快！</div>
                                    <div className="login-btn login-tbtn login-btn-small" onClick={this.addComment.bind(this, showid)}>
                                        <span>发布评论</span>
                                    </div>
                                </div>
                            }
                        </div>
                    </section>
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
            var colordom = $(this.refs.likediele);
            var id = Jtarget.data("id");
            var liked = Jtarget.data("liked");
            var likedBox = $(this.refs.likedBoxref);
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
        followevent: function(e){
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
        changeImg(e){
            e.preventDefault();
            e.stopPropagation();
            var Jtarget = $(e.currentTarget);
            var Jbigdimg = $(this.refs.showdImgs);
            var Jbigdimgs = Jbigdimg.find('li');
            var index = Jtarget.data('index');
            var cbigdimg = Jbigdimgs.eq(index);
            cbigdimg.siblings().hide();
            cbigdimg.fadeIn();
            cindex = index;
        },
        addComment(id){
            Router.navigate('comment/'+ id + "/1")
        }
    });
    return ShowViewComponent;
})