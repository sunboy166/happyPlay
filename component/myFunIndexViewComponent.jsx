/**
 * Created by sqsun on 2015/9/22.
 */
define(['react', 'jsx!mainViewComponent', 'router', 'koala', 'Models', 'RESTF', 'react.backbone'], function(React, MainComp, Router, Koala, Models, RESTF) {
    var ModelRestf = RESTF.followsModel.getInstance(),
        swiper = null;

    var Toast = new Koala.kUI.Toast();
    var PublishViewComponent = React.createBackboneClass({
        getDefaultProps(){
            return {
                slide: ""
            }
        },
        getInitialState: function() {
            return {upuser: 0};
        },
        render: function() {
            var userInfo = Models.userinfo.get() || {};
            return (
                <MainComp btnsConf={this.props.btnsConf} title={this.props.title} navClass="comp-nav-discoverbtn" gclass="messageCont">
                    <div className="messageListBox" ref="messageListBox">
                        <div className="my-play-rate-wrap">
                            <div className="my-play-rate">
                                <span className="my-play-txt">好玩指数</span>
                                <p className="my-play-num">{userInfo.show_count || 0}</p>
                            </div>
                        </div>
                        <div className="img-auto-wrap rate60">
                            <div className="full-screen">
                                <div id="sliderimg2" className="swipebox swiper-container">
                                     <div className="swipe-wrap swiper-wrapper">
                                         {this.renderImageDom()}
                                     </div>
                                </div>
                                <div id="detail-imagedot2" className="detail-imagebtn"></div>
                            </div>
                        </div>
                        <ul className="my-index-list">
                            <li className="tabs">
                                <div className="no-fixed my-index-list-left">
                                    <span>
                                        <i className="icon-play-1"></i>
                                    </span>
                                </div>
                                <div className="my-index-list-content">
                                    <h2>50点好玩指数</h2>
                                    <p><sub>&yen;</sub><span className="c-red">5.00</span>元</p>
                                </div>
                                <div className="no-fixed">
                                    <span className="my-index-buy">购买</span>
                                </div>
                            </li>
                            <li className="tabs">
                                <div className="no-fixed my-index-list-left my-list-yellow">
                                    <span>
                                        <i className="icon-play-1"></i>
                                    </span>
                                </div>
                                <div className="my-index-list-content">
                                    <h2>100点好玩指数</h2>
                                    <p><sub>&yen;</sub><span className="c-red">10.00</span>元</p>
                                </div>
                                <div className="no-fixed">
                                    <span className="my-index-buy">购买</span>
                                </div>
                            </li>
                            <li className="tabs">
                                <div className="no-fixed my-index-list-left my-list-red">
                                    <span>
                                        <i className="icon-play-1"></i>
                                    </span>
                                </div>
                                <div className="my-index-list-content">
                                    <h2>500点好玩指数</h2>
                                    <p><sub>&yen;</sub><span className="c-red">50.00</span>元</p>
                                </div>
                                <div className="no-fixed">
                                    <span className="my-index-buy">购买</span>
                                </div>
                            </li>
                        </ul>
                    </div>
                </MainComp>
            )
        },
        componentWillReceiveProps(nextProps){
            if(nextProps.slide != this.props.slide) {
                var self  = this;
                //初始化滚动图片
                if(swiper){
                    swiper.destroy();
                }
                setTimeout(function (){
                    swiper = new Swiper('#sliderimg2', {
                        paginationClickable: true,
                        autoplay: 3000,
                        autoplayDisableOnInteraction: false,
                        pagination: '#detail-imagedot2'
                    });
                });
            }
        },
        renderImageDom(){
            return this.props.slide.split("|").map(function(v){
                return (
                    <div className="swiper-slide">
                        <div className="img-auto-wrap img-auto-wrap2 rate60 w100">
                            <img src={v} alt=""/>
                        </div>
                    </div>
                );
            });
        }
    });
    return PublishViewComponent;
})