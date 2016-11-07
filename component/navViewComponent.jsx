/**
 * Created by sqsun on 2015/9/22.
 */
define(['react', 'router', 'Models', 'react.backbone'], function(React, Router, Models) {
    var NavViewComponent = React.createBackboneClass({
        render: function() {
            var navClassname = this.props.navClass;
            if(navClassname){
                navClassname = "comp-nav " + navClassname
            } else {
                navClassname = "comp-nav"
            }
            return (
                <nav className={navClassname}>
                    <ul className="comp-nav-btns">
                        <li className="comp-nav-btn"><div className="navbg comp-nav-btnicon" onClick={this.indexClick.bind(this)}>首页</div></li>
                        <li className="comp-nav-btn"><div className="navbg comp-nav-btnicon" onClick={this.findClick.bind(this)}>发现</div></li>
                        <li className="comp-nav-cbtn"><div className="comp-nav-ebtn"><span className="comp-nav-fbtn" onClick={this.publishClick.bind(this)}>发布</span></div></li>
                        <li className="comp-nav-btn"><div className="navbg comp-nav-msbtnicon" onClick={this.messageClick.bind(this)}><i className="comp-nav-itip"></i></div></li>
                        <li className="comp-nav-btn"><div className="navbg comp-nav-btnicon" onClick={this.myClick.bind(this)}>我</div></li>
                    </ul>
                </nav>
            );
        },
        indexClick() {
            Router.navigate('index');
        },
        findClick() {
            Router.navigate('discover');
        },
        publishClick() {
            Router.navigate('publish');
        },
        messageClick() {
            Router.navigate('messages');
        },
        myClick() {
            var userinfo = Models.userinfo.get();
            if(userinfo && userinfo.id){
                Router.navigate('usercenter')
            }else{
                window.location.href = '#login';
            }
        }
    });
    return NavViewComponent;
})