/**
 * Created by sqsun on 2015/9/22.
 */
define(['react', 'jsx!headerViewComponent', 'koala','RESTF', 'Models','router'], function(React, HeaderComp, Koala, RESTF, Models,Router) {
    var ModelRestf = RESTF.eventcommentAddModel.getInstance();
    var ModelShow = RESTF.showcommentAddModel.getInstance();
    var id = '0';
    var rid = null;
    var from = null;
    var Toast = new Koala.kUI.Toast();
    var CommentViewComponent = React.createClass({
        getInitialState: function() {
            return {cnum: '还剩100个字符'};
        },
        componentWillReceiveProps: function (nextProps) {
            rid = null;
            this.setState({cnum: '还剩100个字符'});
            var commentAre = React.findDOMNode(this.refs.commentAre);
            commentAre.value = '输入评论内容，0-100个字符';
            commentAre.className = 'carea-input'
        },
        render: function() {
            var btnsConf = this.props.btnsConf;
            btnsConf.commentSubmitBtn = this.csubmit;
            id = this.props.id;
            rid = this.props.rid;
            from = this.props.from;
            return (
                <section className="flex view-warp">
                    <HeaderComp btnsConf={btnsConf} title={this.props.title} />
                    <section className="comp-content commentc">
                        <div className="comment-area">
                            <textarea className="carea-input" onFocus={this.cfocus.bind(this)} onBlur={this.cblur.bind(this)} onInput={this.cinput.bind(this)} ref="commentAre">输入评论内容，0-100个字符</textarea>
                        </div>
                        <div className="comment-num" ref="commentNum">{this.state.cnum}</div>
                    </section>
                </section>
            );
        },
        csubmit(){
            var commentAre = this.refs.commentAre;
            var commentVal = commentAre.value;
            var userinfo = Models.userinfo.get();
            if(commentVal == '输入评论内容，0-100个字符'){
                commentAre.focus()
            } else {
                var dataForm = {};

                if(from == '0'){ //活动
                    if(rid){
                        dataForm = {content: commentVal, user: userinfo.id,event: id, pid: rid}
                    }else{
                        dataForm = {content: commentVal, user: userinfo.id, event: id}
                    }
                    ModelRestf.execute(dataForm).then(function(data){
                        if(data && data.non_field_errors){
                            Toast.show({
                                Content: data.non_field_errors || '发布评论失败'
                            });
                        }else{
                            Toast.show({
                                Content: '发布评论成功',
                                callBack: function(){
                                    if(Router.previousView && Router.previousView.actionUrl =="login"){//进入登录如果有历史页面则直接进入历史页面，没有则进入首页
                                        window.history.go(-3);
                                    }else{
                                        window.history.go(-1);
                                    }
                                }
                            }
                            );
                        }
                    },function(){
                        Toast.show({
                            Content: '网络不给力啊，请稍后再试'
                        })
                    }).catch(function(e){
                        console.log(e)
                    });
                }else{ //晒
                    if(rid){
                        dataForm = {content: commentVal, user: userinfo.id, show: id, pid: rid}
                    }else{
                        dataForm = {content: commentVal, user: userinfo.id, show: id}
                    }
                    ModelShow.execute(dataForm).then(function(data){
                        if(data && data.non_field_errors){
                            Toast.show({
                                Content: data.non_field_errors || '发布评论失败'
                            });
                        }else{
                            Toast.show({
                                Content: '发布评论成功',
                                callBack: function(){
                                    window.history.go(-1);
                                }
                            });
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
        },
        cfocus(e){
            var val = e.target.value;
            if(val == '输入评论内容，0-100个字符'){
                e.target.value = "";
                e.target.className = "carea-input cinputfocus"
            }
        },
        cblur(e){
            var val = e.target.value;
            if(val == ''){
                e.target.value = "输入评论内容，0-100个字符";
                e.target.className = "carea-input"
            }
        },
        cinput(e){
            var val = e.target.value;
            var vlen = val.length;
            var clen = 100 - vlen;
            var cntxt = '';
            if(clen < 0 ){
                e.target.value = val.substr(0, 100);
                return
            }else{
                cntxt = '还剩'+ clen +'个字符';
                this.setState({cnum: cntxt});
            }
        }
    });
    return CommentViewComponent;
})