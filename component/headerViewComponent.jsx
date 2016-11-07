/**
 * Created by sqsun on 2015/9/22.
 */
define(['react','router', 'react.backbone'], function(React,Router) {
    var HeaderViewComponent = React.createBackboneClass({
        render: function() {
            var btnsConf = this.props.btnsConf || {};
            var cheadclass = this.props.headClass;
            var cheaderCss = 'comp-header';
            btnsConf.wxsharebtn = null;
            if(cheadclass){
                cheaderCss = cheaderCss + ' ' + cheadclass
            }
            return (
                <section className={cheaderCss}>
                    <div className="comp-h-txt" dangerouslySetInnerHTML={{__html: this.props.title || "Happy"}}></div>
                    {btnsConf.backbtn && 
                        <div className="comp-h-backbtn" onClick={this.backClick.bind(this)}>
                            <i className="icon-angle-left fz18 c-666"></i>
                        </div>
                    }
                    {btnsConf.userBtn &&
                    <div className="comp-h-userbtn" id="comp-h-duser" onClick={this.userClick.bind(this)}>
                        <div className="comp-h-ubtnraid">
                        <img src={this.props.btnsConf.userIcon} />
                        </div>
                    </div>
                    }
                    {btnsConf.photobtn && 
                        <div className="comp-h-photobtn">
                          <a  ><span className="bgimg comp-h-photo" onClick={this.photoClick.bind(this)}>相册</span></a></div>
                    }
                    {btnsConf.sharebtn && 
                        <div className="comp-h-sharebtn"><span className="bgimg comp-h-share" onClick={this.shareClick.bind(this)}>分享</span></div>
                    }
                    {btnsConf.wxsharebtn &&
                    <div className="comp-h-wxsharebtn"><span className="bgimg comp-h-wxshare" onClick={this.wxshareClick.bind(this)}>分享</span></div>
                    }
                    {btnsConf.showcommentbtn == true &&
                        <div className="comp-h-commentbtn" onClick={this.commentClick.bind(this)}>
                            <i className="icon-comment-1 fz22 c-999"></i>
                        </div>
                    }
                    {btnsConf.shakehandbtn &&
                        <div className="comp-h-wxsharebtn" onClick={this.shankeHandClick.bind(this)}>&nbsp;
                            <i className="sprite-shake-hand pos_center"></i>
                        </div>
                    }
                    {btnsConf.commentSubmitBtn &&
                    <div className="comp-h-commentaddbtn"><span className="comp-h-commentadd" onClick={this.commentaddClick.bind(this)}>发布</span></div>
                    }
                    {btnsConf.nextbtn &&
                    <div className="comp-h-nextbtn"><span className="comp-h-next cm-top-btn" onClick={this.pnextClick.bind(this)}>
                        {this.props.btxt || "下一步>"}</span></div>
                    }
                    {btnsConf.userbackbtn &&
                    <div className="comp-h-backbtn" onClick={this.backClick.bind(this,'back')}>
                        <span className="icon-happy fz30 c-green pos_center user_back_icon"></span>
                    </div>
                    }
                    {btnsConf.userbackbtn &&
                    <div className="user-config-icon" onClick={this.backClick.bind(this,'config')}>
                        <span className="icon-config fz30 c-green pos_center userconfig"></span>
                    </div>
                    }
                    {btnsConf.viewHisbtn &&
                    <div className="comp-h-commentaddbtn c-666" onClick={btnsConf.viewHisbtn.bind(this)}>
                        查看历史
                    </div> || null
                    }
                    {btnsConf.myFunIndexBack &&
                    <div className="comp-h-backbtn" onClick={btnsConf.myFunIndexBack.bind(this)}>
                        <span className="bgimg comp-h-back">返回</span>
                        <span className="icon-happy fz30 c-green pos_center user_back_icon"></span>
                    </div>
                    }
                </section>
            );
        },
        backClick(e) {
            if (this.props.btnsConf.backbtn) {
                this.props.btnsConf.backbtn(e)
            }
        },
        userClick(){
            if (this.props.btnsConf.userBtn) {
                this.props.btnsConf.userBtn()
            }
        },
        photoClick() {
            if (this.props.btnsConf.photobtn) {
                
                this.props.btnsConf.photobtn()
            }
        },
        shareClick() {
            if (this.props.btnsConf.sharebtn) {
                this.props.btnsConf.sharebtn()
            }
        },
        wxshareClick() {
            if (this.props.btnsConf.wxsharebtn) {
                this.props.btnsConf.wxsharebtn()
            }
        },
        commentClick() {
            if (this.props.btnsConf.commentbtn) {
                this.props.btnsConf.commentbtn()
            }
        },
        commentaddClick() {
            if (this.props.btnsConf.commentSubmitBtn) {
                this.props.btnsConf.commentSubmitBtn()
            }
        },
        pnextClick(){
            if (this.props.btnsConf.nextbtn) {
                this.props.btnsConf.nextbtn()
            }
        },
        shankeHandClick(){
            if(this.props.btnsConf.shankeHandClick) {
                this.props.btnsConf.shankeHandClick();
            }
        }
    });
    return HeaderViewComponent;
})