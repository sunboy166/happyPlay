/**
 * Created by sqsun on 2015/9/22.
 */
define(['react', 'jsx!headerViewComponent', 'react.backbone'], function(React, HeaderComp) {
    var IcardViewComponent = React.createBackboneClass({
        getInitialState: function() {
            return {showcode: false};
        },
        componentWillReceiveProps: function (nextProps) {
            this.setState({showcode: false});
        },
        render: function() {
            return (
                <section className="flex view-warp icardwarp">
                    <HeaderComp btnsConf={this.props.btnsConf} title={this.props.title} />
                    <section className="comp-content">
                        <ul className="icard-box" onClick={this.showcode.bind(this)}>
                            <li className="icarditem">
                                <div className="icardinfo">
                                    <div className="icardpic">
                                        <img src="./testimg/icon.jpg" className="icardimg" />
                                    </div>
                                    <div className="icardname">
                                        上海大鞋厂会员卡
                                    </div>
                                    <div className="icardsname">
                                        <div className="icardsa">上海·大鞋厂</div>
                                        <div className="icardst">进行中</div>
                                    </div>
                                    <div className="icardnumbox">
                                        <div className="icardnlb">入场券号：</div>
                                        <div className="icardnum">Auf88422199</div>
                                    </div>
                                    <div className="bgimg icardcode" data-id="1"></div>
                                </div>
                                <div className="icarddel">
                                    <div className="icardricon"></div>
                                </div>
                            </li>
                            <li className="icarditem">
                                <div className="icarddel">
                                    <div className="icardricon"></div>
                                </div>
                                <div className="icardinfo">
                                    <div className="icardpic">
                                        <img src="./testimg/icon.jpg" className="icardimg" />
                                    </div>
                                    <div className="icardname">
                                        上海大鞋厂会员卡
                                    </div>
                                    <div className="icardsname">
                                        <div className="icardsa">上海·大鞋厂</div>
                                        <div className="icardst">进行中</div>
                                    </div>
                                    <div className="icardnumbox">
                                        <div className="icardnlb">入场券号：</div>
                                        <div className="icardnum">Auf88422199</div>
                                    </div>
                                    <div className="bgimg icardcode" data-id="1"></div>
                                </div>
                                <div className="icarddel">
                                    <div className="icardricon"></div>
                                </div>
                            </li>
                            <li className="icarditem">
                                <div className="icardinfo">
                                    <div className="icardpic">
                                        <img src="./testimg/icon.jpg" className="icardimg" />
                                    </div>
                                    <div className="icardname">
                                        上海大鞋厂会员卡
                                    </div>
                                    <div className="icardsname">
                                        <div className="icardsa">上海·大鞋厂</div>
                                        <div className="icardst">进行中</div>
                                    </div>
                                    <div className="icardnumbox">
                                        <div className="icardnlb">入场券号：</div>
                                        <div className="icardnum">Auf88422199</div>
                                    </div>
                                    <div className="bgimg icardcode" data-id="1"></div>
                                </div>
                                <div className="icarddel">
                                    <div className="icardricon"></div>
                                </div>
                            </li>
                        </ul>
                    </section>
                    {this.state.showcode &&
                    <div className="cui-mask icodebox">
                        <div className="bgimg icodeclose" onClick={this.cboxclose.bind(this)}></div>
                        <div className="icodeimg" ref="icodeImg">
                            <img src="./testimg/icode.png" />
                        </div>
                    </div>
                    }
                </section>
            );
        },
        showcode(e){
            var codeobj = e.target;
            var Jcodeobj = $(codeobj);
            var codeid = Jcodeobj.data('id');
            if(codeid !== undefined){
                this.setState({showcode: true});
            }
        },
        cboxclose(){
            this.setState({showcode: false});
        }
    });
    return IcardViewComponent;
})