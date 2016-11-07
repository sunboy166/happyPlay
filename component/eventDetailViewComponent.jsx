/**
 * Created by sqsun on 2015/9/22.
 */
define(['react', 'jsx!headerViewComponent', 'koala', 'Models', 'router', 'RESTF','underscore', 'Fn','$WX','Swiper', 'exif-js', 'react.backbone'], function(React, HeaderComp, Koala, Models, Router, RESTF, _, Fn, $wx, Swiper, EXIF) {
    var ModelRestf = RESTF.eventDetailModel.getInstance();
    var ModelFllow = RESTF.followsModel.getInstance();
    var Modelwxpay = RESTF.wxPayModel.getInstance();
    var eventpraise = RESTF.setEventpraise.getInstance();
    var deleteEventpraise = RESTF.deleteEventpraise.getInstance();
    var setShowpraise = RESTF.setShowpraise.getInstance();
    var deleteShowpraise = RESTF.deleteShowpraise.getInstance();
    var deletefollowsModel =  RESTF.deletefollowsModel.getInstance();
    var setEventCollection = RESTF.setEventCollection.getInstance();

    var ModelTopShows = RESTF.top_Dshows.getInstance();
    var ModelOtherShows = RESTF.other_Dshows.getInstance();

    var Toast = new Koala.kUI.Toast();
    var sinTD = 1;
    var sinTxt = '报名已开始';
    var sinED = 0;
    var eventid = 0;
    var mapKey = "OB4BZ-D4W3U-B7VVO-4PJWW-6TKDJ-WPB77";
    var mapReferer = "HappyPlay";

    var Gnurl = null;
    var elTop = 0;
    var elBox = null;
    var getMX = true;
    window.swiper = null;

    var EventDetailViewComponent = React.createBackboneClass({
        getInitialState: function() {
            return {
                up:1,
                show:false,
                $$doteId: window.setTimeout('1')
            };
        },
        componentDidMount: function(){
            $("#showmask").hide()
        },
        componentDidUpdate: function() {
            var state = this.state;
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
            if(window.swiper && window.swiper.destroy){
                window.swiper.destroy();
            }
            //setTimeout(function (){
                window.swiper = new Swiper('#sliderimg', {
                    paginationClickable: true,
                    autoplay: 3000,
                    autoplayDisableOnInteraction: false,
                    pagination: '#detail-imagedot' + state.$$doteId
                });
            //});
            var title = Fn.getAttr(this.props, 'model.attributes.title'),
                imgUrlList = Fn.getAttr(this.props, 'model.attributes.cover_image').split("||"),
                imgUrl = "http://ahappyapp.com/app/img/logo.jpg";
            if(imgUrlList.length > 0 ){
              imgUrl = imgUrlList[0].split("?")[0];
            }
            var shareContent = {
                    title: title,
                    desc: "在HAPPY好玩，玩出好生活",
                    link: window.location.href,
                    //imgUrl: 'http://7xpyh6.com1.z0.glb.clouddn.com/FkfoHbdmm25EXKGUJS5ncVd0DoII?imageView2/1/h/200/format/jpg',
                    //logo: 'http://ahappyapp.com/app/img/getheadimg.png',
                    imgUrl: imgUrl,
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
            if(title && this.$$lastTitle != title) {
                shareContent.desc = "我在HAPPY玩【"+ title +"】，玩出HAPPY好生活！";
                shareContent.title = '我正在玩【' + title + '】,好玩福利多，快来一起围观！';
                
                this.$$lastTitle = title;
                document.title = title + '-- 活动详情';
                //分享到朋友圈
                $wx.wxShare(shareContent);
            }
        },
        componentWillReceiveProps: function (nextProps) {
            sinED = 0;
            getMX = true;
            this.setState({up:1, show:false});
        },
        showbtn:function(){
            this.setState({show: true})
        },
        wxshareFn(){

        },
        commentbtnFn(){
            Router.navigate('#comment/'+eventid + '/0')
        },
        render: function() {
            var self = this;
            var btnsConf = this.props.btnsConf;
            var detailData = this.getModel().get();
            var userinfo = Models.userinfo.get();
            var toastObj =  Models.showToast.get();
            var isShowToast = false;
            if(toastObj && toastObj.isShow){
                isShowToast =true;
            }
            var cuserinfo = detailData.founder;
            var TopshowArr = detailData.TopshowArr;
            var showArr = detailData.showArr;
            Gnurl = showArr.nextPage;

            var showCount =detailData.showarr && detailData.showarr && detailData.showarr.length;
            var showItem = showArr[1] || [];
            var showFitem = showItem[0] || {};
            if(detailData.wodesunjianArr){//活动发布者的晒新的取数对象
                showFitem = detailData.wodesunjianArr[0] || {};
            }
            var detaTags = detailData.tags;
            var detaImgs = detailData.cover_image + '';
            var ufshowImg = showFitem.cover_image;
            var commentLists = detailData.commentData;
            var detaImgitem = {};
            var detaTagitem = {};
            var showFTagstmp = {}; //当前用户晒tag tmp
            var showitem = {};
            var userditem = {};
            var commentmp = {};
            var eventImgsItem = {};
            var showTags = false;
            var showFTags = false;
            var showComment = false;
            var showEventImg = false;
            var priceTmp = {};
            var scrollEv = this.getMoreEvent;

            if(!Gnurl){
                scrollEv = null;
            }

            if(ufshowImg){
                ufshowImg = ufshowImg.split('||');
            }else{
                ufshowImg = []
            }
            //是否显示关注按钮
            var isShowfllowe = true;
            if(userinfo && detailData.founder){
                if(userinfo.id == detailData.founder.id){
                    isShowfllowe =false;
                }
            }
            //获取活动时间
            var esDate = new Date(detailData.event_begin_time);
            var eeDate = new Date(detailData.event_end_time);
            var evDT = self.getYMD(esDate) + '-' + self.getYMD(eeDate, 'MMDD');
            var sinDT = self.GetRTime(esDate, eeDate);
            var nowDateTime = esDate.getFullYear();
            nowDateTime = nowDateTime + ((esDate.getMonth() + 1) < 10 ? "-0" + (esDate.getMonth() + 1) : "-" + (esDate.getMonth() + 1));
            nowDateTime = nowDateTime + (esDate.getDate() < 10 ? "-0" + esDate.getDate() : "-" + esDate.getDate());
            eventid = detailData.id;

            btnsConf.wxsharebtn = this.wxshareFn;
            btnsConf.commentbtn = this.commentbtnFn;
            btnsConf.shankeHandClick = this.shankeHandClick;

            //images
            detaImgs = detaImgs.split('||');
            if(detaImgs.length > 0){
                detaImgs.map(function(_src, k){
                    var _imgDom = <img className="hd" src={_src} width="100%" height="auto" alt=""/>;
                    if(_src) {
                        if (_src && _src.indexOf("url=") > 0) {
                            var _link = _src.substr(_src.indexOf("url=") + 4, _src.length);
                            if (_link) {
                                _imgDom = <a href={_link} onClick={self.imgOpen}><img className="hd" src={_src} width="100%" height="auto" alt=""/></a>;
                            }
                        }

                        detaImgitem[k] = <div className="swiper-slide">
                            <div className="img-auto-wrap img-auto-wrap2 rate100 w100 img-bg-auto-wrap" style={{
                                'background-image': 'url(' + _src + ')'
                            }}>
                                {_imgDom}
                            </div>
                        </div>;
                    }

                })
            }else{
                detaImgitem[0] = <div className="swiper-slide">
                                    <div className="img-auto-wrap img-auto-wrap2 rate100 w100">
                                        <img src="./testimg/pic.png" width="100%" height="auto" alt=""/>
                                    </div>
                                </div>;
            }

            ufshowImg.map(function (item, k) {
                if(item){
                    if(k > 1){
                        showEventImg = true;
                    }
                    eventImgsItem['eimg-' + k] = <li className="topicthurm">
                        <img src={item} data-id={showFitem.id} data-eventid={detailData.id} onClick={self.changeImg.bind(self)}/>
                    </li>
                }
            });


            //获取其它人的晒
//            var showAL = showArr.length;
           // var showOA = showArr.slice(2, showAL);
//            var showOL = 0;
            var newarry = [];
/*            if (showArr[0] && showArr[0].length > 0){
                newarry = newarry.concat(showArr[0]);
            }
            if(showOA && showOA.length){
                newarry = newarry.concat(showOA[0]);
            }*/
            if(showArr && showArr.length){
                for(var i in showArr){
                    if(showArr[i] && showArr[i].length){
                        newarry = newarry.concat(showArr[i]);
                    }
                }
            }


            //置顶的晒
            var FshowObj = {};
            var FshowNum = 0;
            if(TopshowArr && TopshowArr.length > 0){
                TopshowArr.map(function(Titem, index){
                    var FAimgs = $.trim(Titem.cover_image);
                    var fshowimgs = {};
                    var fshowimgnum = 0;
                    var fshowimgclass = "fshowimgs";
                    if(!Titem.praise_count){
                        Titem.praise_count=0;
                    }
                    if(!Titem.comment_count){
                        Titem.comment_count = 0;
                    }
                    var chotNum = parseInt(Titem.praise_count + Titem.comment_count);
                    //查询当前用户点赞状态
                    var cpraisesSEd = false;
                    var cpraisesed = Titem.praises || [];
                    cpraisesed.map(function(item, k){
                        var praUser = item.user;
                        if(praUser.id == userinfo.id){
                            cpraisesSEd = true;
                            return
                        }
                    });
                    if(FAimgs){
                        FAimgs = FAimgs.split("||").filter(function(v){
                            return !!v;
                        });
                        var FalimgsLength = FAimgs.length;
                        FAimgs.map(function (img, key) {
                            if(img && img !== 'null'){
                                fshowimgnum++;
                                var style = FalimgsLength < 2 ? null : {
                                    'background-image': 'url(' + img + ')'
                                };
                                fshowimgs[key] = <div className="fshowimg  js_img_wrap" data-img={img} style={style}>
                                    {FalimgsLength < 2 ? <img src={img} alt=""/> : null}
                                </div>
                            }
                        });
                    }
                    if(fshowimgnum < 2){
                        fshowimgclass = "fshowimgs onefimg"
                    }
                    var founderclass = "";
                    if(Titem.author.id == $(".ucenterimgbox").data("id")){
                      founderclass = "sh_title"
                    }
                    FshowObj[FshowNum] = <li className="scommentshows" data-id={Titem.id} >
                        <div className="showheader" data-id={Titem.author.id} onClick={self.toFuserCenter.bind(self)}>

                            <div className="thicon">
                                <img src={Titem.author.image || './testimg/icon.jpg'} alt=""/>
                            </div>
                            <div className="thtitle">
                                <span className={founderclass}>{Titem.author.full_name}</span>
                                {Titem.recommended &&
                                    <span className="topictag">推荐</span>
                                }
                                {!Titem.recommended &&
                                <span className="topictag hotg">热门</span>
                                }
                            </div>
                            <div className="thtime">{self.getYMD(Titem.updated_time)}</div>
                        </div>
                        <div className="showTexare" data-id={Titem.id}  onClick={self.showDetail.bind(self)}>
                            {Titem.content}
                        </div>
                        <div className={fshowimgclass} onClick={self.wximageView.bind(self)}>
                            {fshowimgs}
                        </div>
                        <div className="teventnbox" data-id={Titem.id} onClick={self.showDetail.bind(self)}>
                            {chotNum > 0 &&
                            <div className="teventnhot">
                                <span className="c-green">{chotNum}</span><span className="c-grey">条热度</span>
                            </div>
                            }
                            <div className="teventnotice">
                                <div className="commentcountdiv">
                                    <i className="icon-comment-1 fz22 c-bbb"></i>
                                    <span className="teventnqnum">{Titem.count || null}</span>
                                </div>
                                <div className="commentcountdiv">
                                    <div className="teventntnum" data-pk={Titem.id} data-id={Titem.id} onClick={self.sliked.bind(self)} data-liked={cpraisesSEd ? "1" : "0"}>
                                        <i ref={"likediele"} className={cpraisesSEd ? "icon-heart fz20 c-red" : "icon-heart-empty fz20 c-bbb"}></i>
                                        <span className={cpraisesSEd ? "teventnqnumred":"teventnqnum"} ref={"likedBoxref"}>{Titem.praise_count > 0 && Titem.praise_count}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </li>;
                    FshowNum++
                })
            }

            //其它人的晒
            var showArrs = showArr.showArrs;
            if(showArrs && showArrs.length > 0){
                showArrs.map(function (Sitem, key) {
                    var oFAimgs = $.trim(Sitem.cover_image);
                    var ofshowimgs = {};
                    var ofshowimgnum = 0;
                    var ofshowimgclass = "fshowimgs";

                    var founderclass = "";
                    if(Sitem.author.id == $(".ucenterimgbox").data("id")){
                      founderclass = "sh_title"
                    }

                    if(!Sitem.praise_count){
                        Sitem.praise_count=0;
                    }
                    if(!Sitem.comment_count){
                        Sitem.comment_count = 0;
                    }
                    var ohotNum = parseInt(Sitem.praise_count + Sitem.comment_count);
                    //查询当前用户点赞状态
                    var opraisesSEd = false;
                    var opraisesed = Sitem.praises || [];
                    opraisesed.map(function(item, k){
                        var praUser = item.user;
                        if(praUser.id == userinfo.id){
                            opraisesSEd = true;
                            return
                        }
                    });
                    if(oFAimgs){
                        oFAimgs = oFAimgs.split("||").filter(function(v){
                            return !!v;
                        });
                        var oFaligmLength = oFAimgs.length;
                        oFAimgs.map(function (img, key) {
                            var style = oFaligmLength < 2 ? null : {
                                'background-image': 'url(' + img + ')'
                            };
                            if(img){
                                ofshowimgnum++;
                                ofshowimgs[key] = <div className="fshowimg js_img_wrap" data-img={img} style={style}>
                                    {oFaligmLength < 2 ? <img src={img} /> : null}
                                </div>
                            }
                        });
                    }
                    if(ofshowimgnum < 2){
                        ofshowimgclass = "fshowimgs onefimg"
                    }
                    FshowObj[FshowNum] = <li className="scommentshows bgdefault" data-id={Sitem.id} >
                        <div className="showheader" data-id={Sitem.author.id} onClick={self.toFuserCenter.bind(self)}>
                            <div className="thicon" >
                                <img src={Sitem.author.image || './testimg/icon.jpg'} alt=""/>
                            </div>
                            <div className="thtitle">
                                <span className={founderclass}>{Sitem.author.full_name}</span>
                            </div>
                            <div className="thtime">{self.getYMD(Sitem.updated_time)}</div>
                        </div>
                        <div className="showTexare" data-id={Sitem.id} onClick={self.showDetail.bind(self)}>
                            {Sitem.content}
                        </div>
                        <div className={ofshowimgclass} onClick={self.wximageView.bind(self)}>
                            {ofshowimgs}
                        </div>
                        <div className="teventnbox">
                            {ohotNum > 0 &&
                            <div className="teventnhot">
                                <span className="c-green">{ohotNum}</span><span className="c-grey">条热度</span>
                            </div>
                            }
                            <div className="teventnotice" data-id={Sitem.id} onClick={self.showDetail.bind(self)}>
                                <div className="commentcountdiv">
                                    <i className="icon-comment-1 fz22 c-bbb"></i>
                                    <span className="teventnqnum">{Sitem.comment_count || null}</span>
                                </div>
                                <div className="commentcountdiv">
                                    <div className="teventntnum" data-pk={Sitem.id} data-id={Sitem.id} onClick={self.sliked.bind(self)} data-liked={opraisesSEd ? "1" : "0"}>
                                        <i ref={"likediele"} className={opraisesSEd ? "icon-heart fz20 c-red" : "icon-heart-empty fz20 c-bbb"}></i>
                                        <span className={opraisesSEd ? "teventnqnumred":"teventnqnum"} ref={"likedBoxref"}>{Sitem.praise_count > 0 && Sitem.praise_count || null}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </li>;
                    FshowNum++;
                })
            }

            if(newarry.length){
                newarry.sort(function(a,b){
                    var a_dt =  new  Date(a.created_time).getTime();
                    var b_dt =  new  Date(b.created_time).getTime();
                    return a_dt > b_dt ? 0:1;
                });
                if(newarry.length > 9){
                    newarry.length = 9;//借调多的部分，只显示9张图
                }
                newarry.map(function(item, k) {
                    if($.trim(item.cover_image)){
                        var showimgs = item.cover_image.split('||');
                        showimgs.map(function(img){
                            if(img){
                                showitem[k] = <li className="detail-ilist" data-id={item.id} onClick={self.showDetail.bind(self)}><img src={img + '?imageMogr2/format/jpg'} alt=""/></li>;
                            }
                        })
                    } else {
                        showitem[k] = <li className="detail-ilist" data-id={item.id} onClick={self.showDetail.bind(self)}><div style={{height: "136px",
    "text-align": "center",
    "line-height": "136px",
    "background-color": "#00c85a",
    "color": "#fff"
    }}>{item.content}</div></li>;
                    }
                });
            }

            //tags
            detaTags.map(function(item, k){
                showTags = true;
                item = "#" + item.name;
                detaTagitem[k] = <span className="detail-dtag">{item}</span>;
            });

            //当前活动用户晒tags
            detaTags.map(function(item, k){
                showFTags = true;
                item = "#" + item.name;
                showFTagstmp[k] = <span className="detail-dtag">{item}</span>;
            });

            //获取用户报名
            var useredArr = detailData.participants || [];
            useredArr.map(function(item, k){
                var userItem = item.user || {};
                if(userItem.id && userItem.id == userinfo.id){
                    sinTD = 2;
                }
                userditem[k] = <div className="detail-iuicon" data-uid={userItem.id} onClick={self.navUser.bind(self)}>
                                   <img src={userItem.image || 'https://www.uedsc.com/wp-content/uploads/2015/08/user-128.png'} width="66px" height="66px" alt=""/>
                               </div>
            });

            //获取地址
            var addressJson = detailData.address || {};
            var address = addressJson.name || '中国上海';

            //commnet
            var top_5_comment = commentLists.results.slice(0, 5);
            top_5_comment.map(function(citem, index){
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
                                            <div className="thicon" data-id={ruser.id} onClick={self.toFuserCenter.bind(self)}>
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
                        <div className="thicon" data-id={userinfo.id} onClick={self.toFuserCenter.bind(self)}>
                            <img src={userinfo.image || "./testimg/icon.jpg"} alt=""/>
                        </div>
                        <div className="ucomment">
                            <div className="username">{userinfo.full_name}</div>
                            <div className="ucommenttxt">
                                {citem.content}
                            </div>
                            <div className="commentdatebox">
                                <span className="commentimer">{nowDateTime}</span>
                                <a href={"#comment/"+ detailData.id +"/r/" + citem.id + "/0"} className="recomment">回复</a>
                            </div>
                        </div>
                    </div>
                    {reCommentmp}
                </div>
            });

            //获取价格
            if(parseFloat(detailData.ticket_amount) > 0){
                priceTmp[0] = <div className="detail-navprice">
                                    <span className="detail-navdot">￥</span>
                                    <span className="detail-navpnum">{detailData.ticket_amount}</span>
                                    <span className="detail-navdot">元</span>
                                </div>
            }else{
                priceTmp[0] = <div className="detail-navprice">
                                <span className="detail-navpnum ndetailprice">免费</span>
                            </div>
            }

            //查询当前用户点赞状态
            var praisesEd = false;
            var pkid = 0;
            detailData.praises.map(function(item, k){
                var praUser = item.user;
                if(praUser.id == userinfo.id){
                    praisesEd = true;
                    pkid = item.id;
                    return
                }
            });

            //查询当前用户点赞晒状态
            var praisesSEd = false;
            var spkid = 0;
            if(showFitem.praises){
                showFitem.praises.map(function(item, k){
                    var praUser = item.user;
                    if(praUser.id == userinfo.id){
                        praisesSEd = true;
                        spkid = item.id;
                        return
                    }
                });
            }

            //查询热度

            var hotNum = 0;
            if(showFitem){
              if(!showFitem.praise_count){
                  showFitem.praise_count=0;
              }
                if(!showFitem.comment_count){
                    showFitem.comment_count = 0;
                }
                 hotNum = parseInt(showFitem.praise_count + showFitem.comment_count);
            }
            //查询当前用户收藏状态
            var collectionsEd = false;
            detailData.collections.map(function(item, k){
                var praUser = item.user;
                if(praUser.id == userinfo.id){
                    collectionsEd = true;
                    return
                }
            });
            var wodeshai = "";

            {/*if(sinTxt == '报名已开始'){
                wodeshai =  <div className="topic-head">
                    <div className="thicon" data-id={detailData.founder.id} onClick={self.toFuserCenter.bind(self)}>
                        <img src={detailData.founder.image || './testimg/icon.jpg'} alt=""/>
                    </div>
                    <div className="thtitle">{detailData.founder.full_name}</div>
                    <div className="thtime">{nowDateTime}</div>
                    <div className="fllowicn" data-fllowed={detailData.founder.follow_id} data-founder={detailData.founder.id} onClick={self.followevent.bind(self)}>
                        {isShowfllowe &&
                        <i className={detailData.founder.follow_id ? "icon-attention-ed c-green":"icon-attention c-green"} ref={"fllownode"}></i>
                        }
                    </div>
                    <div className="view_current_show">
                        <a href={"#showlist/" + eventid + "?sitm=1"} className="c-333">查看<span className="c-green">{detailData.founder.nick_name || detailData.founder.full_name}</span>的全部好玩瞬间</a></div>
                </div>
            }else {*/}
                wodeshai = ufshowImg && ufshowImg.length && (
                        <div className="topicstartbox">
                <div className="topic-head ctopichead">
                    <div className="topic-headtxt c-666">活动直播</div>
                    <div className="evetarow-up" onClick={self.evecToggle.bind(self)}>
                        <div></div>
                    </div>
                </div>
                <div className="topicBoxwrap" ref="topicBoxwrap">
                {ufshowImg[0] &&
                <div className="sp-lit-pic img-auto-wrap img-auto-wrap2 img-bg-auto-wrap rate100" style={{'background-image': 'url(' + ufshowImg[0] + '?imageMogr2/format/jpg)'}}>
                    <img className="hd" src={ufshowImg[0] + '?imageMogr2/format/jpg' || './testimg/pic.png'} width="100%" alt=""
                         ref={"bigimg_" + detailData.id} data-id={showFitem.id} onClick={self.showDetail.bind(self)}/>
                                <span className="sp-lit-fav dn" data-fav={collectionsEd ? "1" : "0"} data-id={detailData.id} onClick={self.favEvent.bind(self)}>
                                    <i className={"icon-start-full " + (collectionsEd ? "c-green": "")}></i>
                                </span>
                </div>
                }
                {showEventImg &&
                <div className="topicthurmbox">
                    <ul className="topicthurms">
                        {eventImgsItem}
                    </ul>
                </div>
                }
                <div className="topiceventbox">
                    <div className="topictxt">{showFitem.content || "好玩瞬间内容"}</div>
                    {showFTags &&
                    <div className="teventags">
                        {showFTagstmp}
                    </div>
                    }
                    <div className="teventnbox">
                        <div className="teventnhot">
                            <span className="c-green">{hotNum}</span><span className="c-grey">条热度</span>
                        </div>
                        <div className="teventnotice">
                            <div className="commentcountdiv" data-id={showFitem.id} onClick={self.showDetail.bind(self)}>
                                <i className="icon-comment-1 fz22 c-bbb"></i>
                                <span className="teventnqnum">{showFitem.comment_count || null}</span>
                            </div>
                            <div className="commentcountdiv">
                                <div className="teventntnum" data-pk={spkid} data-id={showFitem.id} onClick={self.sliked.bind(self)} data-liked={praisesSEd ? "1" : "0"}>
                                    <i ref={"likedsiele"} className={praisesSEd ? "icon-heart fz20 c-red" : "icon-heart-empty fz20 c-bbb"}></i>
                                    <span className={praisesSEd ? "teventnqnumred":"teventnqnum"} ref={"likedSBoxref"}>{showFitem.praise_count > 0 && showFitem.praise_count || null}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                 <div className="view_current_show "><a href={"#showlist/" + eventid + "?sitm=1"} className="c-333"><p className="c-green">查看所有直播</p></a></div>
                </div>
            </div>) || null;
            {/*}*/}
            var huodongjieshao ="";
            var openclass = "detail-infoboxswarp";
            var openhclass = "evetarow-up";
            if(sinTxt == "已结束"){
                openclass = "detail-infoboxswarp none";
                openhclass = "evetarow-down";
            }
            if(!huodongjieshao){
                huodongjieshao =  <div className="detail-inbox hdetail-inbox">
                    <div className ="evetinfomation">
                        <div className="c-666">活动指南</div>
                        {sinTxt == "报名已开始" &&
                        <div className="evetctip">即将开启</div>
                        }
                        {sinTxt == "进行中" &&
                        <div className="evetctip ethot">火热进行中</div>
                        }
                        {sinTxt == "已结束" &&
                        <div className="evetctip etend">已结束</div>
                        }
                        <div className={openhclass} onClick={self.eveToggle.bind(self)}>
                            <div></div>
                        </div>
                    </div>
                    <div className={openclass} ref="evetBoxwrap">
                        <div className="detail-infoboxs">
                            <h2 className="detail-ih" onClick={self.yybtn.bind(self, detailData.id, detailData.title)}>{detailData.event_notice_title || '活动标题'}</h2>
                            <p className="detail-itxt"  dangerouslySetInnerHTML = {{__html:(detailData.event_notice || '').replace(/(?:\r\n|\r|\n)/g, '<br />')}}></p>
                            <h2 className="detail-ih" onClick={self.yybtn.bind(self, detailData.id, detailData.title)}>{detailData.card_notice_title || '卡券活动'}</h2>
                            <p className="detail-itxt"  dangerouslySetInnerHTML = {{__html:(detailData.card_notice || "").replace(/(?:\r\n|\r|\n)/g, '<br />')}}></p>
                        </div>
                        <div className="detail-citem">
                            <div className="detail-item">
                                <div className="detail-icon-wrap">
                                    <i className="icon-calendar"></i>
                                </div>
                                <div className="detial-ibox pr82">{evDT}</div>
                            </div>
                        </div>
                        {sinTD == 1 && sinDT &&
                        <div className="detail-citem">
                            <div className="detail-item">
                                <div className="detail-icon-wrap">
                                    <i className="icon-lock"></i>
                                </div>
                                <div className="detial-ibox ditend">{sinDT}</div>
                            </div>
                        </div>
                        }
                        <div className="detail-citem">
                            <div className="detail-item" onClick={self.popMap.bind(self, null)}>
                                <div className="detail-icon-wrap">
                                    <i className="icon-location"></i>
                                </div>
                                <div className="detial-ibox">
                                    <div className="detail-iadname">{addressJson.country + addressJson.city}</div>
                                    <div className="detail-iadress">{address}</div>
                                </div>
                            </div>
                        </div>

                        {detailData.content && <div className="detail-infobox" dangerouslySetInnerHTML = {{__html: (detailData.content || "").replace(/(?:\r\n|\r|\n)/g, '<br />')}}>
                        </div>}
                        <div className={"view_current_show " + (detailData.link ? "": "dn")}>
                            <a href={detailData.link}  className="c-333"><p className="c-green">查看图文详情</p></a></div>
                    </div>
                </div>
            }

            //大家晒
            var dajiashai ="";
            if(FshowNum > 0){
                dajiashai = <div className="detail-iushows">
                    <div className="scommenthead eventshow">
                        <a className="morecomment dreload"  onClick={self.reloadShows.bind(self, {id: eventid, uid: userinfo.id})}>刷新</a>
                        <div className="scommentnums">
                            <span className="scommentxt">好玩瞬间</span>
                        </div>
                    </div>
                    <ul className="showitems">
                        {FshowObj}
                    </ul>

                </div>
            }

            //已报名
            var yibaoming ="";
            if(useredArr.length > 0){
                yibaoming =  <div className="detail-inuser">
                    <div className="detail-iuserhead">
                        <div className="detail-iusermore" onClick={this.viewAllSignUser.bind(null)}>查看全部</div>
                        <span className="scommentxt">已报名</span>
                        <span className="scommentnum">{useredArr.length}</span>
                        <span className="scommentxt">人</span>
                    </div>
                    <div className="detail-iusericon">
                        {userditem}
                    </div>
                </div>
            }

            //活动标题行
            var huodongbiaoti ="";
            if(!huodongbiaoti){
                huodongbiaoti = <div className="detial-header">
                    <div className="detail-htbox tabs tabs-center">
                        <div className="detail-htitle  ">{detailData.title}</div>
                        <div className="detail-hlike no-fixed">
                            <div className="detail-hlikebox">
                                <div className="teventntnum" data-pk={pkid} data-id={detailData.id} onClick={self.liked.bind(self)} data-liked={praisesEd ? "1" : "0"}>
                                    <i ref={"likediele"} className={praisesEd ? "icon-heart fz20 c-red" : "icon-heart-empty fz20 c-bbb"}></i>
                                    <span className={praisesEd ? "teventnqnumred":"teventnqnum"} ref={"likedBoxref"}>{detailData.praise_count > 0 && detailData.praise_count || null}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    {showTags &&
                    <div className="detail-dtags overhidden">
                        {detaTagitem}
                    </div>
                    }
                </div>
            }

            //头部图片
            var toubuhuodongtupian ="",
                state = this.state;
            if(!toubuhuodongtupian){
                toubuhuodongtupian = <div className="detail-images">
                    <div id="sliderimg" className="swipebox swiper-container">
                        <div className="swipe-wrap swiper-wrapper">
                            {detaImgitem}
                        </div>
                    </div>
                    <div className="detail-imagebtn" id={"detail-imagedot" + state.$$doteId}></div>
                    <div className="detail-slikebox">
                        <div className="teventntnum" data-pk={pkid} data-id={detailData.id} onClick={self.liked.bind(self)} data-liked={praisesEd ? "1" : "0"}>
                            <i ref={"likediele"} className={praisesEd ? "icon-heart fz20 c-red" : "icon-heart-empty fz20 c-bbb"}></i>
                        </div>
                    </div>
                </div>
            }

            //显示评论
            var pinglun ="";
            if(showComment){
                pinglun = <div className="showcommentbox">
                    <div className="scommenthead">
                        <a href={"#commentlist/"+ detailData.id + "/1"} className="morecomment">{'更多评论>'}</a>
                        {commentLists.count > 0 &&
                        <div className="scommentnums">
                            <span className="scommentxt">评论</span>
                            <span className="scommentnum">{commentLists.count}</span>
                            <span className="scommentxt">条</span>
                        </div>
                        }
                    </div>
                    {commentmp}
                </div>
            }else{
                pinglun = <div className="nocommentbox">
                    <div className="noctxt">暂时还没有用户发评论</div>
                    <div className="login-btn login-tbtn" onClick={self.addComment.bind(self, eventid)}>
                        <span>发布评论</span>
                    </div>
                </div>
            }

            var _one ="";
            var _two = "";
            var _there ="";
            var _four = "";
            var _five ="";
            if(sinTxt == "报名已开始"){
                //报名中不显示我的晒
                _one = wodeshai;
                _two = huodongjieshao;
                _there = yibaoming;
                _four = dajiashai;
                _five = pinglun;
            }else if(sinTxt == "进行中"){
                _one = wodeshai;
                _two = huodongjieshao;
                _there = dajiashai;
                _four = yibaoming;
                _five = pinglun;
            }else if(sinTxt == "已结束"){
                /*_one = wodeshai;
                _two = dajiashai;
                _there = yibaoming;
                _four = huodongjieshao;
                _five = pinglun;*/
                _one = wodeshai;
                _two = huodongjieshao;
                _there = dajiashai;
                _four = yibaoming;
                _five = pinglun;
            }


            var fllowClass = 'icon-attention fz30 pos_center c-green';
            if(detailData.founder && detailData.founder.follower){
                fllowClass = 'icon-attention-ed fz30 pos_center c-green'
            }


            return (
                <section className="flex view-warp evd-viewbox">
                    {isShowToast && detailData && detailData.topBroadCost &&
                        <div className="topnoticebox" id="topnotice_box">
                            <div className="tnoticec">
                                <a className="noticelink" data-id={detailData.topBroadCost.id} href={detailData.topBroadCost.url}>{detailData.topBroadCost.content}</a>
                            </div>
                            <div className="tnoticeclose" onClick={this.noticeClose.bind(this)}></div>
                        </div>
                    }
                    <HeaderComp btnsConf={btnsConf} title={this.props.title} id={detailData.id} headClass="comp-header-transparent"/>
                    <section className="comp-content detailc com-content-mt51" onScroll={scrollEv}>
                        <div className="edetailmain">
                            {toubuhuodongtupian}
                            <div className="euserbox">
                                <div className="ucenteribox">
                                    {userinfo.id !== cuserinfo.id &&
                                        <div className="user-select-wrap" data-fllowed={detailData.founder.follow_id} data-founder={detailData.founder.id} onClick={this.followevent.bind(this)}>
                                            <i className="icon-attention fz30 pos_center c-green" ref="fllownode"></i>
                                        </div>
                                    }

                                    <div className="ucenterimgbox" data-id={cuserinfo.id} onClick={self.toFuserCenter.bind(self)}>
                                        <img src={cuserinfo.image || ""} width="233px" height="auto" alt=""/>
                                    </div>
                                    {userinfo.id !== cuserinfo.id &&
                                    <div className="ucenterimbtn-wrap" data-id={cuserinfo.id} onClick={this.talkcall.bind(this, detailData.QRCodes)}>
                                        <span className="bgimg ucentermbtn"></span>
                                    </div>
                                    }
                                </div>
                                <div className="ucenterinfobox">
                                    <div className="ucentername">
                                        <span className="ucname c-999">{cuserinfo.full_name || '未设置昵称'}</span>
                                        <span className="ucvify"></span>
                                    </div>
                                    <div className="ucentersig">{userinfo.remark}</div>
                                </div>
                                <div className="flex ucenterctr">
                                    <div className="ucrow" onClick={this.viewAllSignUser.bind(null)}>
                                        <div className="ucrnum c-333">{detailData.participant_count || 1}</div>
                                        <div className="ucrlabel">参与玩家</div>
                                    </div>
                                    <div className="ucrow">
                                        <div className="ucrnum c-333">{detailData.praise_count || 0}</div>
                                        <div className="ucrlabel">赞</div>
                                    </div>
                                    <div className="ucrow">
                                        <div className="ucrnum c-333">{showCount || 0}</div>
                                        <div className="ucrlabel" onClick={this.gotoUserShowClick.bind(this)}>活动瞬间</div>
                                    </div>
                                </div>
                            </div>

                            <div className="detailiconlist dn">
                                <ul className="tabs">
                                    <li>
                                        <div className="center">
                                            <div className="detailicondiv">
                                                <i className="icon-play-1 pos_center"></i>
                                            </div>
                                            <div className="detail-tags-description"><span className="fontgreey">50</span>好玩</div>
                                        </div>
                                    </li>
                                    <li>
                                        <a className="c-666 tdn" href={"#/shake/" + detailData.id}>
                                            <div className="center">
                                                <div className="detailicondiv">
                                                    <i className="icon-shake pos_center"></i>
                                                </div>
                                                <div className="detail-tags-description">
                                                    <span>摇一摇</span>
                                                </div>
                                            </div>
                                        </a>
                                    </li>
                                    <li>
                                        <div className="center">
                                            <div className="detailicondiv">
                                                <i className="icon-ticket pos_center"></i>
                                            </div>
                                            <div className="detail-tags-description">
                                                <span className="fontgreey">2</span>张可领
                                            </div>
                                        </div>
                                    </li>
                                    <li>
                                        <div className="center">
                                            <div className="detailicondiv">
                                                <i className="icon-click pos_center"></i>
                                            </div>
                                            <div className="detail-tags-description">
                                                <span className="fontgreey">{useredArr.length}</span>人报名
                                            </div>
                                        </div>
                                    </li>
                                    <li>
                                        <div className="center">
                                            <div className="detailicondiv">
                                                <i className="icon-photo pos_center"></i>
                                            </div>
                                            <div className="detail-tags-description">
                                                <span className="fontgreey">16</span>个瞬间
                                            </div>
                                        </div>
                                    </li>
                                </ul>
                            </div>
                            {huodongjieshao}
                            {wodeshai}
                            {dajiashai}
                        </div>
                        {/*_five*/}
                    <div className="eventDpicbox none">
                        {/*start: 卡券相关内容*/}
                        <div className="ithaca-wrap">
                            {this.renderCard()}
                        </div>
                        {/*end: 卡券相关内容*/}
                    </div>
                    </section>
                    <div className="detailnavfixe none">
                    <div className="detail-navbottom">
                        {priceTmp}
                        {sinTD == 2 &&
                        <div className="detail-navbutton">已报名</div>
                        }
                        {sinTD == 0 &&
                        <div className="detail-navbutton">活动已结束</div>
                        }
                        {sinTD == 1 &&
                        <div className="detail-navbutton" onClick={this.csubmit.bind(this)}>报名</div>
                        }
                    </div>
                    </div>
                    <div className="cui-mask icodebox" id="showmask">
                        <div className="bgimg icodeclose" onClick={this.cboxclose.bind(this)}></div>
                        <div className="showbtns">
                            <div className="login-btn login-tbtn login-btn-small">
                                <a className="ticon icon-picture c-fff pos_center" href={"#graphic/detail/edit/" +eventid + "?show=true" }>发布瞬间</a>
                                <input className="pblish-photo dn" data-type="show" type="file" capture="camera" onChange={this.camPhoto.bind(this)} accept="image/*"/>
                            </div>
                            <div className="login-btn login-btn-small">
                                <a className="ticon icon-photo c-green pos_center" href={"#graphic/detail/edit/" +eventid}>贴纸/相框</a>
                                <input className="pblish-photo" type="file" onChange={this.camPhoto.bind(this)} accept="image/*"/>
                            </div>
                        </div>
                    </div>
                    <div className="showadd_pbtn showadd_pbtn_fixed none" onClick={self.yybtn.bind(self, detailData.id, detailData.title)}>
                        <i className="icon-picture pos_center"></i>
                    </div>

                    <div className="showadd_ybtn showadd_pbtn_fixed" onClick={self.yybtn.bind(self, detailData.id, detailData.title)}></div>
                    <div id="talkmaskbox" className="none">
                        <div className="cui-mask icodebox">
                            <div className="ui-happy-qrcode-wrap">
                                <p className="fz18">微信登录</p>
                                <div className="bgimg icodeclose" onClick={this.ctboxclose.bind(this)}></div>
                                <div >
                                    <img width="200" height="200" ref="QRCodesImg" />
                                </div>
                                <p className="ui-happy-qrcode-text">请打开微信扫描二维码登录HAPPY</p>
                            </div>
                        </div>
                    </div>
                </section>
            );
        },
        talkcall(QRCodes){
            var QRCodesImg = this.refs.QRCodesImg;
            QRCodesImg.setAttribute('src', QRCodes);
            $('#talkmaskbox').show();
        },
        ctboxclose(){
            $('#talkmaskbox').hide();
        },
        yybtn(id, title){
            var userinfo = Models.userinfo.get() || {};
            if(!userinfo.id){
                Toast.show({
                    Content: '您暂未登录，请登录后再来报名',
                    callBack: function(){
                        //window.location.href = '#login';
                        Router.navigate('login');//navigate跳转可以保留之前url地址
                    }
                });
                return
            }
            debugger
            Router.navigate("shake/" + id + "?et=" + title);
        },
        //退出登录
        logOut(){
            Models.userinfo.clear();
        },
        navUser(e){
            var Jtarget = $(e.currentTarget);
            var uid = Jtarget.data('uid');
            Router.navigate('fuser/' + uid);
        },
        camPhoto(e){
            var self = this;
            var userinfo = Models.userinfo.get() || {};
            if(!userinfo.id){
                Toast.show({
                    Content: '您暂未登录，请登录后再来报名',
                    callBack: function(){
                        //window.location.href = '#login';
                        Router.navigate('login');//navigate跳转可以保留之前url地址
                    }
                });
                return
            }
            var _this = e.currentTarget;
            var src = _this.files;
            var reader = new FileReader();
            if(src[0]){
                EXIF.getData(src[0], function() {
                    // alert(EXIF.pretty(this));
                    EXIF.getAllTags(this);
                    //alert(EXIF.getTag(this, 'Orientation'));
                    window.Orientation = EXIF.getTag(this, 'Orientation');
                    //alert(window.Orientation)
                    //return;
                });
                reader.readAsDataURL(src[0]);
                reader.onload = function(e){
                    self.compressImg(this.result, function(data){
                        Models.showimgbase.set(data);
                        var url = "graphic/detail/edit/" + eventid + ( _this.dataset['type'] === 'show' ? "?show=true" : "" );
                        Router.navigate(url);
                    })
                }
            }
        },
        compressImg(date, callback){
            var img = new Image();
            img.onload = function () {
                var that = this;
                //生成比例
                var w = that.width,
                    h = that.height,
                    scale = w / h;
                w = w;              //480  你想压缩到多大，改这里
                h = w / scale;
                //生成canvas
                var canvas = document.createElement('canvas');
                var ctx = canvas.getContext('2d');
                $(canvas).attr({width : w, height : h});
                ctx.drawImage(that, 0, 0, w, h);
                var base64 = canvas.toDataURL('image/jpeg', 0.9 || 0.9 );   //1最清晰，越低越模糊
                img = canvas = null;
                if(callback){
                    return callback(base64)
                }else{
                    return base64;
                }
            }
            img.src = date;
        },
        gifBack(id){
            Router.navigate('gif/'+ id)
        },
        cboxclose(){
            $("#showmask").hide()
        },
        sliked(e){
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
            var colordom = Jtarget.find("i");
            var id = Jtarget.data("id");
            var liked = Jtarget.data("liked");
            var likedBox = Jtarget.find("span");
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
                });
                return
            }

            var Jtarget = $(e.currentTarget);
            var colordom = $(this.refs.likediele);
            var id = Jtarget.data("id");
            var liked = Jtarget.data("liked");
            var likedBox = $(this.refs.likedBoxref);
            var likedNum = likedBox.text();
            if(liked == 0){
                eventpraise.setParam({event: id, user: userinfo.id}).execute().then(function(data){
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
                        Jtarget.find("i").removeClass('icon-heart-empty').removeClass('c-bbb').addClass('icon-heart').addClass('c-red');
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
                deleteEventpraise.setParam({id: pkid}).execute().then(function(data){
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
                        Jtarget.find("i").removeClass('icon-heart').removeClass('c-red').addClass('icon-heart-empty').addClass('c-bbb');
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
        followevent(e){
            var Jtarget = $(e.currentTarget);
            var founder = Jtarget.data("founder");
            var fllowed = Jtarget.data("fllowed");
            var fllownode = $(this.refs.fllownode);
            var userinfo = Models.userinfo.get();
            if(!userinfo.id){
                Toast.show({
                    Content: '您暂未登录，请登录后再来关注',
                    callBack: function(){
                        Router.navigate("login");
                    }
                });
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
                        fllownode.removeClass('icon-attention').addClass('icon-attention-ed');
                        fllownode.parent().addClass("user-select-attention-ed");
                        Jtarget.data("fllowed",data.id);
                    }
                },function(){
                    Toast.show({
                        Content: '网络不给力啊，请稍后再试'
                    })
                }).catch(function(e){
                    console.log(e)
                });
            }else{
                deletefollowsModel.setParam({id:fllowed}).execute().then(function(data){
                    if(data && data.non_field_errors){
                        Toast.show({
                            Content: data.non_field_errors || '取消关注用户失败'
                        })
                    }else{
                        fllownode.removeClass('icon-attention-ed').addClass('icon-attention');
                        fllownode.parent().removeClass("user-select-attention-ed");
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
        csubmit(){
            var userinfo = Models.userinfo.get();
            if(!userinfo.id){
                Toast.show({
                    Content: '您暂未登录，请登录后再来报名',
                    callBack: function(){
                        window.location.href = '#login';
                    }
                })
                return
            }
            var self = this;
            var dataModel = self.getModel().get();
            //先调起微信支付
            if(dataModel.ticket_amount > 0){
                var wxbrower = self.isWeixn();
                if(!wxbrower){
                    Toast.show({
                        Content: '请在微信中支付，谢谢！'
                    });
                    return
                }
                Modelwxpay.setParam(
                    {   event: dataModel.id,
                        user: userinfo.id,
                        ticket_count: 1
                    }).execute().then(function(data){
                    if(data && data.non_field_errors){
                        Toast.show({
                            Content: data.non_field_errors || '发起微信付款失败，请稍后再试'
                        })
                    }else{
                        if(typeof WeixinJSBridge === undefined){
                            Toast.show({
                                Content: '请在微信中支付，谢谢！'
                            });
                            return
                        }else{
                            WeixinJSBridge.invoke('getBrandWCPayRequest', data ,function(res){
                                switch (res.err_msg){
                                    case 'get_brand_wcpay_request:cancel':
                                        break;
                                    case 'get_brand_wcpay_request:fail':
                                        Toast.show({
                                            Content: '微信支付失败，请稍后再试'
                                        })
                                        break;
                                    case 'get_brand_wcpay_request:ok':
                                        //报名
                                        ModelRestf.setParam(
                                            {event: dataModel.id,
                                                user: userinfo.id,
                                                payment_amount: dataModel.payment_amount || 0,
                                                ticket_count: dataModel.ticket_count || 0
                                            }).execute().then(function(data){
                                            if(data && data.non_field_errors){
                                                Toast.show({
                                                    Content: data.non_field_errors || '报名失败，请稍后再试'
                                                })
                                            }else{
                                                Toast.show({
                                                    Content: '恭喜你，报名成功'
                                                });
                                                sinED = 1;
                                                self.setState({up:0});
                                            }
                                        },function(){
                                            Toast.show({
                                                Content: '网络不给力啊，请稍后再试'
                                            })
                                        }).catch(function(e){
                                            console.log(e)
                                        });
                                        break;
                                }
                            });
                        }
                    }
                },function(){
                    Toast.show({
                        Content: '网络不给力啊，请稍后再试'
                    })
                }).catch(function(e){
                    console.log(e)
                });
            }else{
                //报名
                ModelRestf.setParam(
                    {event: dataModel.id,
                        user: userinfo.id,
                        payment_amount: dataModel.payment_amount || 0,
                        ticket_count: dataModel.ticket_count || 0
                    }).execute().then(function(data){
                    if(data && data.non_field_errors){
                        Toast.show({
                            Content: data.non_field_errors || '报名失败，请稍后再试'
                        })
                    }else{
                        Toast.show({
                            Content: '恭喜你，报名成功'
                        });
                        sinED = 1;
                        self.setState({up:0});
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
            data = data || new Date();
            data = new Date(data);
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
            if(sinED){
                sinTD = 2;
            }
            if(t < 0 && e > 0){
                sinTD = 1;
                sinTxt = '进行中';
                d=Math.floor(e/1000/60/60/24);
                h=Math.floor(e/1000/60/60%24);
                if(d>0){
                    if(h>0){
                        return '距报名结束还剩' + d + '天' + h +  '小时';
                    }else {
                        return '距报名结束还剩' + d + '天';
                    }
                }else{
                    var _minute = Math.floor(e/1000/60);
                    if(h>0){
                        if(_minute > 0){
                            return '距报名结束还剩' + h +  '小时' + _minute + '分';
                        }else {
                            return '距报名结束还剩' + h +  '小时';
                        }
                    }else{
                        var _second = Math.floor(e/1000);
                        if(_minute > 0){
                            if(_second > 0){
                                return '距报名结束还剩' + _minute +  '分' + _second + '秒';
                            }else{
                                return '距报名结束还剩' + _minute +  '分';
                            }
                        }else{
                            return '距报名结束还剩' + _second +  '秒';
                        }
                    }
                }

            }else if(e < 0){
                sinTxt = '已结束';
                sinTD = 0;
            }else if(t > 0){
                sinTD = 1;
                d = Math.floor(t/1000/60/60/24);
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
                            sinTxt = _second + '秒后开始';
                        }else{
                            sinTxt =  _minute + '分钟后开始';
                        }
                    }else{
                        sinTxt =  _hous + '小时后开始';
                    }
                }else{
                    sinTxt = d +'天后开始';
                }
                sinTxt = "报名已开始";
            }
        },
        showDetail(e){
            var Jitem = $(e.currentTarget);
            var id = Jitem.data('id');
            Router.loading.show();
            setTimeout(function(){
              Router.loading.hide();
              Router.navigate('sundetail/'+ id);
            },300)
        },
        addComment(id){
            Router.navigate('comment/'+ id + "/0")
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
                        Jtarget.find('i').removeClass('c-green');
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
                        Jtarget.find('i').addClass('c-green');
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
        changeImg(e){
            e.preventDefault();
            e.stopPropagation();
            var Jtarget = $(e.currentTarget);
            var Timgurl = Jtarget.attr('src');
            var id = Jtarget.data('id');
            var eventid = Jtarget.data("eventid");
            var bigimgref = "bigimg_" + eventid;
            var Jbigimg = this.refs[bigimgref];
            Jbigimg.setAttribute("src", Timgurl);
            Jbigimg.setAttribute("data-id",id);
        },
        autoChangeImg(){

        },
        popMap(parmas) {
            var detailData = this.getModel().get() || {};
            var address = detailData.address || {};

            if (!address.latitude || !address.longitude) {
                return;
            }
            var $popup = $('#js-location-viewer_detail');
            var url = 'http://apis.map.qq.com/tools/poimarker?type=0&marker=coord:' + address.latitude + ',' + address.longitude + ';title:' + address.name + ';addr:' + address.name + '&key=' + mapKey + '&referer=' + mapReferer;
            var ptitle = '地图详细';
            if(parmas){
                url = parmas.url;
                ptitle = '  '
            }
            if (!$popup.length) {
                var popup = document.createElement('div');
                popup.className = 'popup';
                popup.id = 'js-location-viewer_detail';
                popup.innerHTML = '<div class="popup_box"><div class="popup_header"><p>'+ptitle+'</p><a href="javascript:void(0)" class="bgimg icodeclose js-close"></a></div><div class="popup_content" style="-webkit-overflow-scrolling: touch;overflow-y:scroll;"><iframe src="' + url + '" style="border: 0; width: 100%; height: 100%;" width="100%" height="100%"></iframe></div></div>';
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
                $popup.find('iframe').hide().attr('src', url);
                $popup.fadeIn(300, function(){
                    $popup.find('iframe').show()
                });
            }
        },
        isWeixn(){
            var ua = navigator.userAgent.toLowerCase();
            if(ua.match(/MicroMessenger/i)=="micromessenger") {
                return true;
            } else {
                return false;
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
        renderCard: function(){
            var cards = this.state.cards || [];
            return cards.map(function(v){
                return (
                    <div className="ithaca-item">
                        <h1 className="c-fff">
                            <span className="fz16">￥</span><span className="fz22">30</span>
                        </h1>
                        <p className="c-fff fz14">无门槛</p>
                        <p className="c-555">2016.02.11当天有效</p>
                        <i></i><i></i><i></i><i></i><i></i><i></i>
                        <i></i><i></i><i></i><i></i><i></i><i></i>
                        <i></i><i></i><i></i><i></i><i></i>
                    </div>
                );
            });
        },
        toShowlist:function(eventid,e){
            e.preventDefault();
            e.stopPropagation();
            var listDom = e.currentTarget;
            var uId = eventid ;// $(listDom).data('id');
            if(uId !== undefined){
                Router.navigate("showlist/" + uId);
            }
        },
        imgOpen(e){
            e.preventDefault();
            e.stopPropagation();
            var target = e.currentTarget;
            var link = target.getAttribute('href');
            this.popMap({url: link})
        },
        //跳转到已报名用户列表
        viewAllSignUser(e){
            var userList = this.getModel().get('participants');
            userList = userList.map(function(v){
                return v.user;
            });
            Models.alreadySignStore.set(userList);
            $location.url('alreadyusers');
        },
        shankeHandClick(e){
            $location.url('shake/'+eventid);
        },
        eveToggle(e){
            var Jtarget = $(e.currentTarget);
            var wrapBox = $(this.refs.evetBoxwrap);
            var cc = Jtarget.attr('class');
            if(cc == 'evetarow-down'){
                Jtarget.attr("class", "evetarow-up");
                wrapBox.show()
            }else{
                Jtarget.attr("class", "evetarow-down");
                wrapBox.hide()
            }
        },
        evecToggle(e){
            var Jtarget = $(e.currentTarget);
            var wrapBox = $(this.refs.topicBoxwrap);
            var cc = Jtarget.attr('class');
            if(cc == 'evetarow-down'){
                Jtarget.attr("class", "evetarow-up");
                wrapBox.show()
            }else{
                Jtarget.attr("class", "evetarow-down");
                wrapBox.hide()
            }
        },
        wximageView(e){
            e.preventDefault();
            e.stopPropagation();
            var Jtarget = $(e.currentTarget),
                $target = $(e.target);
            var imgsObj = Jtarget.find('.js_img_wrap');
            var imgurls = [];
            imgsObj.each(function (i, item) {
                imgurls.push(item.getAttribute('data-img'))
            });
            $wx.previewImage({
                current: $target.data('img') || imgurls[0], // 当前显示图片的http链接
                urls: imgurls // 需要预览的图片http链接列表
            });
        },
        reloadShows(params){
            Router.loading.show();
            var _showsParam={event: params.id},
                ajax1Done = false,
                ajax2Done = false;
            if(params.uid){
                _showsParam.user = params.uid;
            }
            //推荐的晒
            ModelTopShows.setParam(_showsParam).execute().then(function (data) {
                ajax1Done = true;
                if(ajax2Done){
                    Router.loading.hide();
                }
                if (data && data.non_field_errors) {
                    console.log(data.non_field_errors || '获取活动推荐晒失败')
                } else {
                    Models.eventdetail.set("TopshowArr", data.shows);
                }
            }, function () {
                if(ajax2Done){
                    Router.loading.hide();
                }
                console.log('获取活动推荐晒失败');
            }).catch(function (e) {
                console.log(e);
            });

            //其它的晒
            ModelOtherShows.setParam(_showsParam).execute().then(function (data) {
                ajax2Done = true;
                if(ajax1Done){
                    Router.loading.hide();
                }
                if (data && data.non_field_errors) {
                    console.log(data.non_field_errors || '获取活动晒失败')
                } else {
                    var tmpresults = {
                        nextPage : data.next,
                        showArrs : data.results
                    }
                    Models.eventdetail.set("showArr", tmpresults);
                }
            }, function () {
                if(ajax1Done){
                    Router.loading.hide();
                }
                console.log('获取活动晒失败');
            }).catch(function (e) {
                console.log(e);
            });

            setTimeout(function(){
                Router.loading.hide();
            },500)
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
                                        Content: data.non_field_errors || '获取瞬间列表失败'
                                    })
                                }else{
                                    var peventModel = Models.eventdetail.get("showArr");
                                    var peventList = peventModel.showArrs.concat(data.results);
                                    var tmpresults = {
                                        nextPage : data.next,
                                        showArrs : peventList
                                    };
                                    Models.eventdetail.set("showArr", tmpresults);
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
        noticeClose(){
            var noticeBox = $("#topnotice_box");
            var aEle = $("#topnotice_box .tnoticec a");
            if(aEle){
               var _id =  $(aEle[0]).data("id");
                if(_id){
                    Models.showToast.set({isShow:false,broadcastID:_id});
                    noticeBox.hide();
                }
            }
        },
        gotoUserShowClick(e){
            $location.url('showlist/' + eventid);
        },
        openLayer(e){
            var link = this.getModel().get('link');
            if(link){
                this.popMap({url: link});
                e.preventDefault();
            }
        }
    });
    return EventDetailViewComponent;
});
