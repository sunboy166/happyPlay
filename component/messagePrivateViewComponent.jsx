/**
 * Created by sqsun on 2015/9/22.
 */
define(['react', 'jsx!headerViewComponent', 'koala', 'Models', 'router', 'RESTF', 'react.backbone'], function(React, HeaderComp, Koala, Models, Router, RESTF) {
    var ModelRestf = RESTF.messageModel.getInstance();

    var Toast = new Koala.kUI.Toast();
    var PublishViewComponent = React.createBackboneClass({
        getInitialState: function() {
            return {first: true, secend: false};
        },
        componentDidMount: function(){

        },
        componentWillReceiveProps: function (nextProps) {
            this.setState({first: true, secend: false});
        },
        render: function() {
            var messages = this.getModel().get();
            var messageItem = {};
            var userinfo = Models.userinfo.get();
            var uid = userinfo.id;
            messages.map(function(item, index){
                var puid = item.sender;
                if(uid == puid){
                    messageItem[index] = <div className="messtext cuserbox">
                                            <div className="messuinfo">
                                                <img src="./testimg/icon.jpg" alt=""/>
                                            </div>
                                            <div className="messtxt">
                                                {item.content}
                                            </div>
                                         </div>
                    
                }else{
                    messageItem[index] = <div className="messtext">
                                                <div className="messuinfo">
                                                    <img src="./testimg/icon.jpg" alt=""/>
                                                </div>
                                                <div className="messtxt utxtbox">
                                                    {item.content}
                                                </div>
                                          </div>
                }
            });
            return (
                <section className="flex view-warp">
                    <HeaderComp btnsConf={this.props.btnsConf} title={this.props.title} />
                    <section className="comp-content publish-cont">
                        <div className="messagePBox cui-flexbd" ref="messageWindow">
                            <div className="messptimebox">
                                <span className="messptime">昨天 15:26</span>
                            </div>
                            {messageItem}
                        </div>
                        <div className="messagePInput">
                            <div className="messbutton" onClick={this.messageSend.bind(this)}>发送</div>
                            <div className="messinputbox">
                                <input type="text" ref="messInput" className="messinput" />
                            </div>
                        </div>
                    </section>
                </section>
            )
        },
        messageSend(){
            var messageObj = this.refs.messInput;
            var messageWindow = $(this.refs.messageWindow);
            var message = messageObj.value;
            var userinfo = Models.userinfo.get();
            var uid = this.props.uid;
            if(!userinfo.id){
                Toast.show({
                    Content: '您暂未登录，请登录后再来发布私信',
                    callBack: function(){
                        window.location.href = '#login';
                    }
                })
                return
            }

            if(message.length < 1){
                Toast.show({
                    Content: '请填写要发送的私信'
                })
                return
            }
            ModelRestf.setParam({
                    sender: userinfo.id,
                    receiver: uid,
                    content : message
                }).execute().then(function(data){
                if(data && data.non_field_errors){
                    Toast.show({
                        Content: data.non_field_errors || '发送私信失败，请稍后再试'
                    })
                }else{
                    var pmessagemodel = Models.message.get();
                        pmessagemodel.push(data);
                        messageObj.value = '';
                        Models.message.set(pmessagemodel)
                }
            },function(){
                Router.loading.hide();
                Toast.show({
                    Content: '网络不给力啊，请稍后再试'
                })
            }).catch(function(e){
                console.log(e)
            });
        }
    });
    return PublishViewComponent;
})