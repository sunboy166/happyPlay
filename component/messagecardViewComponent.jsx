/**
 * Created by sqsun on 2015/9/22.
 */
define(['react', 'jsx!headerViewComponent', 'router','Models', 'RESTF','react.backbone'], function(React, HeaderComp, Router, Models,RESTF) {
    var MessagesnsViewComponent = React.createBackboneClass({
        getInitialState: function() {
            return {first: true, secend: false};
        },
        componentWillReceiveProps: function (nextProps) {
            this.setState({first: true, secend: false});
        },
        getDefaultProps(){
            return {
                list: []
            }
        },
        render: function() {
            return (
                <section className="flex view-warp">
                    <HeaderComp btnsConf={this.props.btnsConf} title={this.props.title} />
                    <section className="comp-content publish-cont">
                        {this.renderItem()}
                    </section>
                </section>
            )
        },
        renderItem(){
            var self = this;
            return this.getModel().get().list.map(function(v){
                return (
                    <div className="messcarditem">
                        <div className="messhead">
                            <div className="messtitle">入场券使用通知</div>
                            <div className="messdate">2015-12-25  18:00</div>
                        </div>
                        <div className="messitxt">您好，您有一张入场券已使用</div>
                        <div className="messitem">
                            <div className="messiname">卡券名称：</div>
                            <div className="messitxt">洛杉矶车展入场券</div>
                        </div>
                        <div className="messitem">
                            <div className="messiname">使用时间：</div>
                            <div className="messitxt">2015-12-25 17：58</div>
                        </div>
                        <div className="messimore" onClick={self.morepage.bind(null, v.id)}>
                            <div className="bgimg messimr"></div>
                            <div className="messimt">详情</div>
                        </div>
                    </div>
                );
            });
        },
        morepage (id){
            Router.navigate('messages/cardinfo/' + id)
        }
    });
    return MessagesnsViewComponent;
})