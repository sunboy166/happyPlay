/**
 * Created by sqsun on 2015/9/22.
 */
define(['react', 'jsx!mainViewComponent', 'router', 'koala', 'Models', 'RESTF', 'react.backbone'], function(React, MainComp, Router, Koala, Models, RESTF) {
    var ModelRestf = RESTF.followsModel.getInstance();

    var Toast = new Koala.kUI.Toast();
    var PublishViewComponent = React.createBackboneClass({
        getDefaultProps(){
            return {
                userList: []
            }
        },
        getInitialState: function() {
            return {upuser: 0};
        },
        render: function() {
            return (
                <MainComp btnsConf={this.props.btnsConf} title={this.props.title} navClass="comp-nav-discoverbtn" gclass="messageCont">
                    <div className="messageListBox" ref="messageListBox">
                        <ul className="messageLists discoverusers">
                            {this.renderItem()}
                        </ul>
                    </div>
                </MainComp>
            )
        },
        //渲染条目
        renderItem(){
            return this.props.userList.map(function (item) {
                return (
                    <li className="messageList clearfix" data-id={item.id} >
                        <div className="messageuicon">
                            <div className="messageui"><img src={item.image || ""} alt=""/></div>
                            {/*<div className="navbg messagev"></div>*/}
                        </div>
                        <div className="messagename">
                            {/*<div className="messagectrbox">
                                <div className="bgimg messagecuadd" data-id={item.id}></div>
                                <div className="bgimg messagecunote" data-id={item.id}></div>
                            </div>*/}
                            <div className="messagen mt12">{item.nick_name || '未设置昵称'}</div>
                            {/*<div className="messageulocal">
                                <span className="messagecar"> </span>
                                <span className="messageuaddress">上海</span>
                            </div>*/}
                        </div>
                        <div className="messagetxt">
                            {item.remark}
                        </div>
                    </li>
                )
            });
        }
    });
    return PublishViewComponent;
})