/**
 * Created by sqsun on 2015/9/22.
 */
define(['react', 'jsx!headerViewComponent', 'router'], function(React, HeaderComp, Router) {
    var MessagesnsViewComponent = React.createClass({
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
                    <section className="comp-content publish-cont">
                        <div className="messcardinfotb"></div>
                        <div className="messcinfoname">洛杉矶车展</div>
                        <div className="messcinfobtn">添加至我的卡券</div>
                        <div className="messcinfotxtbox">
                            <div className="messcinfotxt">
                                适用于2016年8月洛杉矶车展门票使用，详情请咨询展会举办方。
                            </div>
                            <div className="messinfordate">
                                <div className="messinfordl">有效期：</div>
                                <div className="messinfordd">2016.01.22--2016.02.05</div>
                            </div>
                        </div>
                        <div className="messcardinfobb cui-flexbd "></div>
                    </section>
                </section>
            )
        }
    });
    return MessagesnsViewComponent;
})