/**
 * Created by sqsun on 2015/9/22.
 */
define(['react', 'jsx!headerViewComponent', 'router', 'Models', 'koala', 'RESTF', 'kalendae', 'react.backbone'], function(React, HeaderComp, Router, Models, Koala, RESTF) {
    var ModelRestf = RESTF.eventDateModel.getInstance();
    var Toast = new Koala.kUI.Toast();
    var DateEventViewComponent = React.createBackboneClass({
        getInitialState: function() {
            return {};
        },
        componentDidMount: function(){
            var self = this;
            var datePacker = self.refs.datePacker;
            new Kalendae(datePacker, {
                mode:'single',
                selected:Kalendae.moment().subtract(),
                subscribe: {
                    'change': function (date) {
                        var sdate = this.getSelected();
                        self.getDlists(sdate)
                    }
                }
            });
        },
        componentWillReceiveProps: function (nextProps) {

        },
        getDlists(data){
            Router.loading.show();
            var userinfo = Models.userinfo.get();
            var nyear = new Date(data).getFullYear();
            var nmonth = new Date(data).getMonth() + 1;
            var nday = new Date(data).getDate();
            ModelRestf.setParam({user: userinfo.id, year: nyear, month: nmonth}).execute().then(function(data){
                Router.loading.hide();
                if(data && data.non_field_errors){
                    Toast.show({
                        Content: data.non_field_errors || '获取列表失败'
                    });
                }else{
                    var ndayLists = data[nday]
                    if(!ndayLists){
                        ndayLists = []
                    }
                    Models.eventDateList.set([{}]);
                    Models.eventDateList.set(ndayLists);
                }
            },function(){
                Toast.show({
                    Content: '网络不给力啊，请稍后再试'
                });
                Router.loading.hide()
            }).catch(function(e){
                console.log(e)
            });
        },
        render: function() {
            var lists = this.getModel().get();
            var listItem = {};
            var self = this;
            if(lists.length > 0){
                lists.map(function (event, index) {
                    var cimg = event.cover_image;
                    if(cimg){
                        cimg = cimg.split('||');
                    }else{
                        cimg = ['./testimg/pic.png']
                    }
                    listItem[index] = <li className="datevent" data-id={event.id} onClick={self.eventD.bind(this)}>
                        <div className="datevent-img">
                            <img src={cimg[0]} alt=""/>
                        </div>
                        <div className="datevent-head">
                            <div className="datevent-title">{event.title}</div>
                            <div className="datevent-stitle">{event.address && event.address.name}</div>
                        </div>
                        <div className="datevent-navbox">
                            <div className="datevent-jion">{event.participant_count + "人参与"}</div>
                            {event.joined &&
                            <div className="datevent-stat">已参加</div>
                            }

                            {!event.joined &&
                            <div className="datevent-stat">未参加</div>
                            }
                        </div>
                    </li>
                });
            }else{
                listItem[0] = <li className="datevent">
                                <div className="nodatevent">暂未发现当天的活动</div>
                              </li>
            }
            return (
                <section className="flex view-warp">
                    <HeaderComp btnsConf={this.props.btnsConf} title={this.props.title} />
                    <section className="comp-content publish-cont date-event">
                        <div className="datePacker" ref="datePacker"></div>
                        <ul className="date-events">
                            {listItem}
                        </ul>
                    </section>
                </section>
            )
        },
        eventD(e){
            var Jtarget = $(e.currentTarget);
            var id = Jtarget.data('id');
            if(id !== undefined){
                Router.navigate("event/detail/" + id);
            }
        }
    });
    return DateEventViewComponent;
})
