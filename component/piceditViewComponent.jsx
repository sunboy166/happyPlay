/**
 * Created by sqsun on 2015/9/22.
 */
define(['react', 'jsx!headerViewComponent', 'koala', 'Models', 'RESTF', 'router', 'hummer','$location', 'exif-js', 'easeljs'], function(React, HeaderComp, Koala, Models, RESTF, Router, Hammer,$location, EXIF,createjs) {
    var ModelToken = RESTF.getTokenModel.getInstance();
    var ModelRestf = RESTF.showsubmitModel.getInstance();
    var Toast = new Koala.kUI.Toast();
    var imageCount = 1;
    var eventid = 0;
    var caman = null;
    var curImg = '';
    var canvas = null;
    var stage = null;
    var tietuC = null;//贴图容器
    var borderC = null;//边框容器
    var ctrEle = null;//当前变换的元素
    var fw = null;
    var fh = null;
    var w;
    var h;
    var swidth = $(window).width();
    var cp_scale;
    var xxEvents = ('ontouchstart' in window) ? {
        start: 'touchstart', move: 'touchmove', end: 'touchend'
    } : {
        start: 'mousedown', move: 'mousemove', end: 'mouseup'
    };
    var PiceditViewComponent = React.createClass({
        getInitialState: function() {
            return {
                first: true,
                secend: false,
                nextbtn: this.nextbtnFn,
                btxt: null,
                cmtab: 2,
                forms: {},
                reImg: false
            };
        },
        componentDidMount: function(){
            this.renderImage();
        },
        componentDidUpdate: function(){
            if(this.state.reImg && stage){
                this.renderImage();
            }
        },
        componentWillReceiveProps: function (nextProps) {
            canvas = stage = tietuC = borderC = ctrEle = null;
            this.setState(
                {
                    first: true,
                    secend: false,
                    nextbtn: this.nextbtnFn,
                    btxt: null,
                    cmtab: 2,
                    forms: {},
                    reImg: true
                }
            );
        },
        render: function() {
            var btnsConf = this.props.btnsConf;
            var showimg = Models.showimgbase.get() || "";
            var simgLen = 0;
            var showfilter = false;
            eventid = this.props.eventid;
            btnsConf.nextbtn = this.state.nextbtn;
            showimg = showimg.split('||').filter(function(v){
                return !!$.trim(v);
            });
            simgLen = showimg.length;
            return (
                <section className="flex view-warp">
                    <HeaderComp btnsConf={btnsConf} title={this.props.title} btxt={this.state.btxt} headClass="gifheader" />
                    {this.state.first &&
                    <section className="comp-content comp-pictruebox">
                        <div className="picturebox">
                            <div className="canvasbox">
                                <canvas id="canvas" width="800px" height="800px"></canvas>
                            </div>
                            <ul id="canvasCtr" className="disabled"><li></li><li></li><li></li><li></li><li></li></ul>
                        </div>
                        <div className="pictruemenu">
                            {this.state.cmtab == 1 &&
                            <div className="picmenutab">
                                {showfilter &&
                                <div className="picmtab cmtab" onClick={this.tabchange.bind(this, 1)}>滤镜</div>
                                }
                                < div className="picmtab" onClick={this.tabchange.bind(this, 2)}>贴纸</div>
                                < div className="picmtab" onClick={this.tabchange.bind(this, 3)}>相框</div>
                            </div>
                            }
                            {this.state.cmtab == 2 &&
                            <div className="picmenutab">
                                {showfilter &&
                                <div className="picmtab" onClick={this.tabchange.bind(this, 1)}>滤镜</div>
                                }
                                < div className="picmtab cmtab" onClick={this.tabchange.bind(this, 2)}>贴纸</div>
                                < div className="picmtab" onClick={this.tabchange.bind(this, 3)}>相框</div>
                            </div>
                            }
                            {this.state.cmtab == 3 &&
                            <div className="picmenutab">
                                {showfilter &&
                                <div className="picmtab" onClick={this.tabchange.bind(this, 1)}>滤镜</div>
                                }
                                < div className="picmtab" onClick={this.tabchange.bind(this, 2)}>贴纸</div>
                                < div className="picmtab cmtab" onClick={this.tabchange.bind(this, 3)}>相框</div>
                            </div>
                            }
                            <div className="picmodbox">
                                {this.state.cmtab == 1 &&
                                <ul className="piccomdlists" ref="piccomd">
                                    <li className="piccomd comdcur" onClick={this.picmod.bind(this, 0)}>
                                        <img src={showimg[simgLen-1]} width="165px" alt=""/>
                                        <div className="piccomdname">原图</div>
                                    </li>
                                    <li className="piccomd" onClick={this.picmod.bind(this, 1)}>
                                        <img src="./testimg/ft1.jpg" width="165px" alt=""/>
                                        <div className="piccomdname">布鲁克林</div>
                                    </li>
                                    <li className="piccomd" onClick={this.picmod.bind(this, 2)}>
                                        <img src="./testimg/ft2.jpg" width="165px" alt=""/>
                                        <div className="piccomdname">发条橙</div>
                                    </li>
                                    <li className="piccomd" onClick={this.picmod.bind(this, 3)}>
                                        <img src="./testimg/ft3.jpg" width="165px" alt=""/>
                                        <div className="piccomdname">皮克斯</div>
                                    </li>
                                </ul>
                                }
                                {this.state.cmtab == 2 &&
                                <ul className="piccomdlists">
                                    <li className="piccomd" onClick={this.addTietu.bind(this)}>
                                        <div className="piccimg">
                                            <img src="./testimg/i7.png" alt=""/>
                                        </div>
                                        <div className="piccomdname">贴纸1</div>
                                    </li>
                                    <li className="piccomd" onClick={this.addTietu.bind(this)}>
                                        <div className="piccimg">
                                            <img src="./testimg/i8.png" alt=""/>
                                        </div>
                                        <div className="piccomdname">贴纸2</div>
                                    </li>
                                </ul>
                                }
                                {this.state.cmtab == 3 &&
                                <ul className="piccomdlists">
                                    <li className="piccomd comdcur" onClick={this.addTietu.bind(this)}>
                                        <div className="piccimg">
                                            <img src="./testimg/b1.png" alt="" data-type="box"/>
                                        </div>
                                        <div className="piccomdname">边框1</div>
                                    </li>
                                    <li className="piccomd" onClick={this.addTietu.bind(this)}>
                                        <div className="piccimg">
                                            <img src="./testimg/b2.png" alt="" data-type="box"/>
                                        </div>
                                        <div className="piccomdname">边框2</div>
                                    </li>
                                </ul>
                                }
                            </div>
                        </div>
                    </section>
                    }
                    {this.state.secend &&
                    <section className="comp-content comp-pictruebox">
                        <div className="picinput">
                            <textarea className="pictarea" autofocus ref="pictexare" onFocus={this.cfocus.bind(this)} onBlur={this.cblur.bind(this)} placeholder="这一刻的想法"></textarea>
                        </div>
                        {false &&
                        <div className="pictopicbox">
                            <input type="text" className="pictopic" ref="pictopic" placeholder="添加话题.."/>
                        </div>
                        }
                        <div className="picthurmbox">
                            {
                                showimg.map(function(item){
                                    if(item !== 'null'){
                                        return(<div className="picturm">
                                            <img src={item} width="70px" height="70px" />
                                        </div>)
                                    }
                                })
                            }
                            <div className="gifimgadd showpicaddbtn">
                                <input className="pblish-photo" type="file" capture="camera" multiple onChange={this.camPhoto.bind(this)} accept="image/*"/>
                            </div>
                        </div>
                    </section>
                    }
                </section>
            );
        },
        renderImage(){
            console.log(11);
            var self = this;
            var showimg = Models.showimgbase.get() || "";
            showimg = showimg.split('||');
            var simgLen = showimg.length;
            var Jcanvas = $('#canvas');
            var photo = new Image();//当前的照片

            //Jcanvas.css('width', swidth + 'px');
            photo.onload = function () {
                fw = photo.width;
                fh = photo.height;
                canvas = Jcanvas[0];
                if(!canvas){
                    return;
                }
                stage = new createjs.Stage(canvas);
                w = canvas.width;
                h = canvas.height;
                stage.removeAllChildren();
                //主函数
                var bg = new createjs.Shape();//背景
                bg.graphics.f("#fff").dr(0, 0, w, h);
                stage.addChild(bg);
                var cPhoto = new createjs.Bitmap(photo);//照片
                photo.c_width = photo.width;
                photo.c_height = photo.height;
                // 判断拍照设备持有方向调整照片角度
                switch(window.Orientation) {
                    case 3:
                        photo.c_width=photo.width;
                        photo.c_height=photo.height;
                        cPhoto.rotation = 180;
                        break;
                    case 6:
                        photo.c_width=photo.height;
                        photo.c_height=photo.width;
                        cPhoto.rotation = 90;
                        break;
                    case 8:
                        photo.c_width=photo.height;
                        photo.c_height=photo.width;
                        cPhoto.rotation = 270;
                        break;
                    default:
                        photo.c_width=photo.width;
                        photo.c_height=photo.height;
                }
                var cp_scale = w / photo.c_width;
                cPhoto.scaleX = cPhoto.scaleY = cPhoto.scaleMin = cp_scale;
                cPhoto.regX = photo.width / 2;
                cPhoto.regY = photo.height / 2;
                cPhoto.x = w / 2;
                cPhoto.y = h / 2;
                cPhoto.name = "photo";
                stage.addChild(cPhoto);
                tietuC = new createjs.Container();//贴图容器
                borderC = new createjs.Container();//边框容器
                stage.addChild(tietuC, borderC);
                stage.update();
                self.canvasBind();
            };
            photo.src = showimg[simgLen-1];
        },
        canvasBind(){
            //绑定交互事件
            var self = this;
            var mc = new Hammer.Manager(canvas);
            mc.add(new Hammer.Pinch());
            mc.add(new Hammer.Rotate());
            mc.add(new Hammer.Pan());
            mc.add(new Hammer.Tap());

            mc.on('pinchstart rotatestart panstart', function (e) {
                self.deleteCtr();
                if (!ctrEle) return;
                ctrEle.i_x = ctrEle.x;
                ctrEle.i_y = ctrEle.y;
                ctrEle.i_rotation = ctrEle.rotation;
                ctrEle.i_scale = ctrEle.scaleX;
                self.addCtr();
                e.preventDefault();
                return
            });

            mc.on('pinchmove rotatemove panmove', function (e) {
                if (!ctrEle) return;
                ctrEle.x = ctrEle.i_x + e.deltaX;
                ctrEle.y = ctrEle.i_y + e.deltaY;
                ctrEle.scaleX = ctrEle.scaleY = ctrEle.i_scale + (e.scale - 1);

                if (ctrEle.name == "photo") {
                    if (ctrEle.scaleX < ctrEle.scaleMin) {
                        ctrEle.scaleX = ctrEle.scaleY = ctrEle.scaleMin;
                    }
                }
                ctrEle.rotation = ctrEle.i_rotation + e.rotation;
                stage.update();
                return
            });

            mc.on('tap',function(e){
                self.deleteCtr();
                if(!ctrEle) return;
                self.addCtr();
            });
            //元素按钮控制
            var ctrBtn = $('#canvasCtr li');
            ctrBtn.eq(0).off().on(xxEvents.start, function () {
                if(!ctrEle){
                    return
                }
                ctrEle.scaleX = ctrEle.scaleY = ctrEle.scaleX + 0.05;
                stage.update();
            });
            ctrBtn.eq(1).off().on(xxEvents.start, function () {
                if(!ctrEle){
                    return
                }
                ctrEle.scaleX = ctrEle.scaleY = ctrEle.scaleX - 0.05;
                stage.update();
            });
            ctrBtn.eq(2).off().on(xxEvents.start, function () {
                if(!ctrEle){
                    return
                }
                ctrEle.rotation -= 5;
                stage.update();
            });
            ctrBtn.eq(3).off().on(xxEvents.start, function () {
                if(!ctrEle){
                    return
                }
                ctrEle.rotation += 5;
                stage.update();
            });
            ctrBtn.eq(4).off().on(xxEvents.start, function () {
                if(!ctrEle){
                    return
                }
                tietuC.removeChild(ctrEle);
                ctrEle = null;
                stage.update();
            });
        },
        camPhoto(e){
            var userinfo = Models.userinfo.get();
            var self = this;
            if(!userinfo.id){
                Toast.show({
                    Content: '您暂未登录，请登录后再来报名',
                    callBack: function(){
                        window.location.href = '#login';
                    }
                });
                return
            }
            var _this = e.currentTarget;
            var src = _this.files;
            var reader = new FileReader(),
                show = $location.search('show') === 'true';
            var limitLength = 10 - imageCount;
            if(limitLength <= 0) {
                Toast.show({
                    Content: '最多只能上传9张图片'
                });
                return
            }

            limitLength = Math.min(src.length, limitLength);
            imageCount += limitLength;
            for(var i = 0; i < limitLength; i++){
                if(src[i]) {
                    readFile(src[i], function(result){
                        self.compressImg(result, function(data){
                            var oldImg = Models.showimgbase.get();
                            oldImg = $.trim(oldImg);
                            if(oldImg.length < 1){
                                oldImg = data;
                            }else{
                                oldImg = oldImg + "||" + data;
                            }
                            Models.showimgbase.set(oldImg);
                            var state = null;
                            if(show) {
                                state = {
                                    first: !show,
                                    second: !!show,
                                    nextbtn: self.endbtnFn,
                                    btxt: '发布',
                                    forms: {}
                                }
                            } else {
                                state = {
                                    first: !show,
                                    secend: !!show,
                                    nextbtn: self.nextbtnFn,
                                    btxt: null,
                                    cmtab: 2,
                                    forms: {},
                                    reImg: true
                                }
                            }
                            self.setState(state);
                        })
                    })
                }
            }

            //读取文件
            function readFile(file, callback){
                var reader = new FileReader();
                reader.readAsDataURL(file);
                reader.onload = function(e){
                    callback(this.result);
                }
            }
        },
        compressImg(date, callback, op, from){
            var img = new Image();
            img.onload = function () {
                var that = this;
                EXIF.getData(img, function() {
                    img.orientation = EXIF.getTag(this, 'Orientation') || 1;
                    // 判断拍照设备持有方向调整照片角度
                    switch(img.orientation) {
                        case 3:
                            img.rotation = 180;
                            break;
                        case 6:
                            img.rotation = 90;
                            break;
                        case 8:
                            img.rotation = 270;
                            break;
                        default:
                    }
                    //生成比例
                    var w = img.width,
                        h = img.height;

                    if(!!from){
                        w = fw;
                        h = fh;
                    }

                    //生成canvas
                    var canvas = document.createElement('canvas');
                    var ctx = canvas.getContext('2d');
                    $(canvas).attr({width : w, height : h});
                    //判断图片拍摄方向是否旋转了90度
                    if (img.orientation == 6) {
                        ctx.save();//保存状态
                        ctx.translate(w / 2, h / 2);//设置画布上的(0,0)位置，也就是旋转的中心点
                        ctx.rotate(90 * Math.PI / 180);//把画布旋转90度
                        // 执行Canvas的drawImage语句
                        ctx.drawImage(img, Number(0) - h / 2, Number(0) - w / 2, h, w);//把图片绘制在画布translate之前的中心点，
                        ctx.restore();//恢复状态
                    } else {
                        // 执行Canvas的drawImage语句
                        ctx.drawImage(img, 0, 0, w, h);
                    }

                    if(typeof op === undefined){
                        op = 0.9
                    }
                    var base64 = canvas.toDataURL('image/jpeg', op);   //1最清晰，越低越模糊
                    img = canvas = null;
                    if(callback){
                        return callback(base64)
                    }else{
                        return base64;
                    }
                })
            }
            img.src = date;
        },
        tabchange: function(tabindex){
            this.setState({cmtab: tabindex, reImg: false})
        },
        picmod: function (mode){
            var self = this;
            var piccomdObj = self.refs.piccomd;
            var ccnames = $(piccomdObj).find('li.piccomd');
            var ccname = ccnames.eq(mode);
            ccname.addClass('comdcur').siblings().removeClass('comdcur');
            Router.loading.show();
            if(mode == 0){
                caman.revert(true);
                caman.render(function(){
                    Router.loading.hide();
                    self.setImgModel(0);
                });
            }else if(mode == 1){
                caman.revert(true);
                caman["love"]();
                caman.render(function(){
                    Router.loading.hide();
                    self.setImgModel(1);
                });
            }else if(mode == 2){
                caman.revert(true);
                caman["orangePeel"]();
                caman.render(function(){
                    Router.loading.hide();
                    self.setImgModel(2);
                });
            }else if(mode == 3){
                caman.revert(true);
                caman["jarques"]();
                caman.render(function(){
                    Router.loading.hide();
                    self.setImgModel(3);
                });
            }

        },
        setImgModel(fn){
            var oldImg = Models.showimgbase.get();
            var oldImgArr = oldImg.split('||');
            try {
                var base64 = canvas.toDataURL('image/jpeg', 1);
                this.compressImg(base64, function(data){
                    if(oldImgArr.length > 1){
                        var newImgData = '';
                        oldImgArr.pop();
                        newImgData = oldImgArr.join('||') + "||" + data;
                        Models.showimgbase.set(newImgData);
                    }else{
                        Models.showimgbase.set(data)
                    }
                    if(_.isFunction(fn)){
                        return fn()
                    }
                }, 1, 1)
            } catch(e){}
        },
        nextbtnFn: function(){
            var self = this;
            self.deleteCtr();
            self.setImgModel(function() {
                self.setState(
                    {
                        first: false,
                        secend: true,
                        nextbtn: self.endbtnFn,
                        btxt: '发布',
                        forms: {},
                        reImg: false
                    }
                )
            })
        },
        endbtnFn(){
            var showimg = Models.showimgbase.get() || "";
            var userinfo = Models.userinfo.get() || {};
            var Jpictexare = this.refs.pictexare;
            //var Jpictopic = this.refs.pictopic;
            var picareVal = Jpictexare.value.trim();
            //var pictpVal = Jpictopic.value.trim();
            showimg = showimg.split('||').filter(function(v){
                return !!$.trim(v);
            });
            var simglength = showimg.length;

            if(picareVal.length < 1 || picareVal == '这一刻的想法'){
                Toast.show({
                    Content: '请您正确填写这一刻的想法'
                })
                return
            }

            /*
            if(pictpVal.length < 1){
                Toast.show({
                    Content: '请您正确填写该话题'
                })
                return
            }*/
            if(showimg.length){          //如果发布的瞬间是有图的话
                Router.loading.show();
                var url = "http://up.qiniu.com/putb64/-1";
                var imgCDN = 'http://7xpyh6.com1.z0.glb.clouddn.com/';
                ModelToken.setParam({}).execute().then(function(data){
                    if(data && data.non_field_errors){
                        Toast.show({
                            Content: data.non_field_errors || '获取Token失败，请稍后再试'
                        })
                    }else{
                        var showimgStr = '';
                        var showimgnum = 0;
                        showimg.map(function(item){
                            var spicdata = item.split("base64,")[1];
                            var url = "http://up.qiniu.com/putb64/-1/";
                            var xhr = new XMLHttpRequest();
                            xhr.onreadystatechange=function(){
                                if (xhr.readyState == 4 && xhr.status == 200 && xhr.responseText != "") {
                                    var blkRet = JSON.parse(xhr.responseText);
                                    showimgStr += imgCDN + blkRet.key + "||";
                                    showimgnum++;
                                    if(showimgnum == simglength){
                                        submitShun({
                                            author: userinfo.id,
                                            //title: pictpVal,
                                            title: "",
                                            content: picareVal,
                                            cover_image: showimgStr,
                                            event: eventid
                                        });
                                    }
                                } else if (xhr.status != 200 && xhr.responseText) {
                                    alert('图片上传失败，请确认您选择的是图片文件！')
                                }
                            }
                            xhr.open("POST", url, true);
                            xhr.setRequestHeader("Content-Type", "application/octet-stream");
                            xhr.setRequestHeader("Authorization", "UpToken " + data.token);
                            xhr.send(spicdata);
                        })
                    }
                },function(){
                    Toast.show({
                        Content: '网络不给力啊，请稍后再试'
                    })
                }).catch(function(e){
                    console.log(e)
                });
            } else {                    //发布的瞬间是无图的
                submitShun({
                    author: userinfo.id,
                    //title: pictpVal,
                    title: "",
                    content: picareVal,
                    cover_image: '',
                    event: eventid
                });
            }

            //发布晒
            function submitShun(d){
                ModelRestf.setParam(d).execute().then(function(data){
                    if(data && data.non_field_errors){
                        Toast.show({
                            Content: data.non_field_errors || '发布晒图片失败，请稍后再试'
                        })
                    }else{
                        Router.loading.hide();
                        Toast.show({
                            Content: '恭喜你，晒图片发布成功',
                            callBack: function(){
                                //Router.navigate('index');
                                if(Router.previousView && Router.previousView.actionUrl){
                                    Router.navigate(Router.previousView.actionUrl);
                                }
                            }
                        });
                        //清空晒图片的内容
                        Models.showimgbase.set(" ");
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
        },
        cfocus(e){
            var ctarget = e.target;
            var val = ctarget.value;
            if(val == '这一刻的想法'){
                ctarget.value = ""
            }
        },
        cblur(e){
            var ctarget = e.target;
            var val = ctarget.value;
            if(val == ''){
                ctarget.value = "这一刻的想法"
            }
        },
        addEle(img){
            var self = this;
            //添加元素
            var addImg=new createjs.Bitmap(img);//照片
            addImg.name = "cimg" + Math.random();
            self.deleteCtr();
            if(img.dataset.type=="box"){
                borderC.removeAllChildren();
                borderC.addChild(addImg);
            }else{
                addImg.scaleX = addImg.scaleY = 0.5;
                addImg.regX= 150;
                addImg.regY= 150;
                addImg.x= swidth/2;
                addImg.y= 100;
                tietuC.addChild(addImg);
            }

            addImg.on('click', function(e){
                //console.log(e)
                self.deleteCtr();
                ctrEle = e.currentTarget;
            });
            ctrEle = addImg;
            stage.update();
        },
        deleteCtr(){
            if(!ctrEle) return;
            $('#canvasCtr').addClass('disabled');
            ctrEle.shadow = null;
            stage.update();
        },
        addTietu(e){
            var Jtarget = $(e.currentTarget);
            var img = Jtarget.find('img')[0];
            Jtarget.addClass('comdcur').siblings().removeClass('comdcur');
            this.addEle(img);
        },
        addCtr(){
            if(ctrEle.name!='photo'){
                $('#canvasCtr').removeClass('disabled');
                ctrEle.shadow = new createjs.Shadow("#00c85a", 5, 5, 30);
                stage.update();
            }
        }
    });
    return PiceditViewComponent;
})