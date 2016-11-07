/**
 * Created by sqsun on 2015/9/22.
 */
define(['react', 'jsx!headerViewComponent', 'koala', 'Models', 'router', 'RESTF', 'geo'], function(React, HeaderComp, Koala, Models, Router, RESTF) {
    var ModelRestf = RESTF.publishEventModel.getInstance();
    var ModelAddress = RESTF.publishAddressModel.getInstance();
    var ModelToken = RESTF.getTokenModel.getInstance();

    var Toast = new Koala.kUI.Toast();

    var positionNum = 0;
    var mapKey = "OB4BZ-D4W3U-B7VVO-4PJWW-6TKDJ-WPB77";
    var mapReferer = "HappyPlay";
    var geoLocation = new qq.maps.Geolocation(mapKey, mapReferer);
    var formsData = {};
    var geoData = {};
    var uptoken = '';
    var imgCDN = 'http://7xpyh6.com1.z0.glb.clouddn.com/';
    var imageCount = 0;
    var sdate = '';
    var edate = '';

    var PublishViewComponent = React.createClass({
        getInitialState: function() {
            this.ul = {};
            this.pric = {};
            return {first: true, secend: false, nextbtn: this.nextbtnFn, btxt: "下一步", vbox: 1, mask: false};
        },
        componentDidMount: function(){
            ModelToken.setParam({}).execute().then(function(data){
                if(data && data.non_field_errors){
                    Toast.show({
                        Content: data.non_field_errors || '获取Token失败，请稍后再试'
                    })
                }else{
                    uptoken = data.token;
                }
            },function(){
                Toast.show({
                    Content: '网络不给力啊，请稍后再试'
                })
            }).catch(function(e){
                console.log(e)
            });
        },
        componentDidUpdate: function(){
            $(React.findDOMNode(this.refs.dtbox)).DateTimePicker({dateTimeFormat: "yyyy-MM-dd HH:mm"});
            imageCount = 0;
        },
        componentWillReceiveProps: function (nextProps) {
            this.ul = {};
            this.pric = {};
            this.setState({first: true, secend: false, nextbtn: this.nextbtnFn, btxt: "下一步", vbox: 1, mask: false});
        },
        render: function() {
            var btnsConf = this.props.btnsConf;
            btnsConf.nextbtn = this.state.nextbtn;
            return (
                <section className="flex view-warp">
                    <HeaderComp btnsConf={btnsConf} title={this.props.title} btxt={this.state.btxt} headClass="gifheader" />
                    {this.state.first &&
                    <section className="comp-content publish-cont flex bgefefef">
                        <div className="pictopicbox mtp20">
                            <input type="text" autofocus className="pictopic" ref="publishTitle" placeholder="活动标题..."/>
                        </div>
                        <div className="publish-filed">
                        <textarea type="text" className="publish-content" ref="publishContent" onFocus={this.cfocus.bind(this)} onBlur={this.cblur.bind(this)}>
                                活动介绍...
                        </textarea>
                        </div>


                        <div className="picevetnbox">
                            <div ref="publishimgbox">

                            </div>

                            <div className="picaddbtn">
                                <input className="pblish-photo" type="file" onChange={this.upimgnew.bind(this)} capture="" accept="image/*"/>
                            </div>
                        </div>

                    </section>
                    }
                    {
                        this.state.secend &&
                        <section className="comp-content publish-cont flex">
                            <div className="publish-sfiled">
                                <label className="publish-tlabel">活动开始时间</label>
                                <div className="pblish-time">
                                    <input type="text" readonly className="publish-time" ref="publishSTime" value={sdate} data-field="datetime" onFocus={this.CFocus.bind(this)} />
                                </div>
                                <div className="bgimg pblisharow"></div>
                            </div>
                            <div className="publish-sfiled">
                                <label className="publish-tlabel">活动结束时间</label>
                                <div className="pblish-time">
                                    <input type="text" readonly className="publish-time" id="publishetime" ref="publishETime" value={edate} data-field="datetime"  onFocus={this.CFocus.bind(this)}/>
                                </div>
                                <div className="bgimg pblisharow"></div>
                            </div>
                            <div className="publish-sfiled" onClick={this.geolocation.bind(this)}>
                                <label style={{width:"30px"}} className="publish-tlabel">地址</label>
                                <div className="pblish-time">
                                    <input type="text" readonly className="publish-time" ref="publishEAddress"/>
                                </div>
                                <div className="bgimg pblisharow"></div>
                            </div>
                            <div className="publish-sfiled pbtspec">
                                <label className="publish-tlabel">人数限制</label>
                                <div className="pblish-time">
                                    <input type="tel" className="publish-time" ref="publishNumber" />
                                </div>
                                <div className="pblishtext">人</div>
                            </div>
                            <div className="publish-sfiled">
                                <label className="publish-tlabel">参与用户级别</label>
                                <div className="pblish-time" onClick={this.changeUL.bind(this, 1)}>
                                    <input type="text" readonly className="publish-time" ref="publishUser" value={this.ul.tx || '所有用户'} onFocus={this.CFocus.bind(this)} data-v={this.ul.v || 0} />
                                </div>
                                <div className="bgimg pblisharow"></div>
                            </div>
                            <div className="publish-sfiled pblish-vline" style={{display:"none"}}>
                                <label className="publish-tlabel">费用</label>
                                <div className="pblish-time" onClick={this.changeUL.bind(this, 2)}>
                                    <input data-v="0" type="text" className="publish-time pbprice" ref="publishPrice" value={this.pric.tx || '免费'} onFocus={this.CFocus.bind(this)}  data-v={this.pric.v || 0}/>
                                </div>
                                <div className="pblishtext">元</div>
                            </div>
                            {this.state.mask &&
                            <div className="cui-mask pubmask">
                                {this.state.vbox == 1 &&
                                <div className="userlevalbox">
                                    <div className="userlitem" data-v="0" onClick={this.changeUleval.bind(this)}>
                                        <div className="userltitle">公开</div>
                                        <div className="userldec">所有人可见</div>
                                    </div>
                                    <div className="userlitem">
                                        <div className="userltitle">用户好玩指数大于等于</div>
                                        <div className="userldec">仅部分人可见</div>
                                        <div className="userlinput">
                                            <input type="tel" data-v="1" className="userl-input" onInput={this.changeUleval.bind(this)} onBlur={this.changeUlevaldone.bind(this)}/>
                                        </div>
                                    </div>
                                </div>
                                }
                                {this.state.vbox == 2 &&
                                <div className="userlevalbox">
                                    <div className="userlitem" data-v="0" onClick={this.changePric.bind(this)}>
                                        <div className="userltitle">免费</div>
                                        <div className="userldec">无需任何费用</div>
                                    </div>
                                    <div className="userlitem">
                                        <div className="userltitle">自定义费用</div>
                                        <div className="userldec">需要支付一定的费用</div>
                                        <div className="userlinput">
                                            <input type="tel" data-v="1" className="userl-input" onInput={this.changePric.bind(this)} onBlur={this.changeUlevaldone.bind(this)}/>
                                        </div>
                                    </div>
                                </div>
                                }
                            </div>
                            }
                        </section>
                    }
                    <div ref="dtbox"></div>
                </section>
            );
        },
        changeUleval(e){
            var Jtarget = $(e.currentTarget);
            var V = Jtarget.data('v');
            if(V == '0'){
                this.ul.tx = "所有人";
                this.ul.v = V;
                this.setState({mask: false})
            }else{
                V = Jtarget.val();
                this.ul.tx = "好玩指数大于等于" + V;
                this.ul.v = V;
            }
        },
        changeUlevaldone(){
            this.setState({mask: false})
        },
        changePric(e){
            var Jtarget = $(e.currentTarget);
            var V = Jtarget.data('v');
            if(V == '0'){
                this.pric.tx = "免费";
                this.pric.v = V;
                this.setState({mask: false})
            }else{
                V = Jtarget.val();
                this.pric.tx = V;
                this.pric.v = V;
            }
        },
        changeUL(ibox){
            sdate = this.refs.publishSTime.value;
            edate = this.refs.publishETime.value;
            if(ibox == 1){
                this.setState({mask: true, vbox: 1})
            }else{
                this.setState({mask: true, vbox: 2})
            }
        },
        CFocus(e){
            e.preventDefault();
            e.currentTarget.blur();
        },
        nextbtnFn: function(){
            var titleInput = this.refs.publishTitle;
            var contentInput = this.refs.publishContent;
            var titleVal = titleInput.value;
            var contentVal = contentInput.value;
            var imgbox = $(this.refs.publishimgbox);
            var imgArr = imgbox.find('img');
            var imgUrls = '';
            if(titleVal == '' && titleVal.length > 20){
                Toast.show({
                    Content: '请正确填写活动标题，最大长度20个字符'
                });
                titleInput.focus();
                return
            }

            if(contentVal == '活动介绍...'){
                contentInput.focus();
                return
            }

            if(imgArr.length > 0){
                imgArr.map(function(index, item){
                    var cimgurl = item.getAttribute('data-cdn');
                    imgUrls+= cimgurl + '||'
                })
            }else {
                Toast.show({
                    Content: '请先添加图片'
                })
                return ;
            }


            formsData = {title: titleVal, content: contentVal, cover_image: imgUrls,name:'前端H5默认值'+ new Date().getTime() };
            this.setState({first: false, secend: true, nextbtn: this.publishFn, btxt: "发布"});
        },
        publishFn(){
            var self = this;
            var stimeInput = self.refs.publishSTime;
            var etimeInput = self.refs.publishETime;
            var eaddDom = self.refs.publishEAddress;
            var numberInput = self.refs.publishNumber;
            var userInput = self.refs.publishUser;
            var priceInput  = self.refs.publishPrice;
            var stimeVal = stimeInput.value;
            var stimeVdate = new Date(stimeVal);
            var etimeVal = etimeInput.value;
            var etimeVdate = new Date(etimeVal);
            var eaddressVal = eaddDom.value;
            var numberVal = numberInput.value;
            var userVal = userInput.getAttribute("data-v");
            var priceVal = priceInput.getAttribute("data-v");
            var reg = /^[0-9]*[1-9][0-9]*$/;
            var userinfo = Models.userinfo.get();

            if(stimeVal == ''){
                Toast.show({
                    Content: '请正确填写活动开始时间'
                });
                return
            }

            if(etimeVal == ''){
                Toast.show({
                    Content: '请正确填写活动结束时间'
                });
                return
            }

            if(etimeVdate <= stimeVdate){
                Toast.show({
                    Content: '活动结束时间不能小于活动开始时间'
                });
                return
            }

            if(!reg.test(numberVal)){
                Toast.show({
                    Content: '请正确输入人员数量'
                });
                numberInput.value = '';
                numberInput.focus();
                return

            }

            if(eaddressVal == '活动地址'){
                Toast.show({
                    Content: '请获取您的活动地址'
                });
                return
            }

            var formP = {
                founder: userinfo.id,
                event_begin_time: stimeVal,
                event_end_time : etimeVal,
                participant_number: numberVal,
                participant_limit: userVal,
                ticket_amount: priceVal
            }

            formsData = _.extend(formsData, formP);

            Router.loading.show();
            console.log(geoData)
            ModelAddress.setParam(geoData).execute().then(function(data){
                if(data && data.non_field_errors){
                    Toast.show({
                        Content: data.non_field_errors || '上传地址失败，请稍后再试'
                    })
                }else{
                    formsData.address = data.id;
                    ModelRestf.setParam(formsData).execute().then(function(data){
                        if(data && data.non_field_errors){
                            Toast.show({
                                Content: data.non_field_errors || '发布活动失败，请稍后再试'
                            })
                        }else{
                            Router.loading.hide();
                            Toast.show({
                                Content: '恭喜你，活动发布成功',
                                callBack: function(){
                                    Router.navigate('index')
                                }
                            })

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
            },function(){
                Router.loading.hide();
                Toast.show({
                    Content: '网络不给力啊，请稍后再试'
                })
            }).catch(function(e){
                console.log(e)
            });
        },
        cfocus(e){
            var val = e.target.value;
            if(val == '活动介绍...'){
                e.target.value = ""
            }
        },
        cblur(e){
            var val = e.target.value;
            if(val == ''){
                e.target.value = "活动介绍..."
            }
        },
        geolocation(){
            var self = this;
            // TODO popup 抽出模块
            // TODO 搜索位置 抽出模块
            var $popup = $('#js-location-picker');
            if (!$popup.length) {
                var popup = document.createElement('div');
                popup.className = 'popup';
                popup.id = 'js-location-picker';
                popup.innerHTML = '<div class="popup_box"><div class="popup_header"><p>选择地址</p><a href="javascript:void(0)" class="bgimg icodeclose js-close"></a></div><div class="popup_content"><iframe src="' + "http://3gimg.qq.com/lightmap/components/locationPicker2/index.html?search=1&type=1&referer=" + mapReferer + "&key=" + mapKey + '" style="border: 0; width: 100%; height: 100%;"></iframe></div></div>';
                document.body.appendChild(popup);
                $popup = $(popup);
                $popup.fadeIn();

                $popup.on('click', function(){
                    $popup.fadeOut();
                });
                $popup.on('click', '.popup_content', function(e){
                    e.stopPropagation();
                });
                $popup.on('click', '.js-close', function() {
                    $popup.fadeOut();
                });
            } else {
                $popup.fadeIn();
            }

            var selectLocationHandle = function(event) {
                // 接收位置信息，用户选择确认位置点后选点组件会触发该事件，回传用户的位置信息
                var loc = event.data;

                //防止其他应用也会向该页面post信息，需判断module是否为'locationPicker'
                if (loc && loc.module == 'locationPicker') {
                    $popup.fadeOut();
                    window.removeEventListener('message', selectLocationHandle, false);


                    var address = self.refs.publishEAddress;
                    address.value = loc.poiaddress;
                    var latlng = loc.latlng || {};
                    geoData = {
                        name: loc.poiaddress,
                        country: '中国',
                        province: '',
                        city: loc.cityname,
                        city_zone: '',
                        longitude: latlng.lng,
                        latitude: latlng.lat
                    };
                }
            }
            window.addEventListener('message', selectLocationHandle, false);
        },
        upimgnew (e){
            var _this = e.currentTarget;
            var src = _this.files;
            var imgbox = $(this.refs.publishimgbox);
            var addimglen = imgbox.find('img').length;
            var self = this;
            if(src[0]){
                var imgfile = _.values(src);
                var imgflength = imgfile.length;
                imageCount = imageCount + imgflength;
                if(imgfile.length > 9 || imageCount > 9){
                    imageCount = addimglen;
                    Toast.show({
                        Content: '最多只能上传9张图片'
                    });
                    return
                }
                Router.loading.show();
                for(var key=0; key < imgflength; key++){
                    var img = imgfile[key];
                    self.uploadIMG(img,function(data, cdata){
                        var imgTmp='<div class="picnum"><img data-cdn="'+ imgCDN + cdata.key +'" src="'+ data +'" width="85px" height="85px" /></div>';
                        imgbox.append(imgTmp);
                        Router.loading.hide();
                    });
                }
            }
        },
        uploadIMG: function(file,callback){
            if(file.type){
                if(!/image\/\w+/.test(file.type)){
                    Router.loading.hide();
                    Toast.show({
                        Content: '请确保文件为图像类型'
                    })
                    return;
                }
                var reader = new FileReader();
                reader.readAsDataURL(file);
                reader.onload = function(e){
                    var picdata = this.result;
                    var spicdata = picdata.split("base64,")[1];
                    var fileName = new Date().valueOf() + "_" + file.name;
                    var url = "http://up.qiniu.com/putb64/-1/" + fileName;
                    var xhr = new XMLHttpRequest();
                    xhr.onreadystatechange=function(){
                        if (xhr.readyState == 4 && xhr.status == 200 && xhr.responseText != "") {
                            var blkRet = JSON.parse(xhr.responseText);
                            return callback(picdata, blkRet);
                        } else if (xhr.status != 200 && xhr.responseText) {
                            alert('图片上传失败，请确认您选择的是图片文件！')
                        }
                    }
                    xhr.open("POST", url, true);
                    xhr.setRequestHeader("Content-Type", "application/octet-stream");
                    xhr.setRequestHeader("Authorization", "UpToken " + uptoken);
                    xhr.send(spicdata);
                }
            }
        }
    });
    return PublishViewComponent;
})
