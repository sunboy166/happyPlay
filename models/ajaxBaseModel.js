/**
 * Created with PhpStorm.
 * User: LiuYang
 * Date: 2016/04/01
 * Time: 12:30
 * Description: ajax请求数据基类
 */
define(['koala', '$q', 'underscore', 'C', '$user', 'Fn'],function(koala, $q, _, config, $user, Fn){

    /**
     * 扩展默认参数
     * @param destination 目标
     * @param source 当前
     * @param limit []
     */
    function extend(destination, source, limit){
        if(!(source && destination)) return ;
        if(limit && limit.length) _.each(limit, function(i, v){
            if(source[v]) destination[v] = source[v];
        });
        _.extend(destination, source);
    }

    /**
     * 基础model
     */
    function baseModel(config){
        //默认配置项
        this.$$param = {};
        //请求时的数据
        this.$$postParam = {};
        //默认请求数据
        this.$$defaultParam= {};
        //ajax请求标识
        this.$$ajax = null;
        var getConfig = {};

        config.__poopertys__.bind(getConfig)();
        //复制默认配置
        this.$$param['url'] = getConfig['url'];
        this.$$param['type'] = getConfig['method'];
        this.$$param['isUserData'] = getConfig['isUserData'];
        this.$$param['contentType'] = getConfig['contentType'];
        this.$$param['isCommonModel'] = getConfig['isCommonModel'];
        //默认请求参数
        extend(this.$$defaultParam, getConfig['defaultParam']);
    }

    baseModel.prototype = {
        /**
         * 设定ajax请求的参数
         */
        setParam: function(param){
            _.extend(this.$$postParam, this.$$defaultParam,param);
            return this;
        },
        /**
         * 构建URL
         * @returns {*}
         */
        $$buildUrl: function(postParam){
            var $$param = this.$$param,
                url = this.$$param.url;

            if(!/^(https?|\/\/)/.test(url)) { //如果不是绝对地址
                var baseUrl = $$param.isCommonModel  ? config.commonModelPrefix : config.modelPrefix;
                url = baseUrl.replace(/\/+$/,'') + '/' + url.replace(/^\//,'')
            }
            url = url.replace(/:([-\w]+)/gi,function(){
                var key = arguments[1];
                if(key in postParam) {
                    var retValue = postParam[key];
                    delete postParam[key];
                    return retValue;
                }
                throw new Error("cann't not match url param");
            });
            return url;
        },
        /**
         * 构建请求参数
         * @returns {{}|*}
         */
        $$buildParam: function(Param){
            var postParam = _.extend({},this.$$param['defaultParam'], _.isObject(Param) ? Param : this.$$postParam),
                $$param = this.$$param;
            /*if($$param.type === "POST") {
/*            if($$param.type === "POST") {
                if($$param['contentType'] === false) {
                    var fData = new FormData();
                    if($$param.isUserData) {
                        //fData.append('token', token);
                    }
                    _.each(postParam,function(k,v){
                        fData.append(k, v);
                    });
                    postParam = fData;
                    $$param['processData'] = false;
                } else {
                    if($$param.isUserData) postParam.token = token;
                    postParam = window.JSON.stringify(postParam);
                }
            } else {
                //if($$param.isUserData) postParam.token = token;
            }*/
            return postParam;
        },
        /**
         * 发送AJAX请求数据
         * @param data 请求的数据，可以直接替换setParam方法
         * @param config 请求配置
         * @param success 成功时的回调函数
         * @param error 失败时的回调函数
         * @param scope 回调函数的作用域
         * @param process AJAX进度
         * @returns {*|boolean|deferred.promise|{then, catch, finally}}
         */
        execute: function(data,config,success, error, scope, process){
            config = _.extend({},this.$$param, config);
            return this.$$sendData(data, config,success, error, scope, process);
        },
        /**
         * 以POST方式发送AJAX请求
         * @param data 请求的数据，可以直接替换setParam方法
         * @param config 请求配置
         * @param success 成功时的回调函数
         * @param error 失败时的回调函数
         * @param scope 回调函数的作用域
         * @param process AJAX进度
         * @returns {*|boolean|deferred.promise|{then, catch, finally}}
         */
        post: function(data,config,success, error, scope, process){
            config = _.extend({}, this.$$param,config,{
                type: 'POST'
            });
            return this.$$sendData(data,config,success, error, scope, process);
        },
        /**
         * 以GET方式发送AJAX请求
         * @param data 请求的数据，可以直接替换setParam方法
         * @param config 请求配置
         * @param success 成功时的回调函数
         * @param error 失败时的回调函数
         * @param scope 回调函数的作用域
         * @param process AJAX进度
         * @returns {*|boolean|deferred.promise|{then, catch, finally}}
         */
        get: function(data,config,success, error, scope, process){
            config = _.extend({}, this.$$param,config,{
                type: 'GET'
            });
            return this.$$sendData(data,config,success, error, scope, process);
        },
        /**
         * 最原始发送数据的方法
         * @param data 请求的数据，可以直接替换setParam方法
         * @param config 请求配置
         * @param success 成功时的回调函数
         * @param error 失败时的回调函数
         * @param scope 回调函数的作用域
         * @param process AJAX进度
         * @returns {*|boolean|deferred.promise|{then, catch, finally}}
         */
        $$sendData: function(sendData, config, success, error, scope, process){
            var needPromise = false,
                deferred = $q.defer();

            if(_.isFunction(sendData)) {
                process = error;
                scope = success;
                error = config;
                success = sendData;
            } else if(_.isFunction(config)) {
                process =  scope;
                scope = error;
                error =  success;
                success = config;
            }

            //是否需要返回一个promise对象
            if(!(_.isFunction(success) || _.isFunction(error) || _.isFunction(process))) {
                needPromise = true;
            }

            //token = $user.getUserToken(),
            var self = this,
                postParam = this.$$buildParam(sendData),
                url = this.$$buildUrl(postParam),
                $$param = this.$$param;

            config = _.extend({}, $$param, config);

            this.$$ajax = koala.ajax(url, postParam,{
                sucBack: function(data){
                    //if(data.code ===0) {
                    if(needPromise) {
                        deferred.resolve(data);
                    } else {
                        _.isFunction(success) && success.call(scope || null, data);
                    }
                    /*} else {
                     if(needPromise) {
                     deferred.reject(data);
                     } else {
                     _.isFunction(error) && error.call(scope || null, data);
                     }
                     }*/
                },
                errBack: function(d){
                    if(needPromise) {
                        deferred.reject(d);
                    } else {
                        _.isFunction(error) && error.call(scope || null, d);
                    }
                },
                type: config.type,
                contentType: config.contentType,
                beforeSend: function(xhr){
                    self.$$ajax = xhr;
                    if(needPromise) {
                        self.$$ajax.onprogress = function(){
                            deferred.notify(arguments);
                        };
                    } else if(_.isFunction(process)) {
                        self.$$ajax.onProgress = process;
                    }
                },
                processData: config['processData']
            });
            return (needPromise && deferred.promise);
        },
        cancel: function() {
            if(this.$$ajax && this.$$ajax.cancel) {
                this.$$ajax.abort();
                this.$$ajax = null;
            }
        }
    };
    /**
     * 缓存系统基类
     */
    function cCoreModel(df){
        this.$$uniuqeID = 'model' + setTimeout('1');
        this.$$config = df;
    }

    /**
     * 内置缓存系统
     * @param isCache
     */
    var cache = {};
    cCoreModel.prototype = {
        /**
         * 获取实例
         * @param isCache
         * @returns {baseModel}
         */
        getInstance: function(isCache){
            isCache = !isCache;
            if(isCache) {
                return cache[this.$$uniuqeID] ? cache[this.$$uniuqeID] : (cache[this.$$uniuqeID] = new baseModel(this.$$config));
            } else {
                return new baseModel(this.$$config);
            }
        },
        clearInstance: function(instance){
            var instance = instance || this;
            if(cache[instance.$$uniuqeID]) {
                delete cache[instance.$$uniuqeID];
                return true;
            }
            return false;
        }
    };

    return cCoreModel;
});