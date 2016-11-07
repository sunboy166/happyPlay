/**
 * Created by sqsun on 2015/9/22.
 */
define(['react', 'jsx!headerViewComponent', 'router', 'koala', 'gifshot', 'Models', 'RESTF'], function(React, HeaderComp, Router, Koala, gifshot, Models, RESTF) {
    var ModelToken = RESTF.getTokenModel.getInstance();

    var ModelRestf = RESTF.showsubmitModel.getInstance();


    var Toast = new Koala.kUI.Toast();
    var gifSpeed = 0.2;
    var gifImgData = '';
    var tabClass = [];
    var taboxClass = [];
    var gifCDN = '';
    var eventid = '';
    var GifViewComponent = React.createClass({
        getInitialState: function() {
            return {first: true, secend: 1, btxt: '下一步'};
        },
        componentDidUpdate: function(){

        },
        componentWillReceiveProps: function (nextProps) {
            this.setState({first: true, secend: 1, btxt: '下一步'});
        },
        render: function() {
            var btnsConf = this.props.btnsConf;
            btnsConf.nextbtn = this.nextbtn;
            eventid = this.props.event;
            console.log(eventid);
            if(this.state.secend == 1){
                tabClass[0] = 'uctab uctcur';
                tabClass[1] = 'uctab';
                taboxClass[0] = 'gifimgsbox';
                taboxClass[1] = 'gifspeedbox none';
            }else{
                tabClass[0] = 'uctab';
                tabClass[1] = 'uctab uctcur';
                taboxClass[0] = 'gifimgsbox none';
                taboxClass[1] = 'gifspeedbox';
            }
            $(this.refs.gifimgsList).find(".gifimg").remove();
            return (
                <section className="flex view-warp">
                    <HeaderComp btnsConf={btnsConf} title={this.props.title} btxt={this.state.btxt} headClass="gifheader" />
                    {this.state.first &&
                    <section className="comp-content publish-cont">
                        <section className="gifviewbox img-auto-wrap">
                            <img ref="gifV" src="./testimg/gifv.jpg" width="100%" alt=""/>
                            <div className="cgifbtn" onClick={this.makeGif.bind(this)}></div>
                        </section>
                        <section className="gifctrlbox">
                            <div className="uctabs">
                                <div className={tabClass[0]} onClick={this.imgsort.bind(this)}>调整图片顺序</div>
                                <div className={tabClass[1]} onClick={this.playspeed.bind(this)}>播放速度</div>
                            </div>
                            <section className={taboxClass[0]}>
                                <ul className="gifimgs" ref="gifimgsList">
                                    <li className="gifimgadd">
                                        <input ref="fileData" className="pblish-photo" type="file" accept="image/*" multiple onChange={this.imgChange.bind(this)}/>
                                    </li>
                                </ul>
                            </section>
                            <section className={taboxClass[1]} onClick={this.setGifspeed.bind(this)}>
                                <div className="gifspeedbtn" data-val="0.1">快</div>
                                <div className="gifspeedbtn cspeed" data-val="0.5">中</div>
                                <div className="gifspeedbtn" data-val="0.9">慢</div>
                            </section>
                        </section>
                    </section>
                    }

                    {!this.state.first &&
                    <section className="comp-content publish-cont gifval">
                        <div className="giftext">
                            <textarea  className="gifinput" ref="gifInput" placeholder="这一刻的想法..." rows="4"></textarea>
                        </div>
                        <div className="gifvimg">
                            <img src={gifImgData} width="150px" height="108px" />
                        </div>
                    </section>    
                    }
                </section>
            )
        },
        nextbtn(){
            var self = this;
            if(gifImgData.length < 1){
                Toast.show({
                    Content: '请先生成GIF动画，然后再提交'
                });
                return
            }
            if(self.state.first){
                var url = "http://up.qiniu.com/putb64/-1";
                var imgCDN = 'http://7xpyh6.com1.z0.glb.clouddn.com/';
                Router.loading.show();
                ModelToken.setParam({}).execute().then(function(data){
                    if(data && data.non_field_errors){
                        Toast.show({
                            Content: data.non_field_errors || '获取Token失败，请稍后再试'
                        })
                    }else{
                        var xhr = new XMLHttpRequest();
                        xhr.onreadystatechange=function(){
                            if (xhr.readyState == 4 && xhr.status == 200 && xhr.responseText != "") {
                                Router.loading.hide();
                                var blkRet = JSON.parse(xhr.responseText);
                                gifCDN = imgCDN + blkRet.key;
                                self.setState({first: false, btxt: '发布'});
                            } else if (xhr.status != 200 && xhr.responseText) {
                                Toast.show({
                                    Content: '上传git图到CDN失败'
                                })
                            }
                        }
                     
                        xhr.open("POST", url, true); 
                        xhr.setRequestHeader("Content-Type", "application/octet-stream"); 
                        xhr.setRequestHeader("Authorization", "UpToken " + data.token);
                        var gifImgBeta = gifImgData.split("base64,")[1];
                        xhr.send(gifImgBeta);
                    }
                },function(){
                    Router.loading.hide();
                    Toast.show({
                        Content: '网络不给力啊，请稍后再试'
                    })
                }).catch(function(e){
                    console.log(e)
                });
            }else{
                var userinfo = Models.userinfo.get();
                var gifTxt = this.refs.gifInput.value;
                if(gifTxt.length < 1 || gifTxt == '这一刻的想法...'){
                    Toast.show({
                        Content: '请写点这一刻的想法吧。。',
                        callBack: function () {
                            
                        }
                    });
                    return
                }
                ModelRestf.setParam({author: userinfo.id,
                        content: gifTxt,
                        cover_image: gifCDN,
                        event: eventid
                    }).execute().then(function(data){
                    if(data && data.non_field_errors){
                        Toast.show({
                            Content: data.non_field_errors || '获取Token失败，请稍后再试'
                        })
                    }else{
                        Toast.show({
                            Content: '发布晒成功',
                            callBack: function(){
                                window.history.go(-1)
                            }
                        })
                    }
                },function(){
                    Toast.show({
                        Content: '网络不给力啊，请稍后再试'
                    })
                }).catch(function(e){
                    console.log(e)
                });
            }
        },
        imgsort(){
            this.setState({secend: 1});
        },
        playspeed(){
            this.setState({secend: 2});
        },
        imgChange(e){
            var self = this;
            var _this = e.currentTarget;
            var src = _this.files;
            var gifimgsList = $(this.refs.gifimgsList);
            var imgCount = 1;
            var readData = function(file) {
                if ( /\.(jpe?g|png|gif)$/i.test(file.name) ) {
                    var reader = new FileReader();
                    reader.addEventListener("load", function () {
                        self.compressImg(this.result, function(data){
                            imgCount++;
                            var filesTmp = '<li class="gifimg"><img src="'+ data +'" width="100%" height="100%" alt=""/></li>';
                            gifimgsList.css("width", 170 * imgCount + "px").append(filesTmp);
                        });
                    }, false);
                    reader.readAsDataURL(file);
                }
            }
            if (src) {
                [].forEach.call(src, readData);
            }
        },
        compressImg(date, callback){
            var img = new Image();
            img.onload = function () {
                var that = this;
                //生成比例
                var w = that.width,
                    h = that.height,
                    scale = w / h;
                w = 750 || w;              //750  你想压缩到多大，改这里
                h = w / scale;
                //生成canvas
                var canvas = document.createElement('canvas');
                var ctx = canvas.getContext('2d');
                $(canvas).attr({width : w, height : h});
                ctx.drawImage(that, 0, 0, w, h);
                var base64 = canvas.toDataURL('image/jpeg', 0.8);   //1最清晰，越低越模糊
                img = canvas = null;
                if(callback){
                    return callback(base64)
                }else{
                    return base64;
                }
            }
            img.src = date;
        },
        makeGif(){
            var JgifV = $(this.refs.gifV);
            var JgifimgsList = $(this.refs.gifimgsList);
            var gifData =[];
            var gifimgs = JgifimgsList.find('img');
            $.each(gifimgs, function(){
                var imgData = $(this).attr("src");
                gifData.push(imgData);
            });
            if(gifData.length > 1){
                Router.loading.show();
                gifshot.createGIF({
                    images: gifData,
                    interval: gifSpeed,
                    numWorkers: 3,
                    gifWidth: 600,
                    gifHeight: 800
                }, function(obj) {
                    Router.loading.hide();
                    if (!obj.error) {
                        gifImgData = obj.image;
                        JgifV.attr("src", obj.image);
                    } else {
                        Toast.show({
                            Content: '服务不给力，生成GIF图失败'
                        })
                    }
                }); 
            }else{
                Toast.show({
                    Content: '亲，请先添加几张图片吧'
                });
                return
            } 
        },
        setGifspeed(e){
            var Obj = $(e.target);
            gifSpeed = Obj.data('val');
            Obj.addClass('cspeed').siblings().removeClass('cspeed');
        }
    });
    return GifViewComponent;
})