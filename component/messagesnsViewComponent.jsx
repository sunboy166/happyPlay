/**
 * Created by sqsun on 2015/9/22.
 */
define(['react', 'jsx!headerViewComponent', 'koala', 'router', 'Fn','react.backbone'], function(React, HeaderComp, Koala, Router,Fn) {
    var MessagesnsViewComponent = React.createBackboneClass({
        getInitialState: function() {
            return {};
        },
        goEvent(e){
            var Jtarget = $(e.currentTarget);
            var id = Jtarget.data('id');
            Router.navigate('event/detail/'+ id)
        },
        goShow(e){
            var Jtarget = $(e.currentTarget);
            var id = Jtarget.data('id');
            Router.navigate('sundetail/'+ id)
        },
        render: function() {
            var self = this;
            var obj_Models = this.getModel().get();
            var MSModels = obj_Models.data || [];
            var MSList = [];

            /*
            var itemindex = 0;
            var eventComment = MSModels.EventComment || []; //活动评论
            var showComment = MSModels.ShowComment || []; //晒评论
            var EventCollection = MSModels.EventCollection || []; //活动收藏
            var ShowCollection = MSModels.ShowCollection || []; //晒收藏
            var EventPraise = MSModels.EventPraise || []; //活动点赞
            var ShowPraise = MSModels.ShowPraise || []; //晒点赞
            console.log(MSModels);
            */

            if(MSModels && MSModels.length){
                for(var i =0 ,l = MSModels.length;i<l;i++){
                    var _item = MSModels[i];
                    switch (_item.social_type){
                        case "show-praise":show_Praise(_item); break;
                        case "event-praise":event_Praise(_item);break;
                        case "show-comment":show_Comment(_item);break;
                        case "event-comment":event_Comment(_item);break;
                        case "broadcast":break;
                    }
                }
            }

          //瞬间的赞
            function show_Praise(item){
                var eventItem = item.show || {};
                if(typeof item.user == Object){
                    var User = item.user;
                }else {
                    var User = eventItem.author;
                }
                var eventUser = eventItem.author || {};
                var eventAdd = eventItem.address || {};
                var evnetImg = eventItem.cover_image || '';
                evnetImg = evnetImg.split('||')[0];
                if(User.full_name){
                    MSList[MSList.length] = <li className="mesnslist" data-id={eventItem.id} onClick={self.goEvent.bind(self)}>
                        <div className="mesnsubox">
                            <div className="messageuicon">
                                <div className="messageui"><img src={User.image || "./testimg/icon.jpg"} alt=""/></div>
                                <div className="navbg messagev"></div>
                            </div>
                            <div className="messagename">
                                <div className="messagetime">{Fn.Date.format(item.created_at, 'yyyy-MM-dd hh:mm')}</div>
                                <div className="messagen">{User.full_name}</div>
                            </div>
                        </div>
                        <div className="mesnsfubox">
                            <div className="messageui"><img src={eventUser && eventUser.image || "./testimg/icon.jpg"}/></div>
                            <div className="mesnsftxt">用户“点赞了该晒”</div>
                        </div>
                        <div className="mesnsinclude">
                            <div className="mesnsimg img-auto-wrap img-auto-wrap2">
                                <img src={evnetImg || "./testimg/pic.png"} width="130" height="130" alt=""/>
                            </div>
                            <div className="mesnsitext">
                                <h3 className="mesnsititle">{eventItem.title || "暂无标题"}</h3>
                                <p className="mesnsitxt">{eventItem.content}</p>
                                <div className="mesnsitags">{eventAdd.province || eventAdd.city} · {eventAdd.name}<span className="c-green">&nbsp;&nbsp;进行中</span></div>
                            </div>
                        </div>
                    </li>;
                }
            }

            function event_Praise(item){
                var eventItem = item.event || {};
                if(typeof item.user == Object){
                    var User = item.user;
                }else {
                    var User = eventItem.founder;
                }
                var eventUser = eventItem.founder || {};
                var eventAdd = eventItem.address || {};
                var createdTime = new Date(item.created_at);
                var evnetImg = eventItem.cover_image || '';
                var nowDateTime = createdTime.getFullYear();
                nowDateTime = nowDateTime + ((createdTime.getMonth() + 1) < 10 ? "-0" + (createdTime.getMonth() + 1) : "-" + (createdTime.getMonth() + 1));
                nowDateTime = nowDateTime + (createdTime.getDate() < 10 ? "-0" + createdTime.getDate() : "-" + createdTime.getDate());

                evnetImg = evnetImg.split('||')[0];
                if(User.full_name){
                    MSList[MSList.length] = <li className="mesnslist" data-id={eventItem.id} onClick={self.goEvent.bind(self)}>
                        <div className="mesnsubox">
                            <div className="messageuicon">
                                <div className="messageui"><img src={User.image || "./testimg/icon.jpg"} alt=""/></div>
                                <div className="navbg messagev"></div>
                            </div>
                            <div className="messagename">
                                <div className="messagetime">{nowDateTime}</div>
                                <div className="messagen">{User.full_name}</div>
                            </div>
                        </div>
                        <div className="mesnsfubox">
                            <div className="messageui"><img src={eventUser && eventUser.image || "./testimg/icon.jpg"}/></div>
                            <div className="mesnsftxt">用户“点赞了该活动”</div>
                        </div>
                        <div className="mesnsinclude">
                            <div className="mesnsimg img-auto-wrap img-auto-wrap2">
                                <img src={evnetImg || "./testimg/pic.png"} width="130" height="130" alt=""/>
                            </div>
                            <div className="mesnsitext">
                                <h3 className="mesnsititle">{eventItem.title}</h3>
                                <p className="mesnsitxt">{eventItem.content}</p>
                                <div className="mesnsitags">{eventAdd.province || eventAdd.city} · {eventAdd.name}<span className="c-green">&nbsp;&nbsp;进行中</span></div>
                            </div>
                        </div>
                    </li>;
                }
            }

            function event_Comment(item){
                var eventItem = item.event || {};
                var commentItem = item.reply || {};
                var eventUser = eventItem.founder || {};
                var eventAdd = eventItem.address || {};
                var createdTime = new Date(item.created_at);
                var evnetImg = eventItem.cover_image || '';
                var nowDateTime = createdTime.getFullYear();
                nowDateTime = nowDateTime + ((createdTime.getMonth() + 1) < 10 ? "-0" + (createdTime.getMonth() + 1) : "-" + (createdTime.getMonth() + 1));
                nowDateTime = nowDateTime + (createdTime.getDate() < 10 ? "-0" + createdTime.getDate() : "-" + createdTime.getDate());

                evnetImg = evnetImg.split('||')[0];
                if(commentItem.length > 0){
                    commentItem = commentItem[0];
                    var commentUser = commentItem.user || {};
                    MSList[MSList.length] = <li className="mesnslist" data-id={eventItem.id} onClick={self.goEvent.bind(self)}>
                        <div className="mesnsubox">
                            <div className="messageuicon">
                                <div className="messageui"><img src={commentUser.image || "./testimg/icon.jpg"} alt=""/></div>
                                <div className="navbg messagev"></div>
                            </div>
                            <div className="messagename">
                                <div className="messagetime">{nowDateTime}</div>
                                <div className="messagen">{commentUser.full_name}</div>
                            </div>
                        </div>
                        <div className="mesnsfubox">
                            <div className="messageui"><img src={eventUser && eventUser.image || "./testimg/icon.jpg"}/></div>
                            <div className="mesnsftxt">{commentItem.content}</div>
                        </div>
                        <div className="mesnsinclude">
                            <div className="mesnsimg img-auto-wrap img-auto-wrap2">
                                <img src={evnetImg || "./testimg/pic.png"} width="130" height="130" alt=""/>
                            </div>
                            <div className="mesnsitext">
                                <h3 className="mesnsititle">{eventItem.title}</h3>
                                <p className="mesnsitxt">{eventItem.content}</p>
                                <div className="mesnsitags">{eventAdd.province || eventAdd.city} · {eventAdd.name}<span className="c-green">&nbsp;&nbsp;进行中</span></div>
                            </div>
                        </div>
                    </li>;
                }
            }

            function show_Comment(item){console.log(item);
                var eventItem = item.show || {};
                var commentItem = item.reply || {};
                var eventUser = eventItem.author || {};
                var eventAdd = eventItem.address || {};
                var createdTime = new Date(item.created_at);
                var evnetImg = eventItem.cover_image || '';
                var nowDateTime = createdTime.getFullYear();
                nowDateTime = nowDateTime + ((createdTime.getMonth() + 1) < 10 ? "-0" + (createdTime.getMonth() + 1) : "-" + (createdTime.getMonth() + 1));
                nowDateTime = nowDateTime + (createdTime.getDate() < 10 ? "-0" + createdTime.getDate() : "-" + createdTime.getDate());

                evnetImg = evnetImg.split('||')[0];
                if(commentItem.length > 0){
                    commentItem = commentItem[0];
                    var commentUser = commentItem.user || {};
                    MSList[MSList.length] = <li className="mesnslist" data-id={eventItem.id} onClick={self.goShow.bind(self)}>
                        <div className="mesnsubox">
                            <div className="messageuicon">
                                <div className="messageui"><img src={commentUser.image || "./testimg/icon.jpg"} alt=""/></div>
                                <div className="navbg messagev"></div>
                            </div>
                            <div className="messagename">
                                <div className="messagetime">{nowDateTime}</div>
                                <div className="messagen">{commentUser.full_name}</div>
                            </div>
                        </div>
                        <div className="mesnsfubox">
                            <div className="messageui"><img src={eventUser && eventUser.image || "./testimg/icon.jpg"}/></div>
                            <div className="mesnsftxt">{commentItem.content}</div>
                        </div>
                        <div className="mesnsinclude">
                            <div className="mesnsimg showsnsimg img-auto-wrap img-auto-wrap2">
                                <img src={evnetImg || "./testimg/pic.png"} width="100%" alt=""/>
                            </div>
                        </div>
                    </li>;
                }
            }

            return (
                <section className="flex view-warp">
                    <HeaderComp btnsConf={this.props.btnsConf} title={this.props.title} />
                    <section className="comp-content publish-cont">
                        <ul className="mesnslists">
                            {MSList}
                        </ul>
                    </section>
                </section>
            )
        }
    });
    return MessagesnsViewComponent;
})