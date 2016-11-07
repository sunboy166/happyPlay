/**
 * Created by sqsun on 2015/9/22.
 */
define(['react', 'jsx!headerViewComponent', 'koala', 'Models', 'router', 'react.backbone'], function(React, HeaderComp, Koala, Models, Router) {
    var Toast = new Koala.kUI.Toast();
    var Gnurl = null;
    var elTop = 0;
    var elBox = null;
    var getMX = true;
    var CommentListComponent = React.createBackboneClass({
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
            this.setState({});
        },
        render: function() {
            var commentLists = this.getModel().get();
            var eventid = this.props.event;
            var commentRuslt = commentLists.results;
            var commentmp = {};
            var self = this;
            var scrollEv = self.getMoreEvent;
            Gnurl = commentLists.next;
            commentRuslt.map(function(item, index) {
                var reComment = item.reply;
                var userinfo = item.user;
                var reCommentmp = {};
                var esDate = new Date(item.created_at);
                var nowDateTime = esDate.getFullYear();
                var _hour = ( 10 > esDate.getHours() ) ? '0' + esDate.getHours() : esDate.getHours();
                var _minute = ( 10 > esDate.getMinutes() ) ? '0' + esDate.getMinutes() : esDate.getMinutes();
                var _second = ( 10 > esDate.getSeconds() ) ? '0' + esDate.getSeconds() : esDate.getSeconds();
                nowDateTime = nowDateTime + ((esDate.getMonth() + 1) < 10 ? "-0" + (esDate.getMonth() + 1) : "-" + (esDate.getMonth() + 1));
                nowDateTime = nowDateTime + (esDate.getDate() < 10 ? "-0" + esDate.getDate() : "-" + esDate.getDate());
                nowDateTime = nowDateTime + ' '  + _hour + ':' + _minute + ':' + _second + '  ·  ';
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
                                {item.content}
                            </div>
                            <div className="commentdatebox">
                                <span className="commentimer">{nowDateTime}</span>
                                <a href={"#comment/"+ eventid +"/r/" + item.id + "/0"} className="recomment">回复</a>
                            </div>
                        </div>
                    </div>
                    {reCommentmp}
                </div>
            });
            if(!Gnurl){
                scrollEv = null;
            }
            return (
                <section className="flex view-warp evd-viewbox">
                    <HeaderComp btnsConf={this.props.btnsConf} title={this.props.title} />
                    <section className="comp-content detailc" onScroll={scrollEv}>
                        <div className="showcommentbox mshowcbox">
                            {commentmp}
                        </div>
                    </section>
                </section>
            );
        },
        toFuserCenter:function(e){
            e.preventDefault();
            e.stopPropagation();
            return;
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
                                        Content: data.non_field_errors || '获取更多评论失败'
                                    })
                                }else{
                                    var peventModel = Models.eventdetailMoreComment.get();
                                    var peventList = peventModel.results;
                                    peventList = peventList.concat(data.results);
                                    var tmpObj = {
                                        next: data.next,
                                        results: peventList
                                    }
                                    Gnurl = data.next;
                                    Models.eventdetailMoreComment.set(tmpObj);
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
    return CommentListComponent;
})
