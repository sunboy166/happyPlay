/**
 * Created by liuyang on 2016/05/01.
 */
define(['react', 'jsx!headerViewComponent', 'koala','RESTF', 'Models','router','Fn'], function(React, HeaderComp, Koala, RESTF, Models,Router, Fn) {
    var ModelRestf = RESTF.eventcommentAddModel.getInstance();
    var ModelShow = RESTF.showcommentAddModel.getInstance();
    var Toast = new Koala.kUI.Toast();
    var CommentViewComponent = React.createClass({
        getInitialState: function() {
            return {
                type: 'cloud'
            };
        },
        getDefaultProps(){
            return {
                list: []
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
                    <HeaderComp btnsConf={btnsConf} title={this.props.title} />
                    <section className="comp-content topic">
                        <ul className="sk-list-history">
                            {this.renderItem()}
                        </ul>
                    </section>
                </section>
            )
        },
        renderItem(){
            if(!this.props.list.length) {
                return <li className="tac">暂无历史卡券</li>;
            }
            return this.props.list.map(function(v){
                var card = v["timed_card"] || v["show_card"];
                return (
                    <li className="tabs">
                        <div className="sk-list-img no-fixed">
                            <div className="img-auto-wrap img-auto-wrap2">
                                <img src={card.image} alt=""/>
                            </div>
                        </div>
                        <div className="sk-list-content">
                            <h2>{card.title || card.description}</h2>
                            <p>{card.description || "暂无描述"}</p>
                        </div>
                        <div className="sk-list-viewdetail no-fixed">
                            {
                                card['wechat_card'] ?
                                <span className="btn-view-detail js_view_wx_card" data-wx-id={card["wechat_card"]}>查看</span>:
                                <a className="btn-view-detail" href={"#sundetail/" + card.id}>查看</a>
                            }
                        </div>
                    </li>
                );
            });
        }
    });
    return CommentViewComponent;
});