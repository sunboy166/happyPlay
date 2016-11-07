/**
 * Created by sqsun on 2015/9/22.
 */
define(['react', 'jsx!mainViewComponent', 'router', 'react.backbone'], function(React, MainComp, Router) {
    var MessageViewComponent = React.createBackboneClass({
        getInitialState: function() {
            return {};
        },
        componentWillReceiveProps: function (nextProps) {
            //this.setState({first: true, secend: false});
        },
        render: function() {
            var self = this;
            var messageModel = self.getModel().get();
            var messageArr = messageModel.results || [];
            var esMessage = messageModel.esMessageNum;
            var messageTmp = {};
            if(messageModel.count > 0){
                messageArr.map(function(item, index){
                    var esDate = new Date(item.send_date);
                    var nowDateTime = esDate.getFullYear();
                    nowDateTime = nowDateTime + ((esDate.getMonth() + 1) < 10 ? "-0" + (esDate.getMonth() + 1) : "-" + (esDate.getMonth() + 1));
                    nowDateTime = nowDateTime + (esDate.getDate() < 10 ? "-0" + esDate.getDate() : "-" + esDate.getDate());
                    messageTmp[index] = <li className="messageList" data-uid={item.sender.id} onClick={self.getUserChat.bind(self)}>
                        <div className="messageuicon">
                            <div className="messageui"><img src={item.sender.image || "./testimg/icon.jpg"} alt=""/></div>
                            <div className="messagenum">20</div>
                            <div className="navbg messagev"></div>
                        </div>
                        <div className="messagename">
                            <div className="messagetime">{nowDateTime}</div>
                            <div className="messagen">{item.sender.full_name}</div>
                        </div>
                        <div className="messagetxt">
                            {item.content}
                        </div>
                    </li>
                });
            }else{
                messageTmp[0] = <li className="messageList">
                                    <div className="nomessage">暂无用户私信</div>
                                </li>
            }

            return (
                <MainComp btnsConf={this.props.btnsConf} title={this.props.title} navClass="comp-nav-messagebtn" gclass="messageCont">
                    <div className="messageListBox">
                        <div className="messageBox">
                            {esMessage > 0 &&
                                <div className="messageNotice" onClick={this.readmessage.bind(this)}>
                                    <div className="noticeIcon"><em className="bgimg sicon"></em></div>
                                    <div className="noticeName">社交通知</div>
                                    <div className="noticeNum" ref="messageNum">{esMessage}</div>
                                    <div className="bgimg noticeArow"></div>
                                </div>
                            }
                            <div className="messageNotice" onClick={this.readcard.bind(this)}>
                                <div className="noticeIcon"><em className="bgimg cicon"></em></div>
                                <div className="noticeName">卡券通知</div>
                                <div className="noticeNum">20</div>
                                <div className="bgimg noticeArow"></div>
                            </div>
                        </div>
                        <ul className="messageLists">
                        {messageTmp}
                        </ul>
                    </div>
                </MainComp>
            )
        },
        readmessage (){
            var messageNum = this.refs.messageNum;
            messageNum.innerText = "0";
            Router.navigate('messages/sns/');
        },
        readcard (){
            Router.navigate('messages/card/2')
        },
        getUserChat(e){
            var Jtarget = $(e.currentTarget);
            var sender = Jtarget.data('uid');
            Router.navigate('messages/private/' + sender);
        }
    });
    return MessageViewComponent;
})