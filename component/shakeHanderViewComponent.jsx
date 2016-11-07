/**
 * Created by liuyang on 2016/05/01.
 */
define(['react', 'jsx!headerViewComponent', 'koala','RESTF', 'Models','router','Fn'], function(React, HeaderComp, Koala, RESTF, Models,Router, Fn) {
    var ModelRestf = RESTF.eventcommentAddModel.getInstance();
    var ModelShow = RESTF.showcommentAddModel.getInstance();
    var Toast = new Koala.kUI.Toast(),
        swiper = null;
    var CommentViewComponent = React.createClass({
        getInitialState: function() {
            return {
                type: 'cloud'
            };
        },
        getDefaultProps(){
            return {
                ibeacon: [],
                cloud: [],
                btnsConf: {},
                slide:""
            }
        },
        render: function() {
            var btnsConf = this.props.btnsConf,
                state = this.state;
            var clickClass = "pos_center tac wx-shake-search ";
            if(!state.text) {
                clickClass += " js_bind_shakehand";
            }
            return (
                <section className="flex view-warp">
                    <HeaderComp btnsConf={btnsConf} title={this.props.title} headClass="comp-header-transparent"/>
                    <section className="comp-content topic com-content-mt51">
                        <div className="img-auto-wrap rate100" >
                            <div className="full-screen">
                                 <div id="sliderimg1" className="swipebox swiper-container">
                                     <div className="swipe-wrap swiper-wrapper">
                                         {this.renderImageDom()}
                                     </div>
                                </div>
                            </div>
                            <div id="detail-imagedot1" className="detail-imagebtn"></div>
                        </div>
                        <div className="sk-tab-wrap">
                            <ul className="tabs tabs-style-1">
                                <li className={"js_toggle_changeshake " + (state.type === "cloud" ? "current" : "")} data-type="cloud">云端</li>
                                <li className={"js_toggle_changeshake " + (state.type === "ibeacon" ? "current" : "")} data-type="ibeacon">线下</li>
                            </ul>
                            <p className="tac sk-tab-txt">{this.props.description || "现在就摇动手机参与！"}</p>
                        </div>
                        <dl className="sk-list-dl bgcfff">
                            {this.renderItem()}
                        </dl>
                    </section>
                    {this.showCardLayer()}
                    <div className={"cm-notice js_notice_wrap" + (state.showNotice ? "" : " dn")}>
                            <span className="fl cm-notice-left">
                                <i className="icon-play-1"></i>
                            </span>
                            <p className="fl">摇动手机赢取Happy福利</p>
                            <span className="cm-notice-right-close">
                                <i className="icon-close"></i>
                            </span>
                        </div>
                </section>
            )
        },
        renderItem(){
            var state = this.state,
                type = state.type;
            var currentArray = this.props[type],
                renderArray = [],
                topTime = '';
            currentArray.forEach(function(v,i){
                var title = TimeTitle(v);
                if(topTime != title) {
                    topTime = title;
                    renderArray.push(title);
                }
                renderArray.push(v);
            });

            if(!state.step) {
                return (
                    <div className="tac c-999">加载中...</div>
                )
            } else if(state.step === "finish" && !renderArray.length) {
                return (
                    <ul className="sk-shake-no-result">
                      <li className="tac">{ state.type != "cloud" ? "所有的HAPPY福利都可以在线上直接摇动，赶紧去吧，祝你们好运！" : "暂无卡券"}</li></ul>
                )
            }
            if(renderArray.length) {
                return renderArray.map(function(v){
                    if(_.isString(v)){
                        return (
                            <dt className="c-999 fz14">{v}</dt>
                        );
                    } else {
                        return (
                            <dd>
                                <ul className="sk-list-wrap">
                                    <li className="tabs">
                                        <div className="sk-list-img no-fixed">
                                            <div className="img-auto-wrap">
                                                <img src={v.image} alt=""/>
                                            </div>
                                        </div>
                                        <div className="sk-list-desc fz16">
                                            <h3>{v.title || v.description}</h3>
                                            { ~~v.amount &&
                                                <p className="c-green">限量&nbsp;{v.amount}&nbsp;件</p>
                                                || ""
                                            }
                                            {
                                                v.inventory && <p className="c-999 fz14">剩余&nbsp;{v.inventory}&nbsp;件</p> || ""
                                            }
                                            {/*!(~~v.amount && ~~v.inventory) && <p className="c-999 fz14 sk-list-desc-detail">{v.description}</p>*/}
                                            {renderStatusText(v.status, v.inventory)}
                                        </div>
                                    </li>
                                </ul>
                            </dd>
                        );
                    }
                });
            } else {
                return "暂无卡券"
            }

            //渲染页面的文字
            function renderStatusText(status, inventory){
                if(inventory == "0") {
                    status = "closed";
                }
                var txt = "",
                    className = "btn-status ";
                if(status === "opening") {
                    txt = "进行中";
                    className += "btn-status-doing"
                } else if(status === "closed") {
                    txt = "已结束";
                } else if(status === "coming soon"){
                    txt = "即将开始";
                } else {
                    className += " dn";
                }
                return <span className={className}>{txt}</span>;
            }
            /**
             * 获取当前返回的时间
             * @param data
             * @returns {string}
             * @constructor
             */
            function TimeTitle(data){
                var startTime = buildDate(data.begin_time),
                    endTime = buildDate(data.end_time);
                var startTimeStr = Fn.Date.format(startTime, 'M月dd日 hh:mm'),
                    endTimeStr = Fn.Date.format(endTime,  'M月dd日 hh:mm'),
                    startMorning = startTime.getHours() < 12 ? " 上午 " : " 下午 ",
                    startTimeArr = startTimeStr.split(" "),
                    endTimeArr = endTimeStr.split(" ");
                startTimeStr = startTimeArr.join(startMorning);
                if(startTimeArr[0] === endTimeArr[0]) {
                    return startTimeStr + " - " + endTimeArr[1];
                } else {
                    return startTimeStr + " - " + endTimeStr;
                }
            }

            /**
             * 获取一个标准的时间
             * @param dstr
             * @returns {Date}
             */
            function buildDate(dstr){
                return new Date(dstr);
            }
        },
        showCardLayer(){
            var state = this.state,
                props = this.props,
                data = props.shakeCard;
            if(!state.showLayer) return ;
            data = getRenderLayerData(data);
            if(_.isEmpty(data)) return ;
            function getRenderLayerData(data){
                if(!data) return {};

                var type = Fn.getAttr(data, 'card.card_type', "").toLowerCase();
                var d = Fn.getAttr(data, 'card.' + type + '.base_info');
                //微信卡券

                if(d) {
                    return {
                        id: d.id,
                        title: d.title,
                        description: d.description,
                        image: data.image || d['logo_url'],
                        timeout: '',
                        wx: true
                    }
                } else {
                    return {
                        id: data["id"],
                        title: data["title"],
                        description: data["content"],
                        image:data.image || data['cover_image'],
                        timeout: '',
                        wx: false,
                        url: data.url
                    }
                }
            }
            return (
                <div className="cm-card-layer">
                    <div className="cm-card-content">
                        <span className="cm-card-btn-close js_hide_layer"></span>
                        <h1>{data.title}</h1>
                        <p className="c-grey cm-card-layer-desc">{data.description}</p>
                        <div className="cm-card-img">
                            <div className="img-auto-wrap rate100">
                                <img src={data.image} alt=""/>
                            </div>
                        </div>
                        <div className="tac">
                            <span className={"cm-card-go-detail " + (data.wx ? "js_open_wx_card" : "js_open_shun")} data-card-id={data.id} data-url={data.url}>查看详情</span>
                        </div>
                        <div className="cm-card-out-day">
                            {data.timeout ? <p className="c-999 fz14"><span className="c-grey">失效时间：</span>{data.timeout}</p> : ""}
                        </div>
                    </div>
                </div>
            );
        },
        //渲染页面的DOM
        renderImageDom(){
            return this.props.slide.split("|").map(function(v){
                return (
                    <div className="swiper-slide">
                        <div className="img-auto-wrap rate100 w100 js_view_layer img-bg-auto-wrap" data-url={v} style={{
                            'background-image': 'url(' + v + ')'
                        }}>
                            <img className="hd" src={v} alt=""/>
                        </div>
                    </div>
                );
            });
        },
        componentWillReceiveProps(nextProps){
            if(nextProps.slide != this.props.slide) {
                var self  = this;
                //初始化滚动图片
                if(swiper){
                    swiper.destroy();
                }
                setTimeout(function (){
                    swiper = new Swiper('#sliderimg1', {
                        paginationClickable: true,
                        autoplay: 3000,
                        autoplayDisableOnInteraction: false,
                        pagination: '#detail-imagedot1'
                    });
                });
            }
        }
    });
    return CommentViewComponent;
});