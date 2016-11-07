/**
 * Created with PhpStorm.
 * User: LiuYang
 * Date: 2015/12/22
 * Time: 0:14
 * Description:通用函数库
 */
define(['C', 'underscore'],function(config, _){
    var toString = Object.prototype.toString;

    var Fn = {
        /**
         * 获取对象数值
         * @param obj 对象
         * @param keyName e.g 'a.b.c'
         * @param df 默认值
         * @returns {*}
         */
        getAttr: function(obj, keyName, df){
            var keyArr = keyName.split('.');
            if(typeof obj === 'object') {
                var curr = obj,
                    i = 0;
                while(keyArr[i]){
                    if(curr) {
                        curr = curr[keyArr[i]];
                        i++;
                        continue;
                    }
                    return df;
                }
                return (curr || df);
            }
            return (obj || df);
        },
        /**
         * 获取对象数值
         * @param obj 对象
         * @param keyName e.g 'a.b.c'
         * @param value 要设置的值
         * @returns {*}
         */
        setAttr: function(obj, keyName, value){
            var keyArr = keyName.split('.');
            var last = keyArr.pop();
            if(typeof obj === 'object') {
                var curr = obj,
                    i = 0;
                while(keyArr[i]){
                    if(curr) {
                        curr = curr[keyArr[i]];
                        i++;
                        continue;
                    }
                    return false;
                }
                curr[last] = value;
                return true;
            }
            return false;
        },
        /**
         * 要添加属性的对象
         * @param target 目标对象
         * @param source 源始对象
         * @returns {*} 返回目标对象
         */
        setMixin: function(target,source){
            var args = [].slice.call(arguments),
                i = 1,
                key,
                ride = typeof args[args.length - 1] == 'boolean' ? args.pop() : true;
            if(args.length === 1) {
                target = !this.window ? this : {};
                i = 0;
            }
            while(source = args[i++]){
                for(key in source){
                    //
                    if(ride || !(key in target)){
                        target[key] = source[key];
                    }
                }
            }
            return target;
        },
        /**
         * 对象的深拷贝
         * @param item 需要复制的对象
         * @returns {*}
         */
        deepClone: function(item){
            if(!item) return item;
            var types = [Number, String, Boolean],
                result ;

            // normalizing primitives if someone did new String('aaa'), or new Number('444');
            //一些通过new方式建立的东东可能会类型发生变化，我们在这里要做一下正常化处理
            //比如new String('aaa'), or new Number('444')
            types.forEach(function(type){
                if (item instanceof type) {
                    result = type(item);
                }
            });

            if(typeof result === 'undefined') {
                if(toString.call(item) === '[object Array]') {
                    result = [];
                    item.forEach(function(child, index, arr){
                        result[index] = clone(child);
                    });
                } else if(typeof item == 'object'){
                    // testign that this is DOM
                    //如果是dom对象，那么用自带的cloneNode处理
                    if(item.nodeType && typeof item.cloneNode == 'function') {
                        var result = item.cloneNode(true);
                    } else if(item.prototype) {
                        // check that this is a literal
                        // it is an object literal
                        //如果是个对象迭代的话，我们可以用for in 迭代来赋值
                        result = {};
                        for (var i in item){
                            result[i] = clone( item[i] );
                        }
                    } else {
                        // depending what you would like here,
                        // just keep the reference, or create new object
                        //这里解决的是带构造函数的情况，这里要看你想怎么复制了，深得话，去掉那个false && ，浅的话，维持原有的引用，
                        //但是我不建议你去new一个构造函数来进行深复制，具体原因下面会解释

                        if(false && item.constructor) {
                            // would not advice to do that, reason? Read below
                            //朕不建议你去new它的构造函数
                            result = new item.constructor();
                        } else {
                            result = item;
                        }
                    }
                } else {
                    result = item;
                }
            }
            return result;
        },
        /**
         * 字符串的重复展示
         * @param str
         * @param num
         * @returns {string}
         */
        str_repeat: function(str, num){
            return new Array(num+1).join(str);
        },
        /**
         * 浏览器
         */
        browser: {
            /**
             * 实现类似jquery 的css方法
             * @param ele
             */
            css: function(ele,attr,value){
                if(!(ele && ele.style && ele.style.cssText !== undefined)) return false;

                function isNeedAddPx(value){
                    return _.isNumber(value) ? value + 'px' : value;
                }

                function autoAddPrefix(attr, value){
                    var needPrefixMap = ['transition','transform'],
                        originStyle = attr + ':' + value + ';';
                    if(!(needPrefixMap.indexOf(attr) === -1)) {
                        var value = isNeedAddPx(value),
                            prefix = Fn.browser.getPrefix();
                        return prefix.css ? prefix.css + Fn.str_repeat(originStyle, 2) : originStyle;
                    }
                    return originStyle;
                }

                if(_.isObject(attr)) {
                    var str = '';
                    for(var i in attr){
                        if(attr[i]) str += autoAddPrefix(i, value);
                    }
                    ele.style.cssText = str;
                } else if(_.isString(attr)){
                    if(value) {
                        ele.style.cssText = autoAddPrefix(attr, value);
                    } else {
                        return window.getComputedStyle(ele, null)[attr];
                    }
                }
            },
            /**
             * 获取当前浏览器所需要的前缀
             */
            getPrefix: (function(){
                var styles = window.getComputedStyle(document.documentElement, ''),
                    pre = (Array.prototype.slice
                            .call(styles)
                            .join('')
                            .match(/-(moz|webkit|ms)-/) || (styles.OLink === '' && ['', 'o'])
                    )[1],
                    dom = ('WebKit|Moz|MS|O').match(new RegExp('(' + pre + ')', 'i'))[1];
                var ret = {
                    lowercase: pre,
                    css: '-' + pre + '-',
                    js: pre[0].toUpperCase() + pre.substr(1)
                };
                return function(){
                    return ret;
                }
            })(),
            /**
             * 判断当前浏览器是否为微信
             * @returns {boolean}
             */
            isWeixin: function(){
                return /MicroMessenger/i.test(navigator.userAgent);
            },
            /**
             * 是否在IOS APP中
             * @returns {boolean}
             */
            isInIosApp: function(){
                return ('_nativeReady' in window) ? true : false;
            },
            /**
             * 判断当前运行环境是否在android APP中
             * @returns {boolean}
             */
            isInAndroidApp: function(){
                return ('_cordovaNative' in window) ? true : false;
            },
            /**
             * 判断当前是否在APP中
             * @returns {*|boolean}
             */
            isInApp: function(){
                var browser = Fn.browser;
                return browser.isInAndroidApp() || browser.isInIosApp();
            }
        },
        /**
         * 验证器
         */
        validator: {
            /**
             * 验证手机号码
             * @param val
             * @returns {boolean}
             */
            mobile: function(val){
                return /^0{0,1}(13[0-9]|15[0-9]|17[0-9]|18[0-9])[0-9]{8}$/.test(val);
            },
            /**
             * 验证邮箱是否正确
             * @param val
             * @returns {boolean}
             */
            email: function(val){
                return /^0{0,1}(13[0-9]|15[0-9]|17[0-9]|18[0-9])[0-9]{8}$/.test(val);
            }
        },
        Files: {
            /**
             * 创建blob对象
             * @param blob
             * @returns {*}
             */
            createObjectURL:function (blob) {
                if(window.URL) {
                    return window.URL.createObjectURL(blob);
                }else if(window.webkitURL) {
                    return window.webkitURL.createObjectUrl(blob);
                }else {
                    return null;
                }
            },
            /**
             * 删除文件blob对象URL引用
             * @param url
             */
            revokeObjectURL: function(url){
                if(window.URL) {
                    window.URL.revokeObjectURL(url);
                } else if(window.webkitURL) {
                    window.webkitURL.revokeObjectURL(url)
                }
            },
            /**
             * 获取当前文件信息
             * @param blob
             * @returns {{lastModified: (*|jQuery.lastModified|{}|lastModified), name: *, size: *, type: *}}
             */
            getFileInfo: function(blob){
                return {
                    lastModified: blob.lastModified,
                    name: blob.name,
                    size: blob.size,
                    type: blob.type
                }
            },
            /**
             * 判断当前文件是否为图片
             * @param blob
             */
            isImage: function(blob){
                var type = Fn.getAttr(Fn.Files.getFileInfo(blob), 'type', '');
                return /image\/(?:png|jpg|jpeg|gif|bmp)/.test(type);
            }
        },
        Date: {
            /**
             * 简单的日期格式化处理函数
             * @param d 当前需要处理的日期，可以是时间的格式：如2015-06-07 15:30或者时间戳
             * @param fmt 'yyyy-MM-dd hh:mm:ss'
             * @returns {*} 返回最终的对应的时间格式
             */
            format: function(d, fmt){
                var date = d;
                if(_.isNumber(d)) {
                    date = new Date(d);
                } else if(_.isString(d)) {
                    date = new Date(d);
                } else if(!date){
                    return ;
                }
                var o = {
                    "M+": date.getMonth() + 1, //月份
                    "d+": date.getDate(), //日
                    "h+": date.getHours(), //小时
                    "m+": date.getMinutes(), //分
                    "s+": date.getSeconds(), //秒
                    "q+": Math.floor((date.getMonth() + 3) / 3), //季度
                    "S": date.getMilliseconds() //毫秒
                };
                if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
                for (var k in o)
                    if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
                return fmt;
            }
        }
    };

    return Fn;
});