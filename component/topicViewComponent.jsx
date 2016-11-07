/**
 * Created by sqsun on 2015/9/22.
 */
define(['react', 'jsx!headerViewComponent', 'router'], function(React, HeaderComp, Router) {
    var TopicViewComponent = React.createClass({
        getInitialState: function() {
            return {first: true, secend: false};
        },
        componentWillReceiveProps: function (nextProps) {
            this.setState({first: true, secend: false});
        },
        render: function() {
            return (
                <section className="flex view-warp">
                    <HeaderComp btnsConf={this.props.btnsConf} title={this.props.title} />
                    <section className="comp-content publish-cont topic">
                        <div className="topicbox">
                            <div className="topic-head">
                                <div className="thicon">
                                    <img src="./testimg/icon.jpg" alt=""/>
                                </div>
                                <div className="thtitle">行摄茉莉@Toconi</div>
                                <div className="thtime">一周前</div>
                            </div>
                            <div className="topic-img">
                                <img src="./testimg/topic.png" width="100%" alt=""/>
                            </div>
                            <div className="topicthurmbox">
                                <ul className="topicthurms">
                                    <li className="topicthurm">
                                        <img src="./testimg/topicthurm.png" alt=""/>
                                    </li>
                                    <li className="topicthurm">
                                        <img src="./testimg/topicthurm.png" alt=""/>
                                    </li>
                                    <li className="topicthurm">
                                        <img src="./testimg/topicthurm.png" alt=""/>
                                    </li>
                                    <li className="topicthurm">
                                        <img src="./testimg/topicthurm.png" alt=""/>
                                    </li>
                                    <li className="topicthurm">
                                        <img src="./testimg/topicthurm.png" alt=""/>
                                    </li>
                                    <li className="topicthurm">
                                        <img src="./testimg/topicthurm.png" alt=""/>
                                    </li>
                                </ul>
                            </div>
                            <div className="topiceventbox">
                                <div className="topictxt">车展上美女都是这样摆Pose的，你造嘛～你造嘛～你造嘛～</div>
                                <div className="topicuserbox">
                                    <div className="topicusericon">
                                        <img src="./testimg/icon.jpg" alt=""/>
                                    </div>
                                    <div className="topicusername">小韩车展仔</div>
                                </div>
                                <div className="topiceventinfo">
                                    <div className="teventimg">
                                        <img src="./testimg/topicthurm.png" />
                                    </div>
                                    <div className="teventname">2016上海国际车展</div>
                                    <div className="teventaddress">虹桥新世纪厦一楼</div>
                                    <div className="teventstbox">
                                        <div className="teventstat">已结束</div>
                                        <div className="teventunum">220人参于</div>
                                    </div>
                                </div>
                                <div className="teventags">
                                    <span className="teventag tthot">#2016上海国际车展</span>
                                    <span className="teventag tthot">#上海国际车展</span>
                                    <span className="teventag">#车展美女</span>
                                </div>
                                <div className="teventnbox">
                                    <div className="teventnhot">
                                        518条热度
                                    </div>
                                    <div className="teventnotice">
                                        <div className="teventntnum">
                                            <span className="bgimg teventnqicon"></span>
                                            <span className="teventnqnum">15</span>
                                        </div>
                                        <div className="bgimg teventntlike"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                </section>
            )
        }
    });
    return TopicViewComponent;
})