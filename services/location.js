/**
 * Created with PhpStorm.
 * User: Screat
 * Date: 2016/1/12
 * Time: 22:30
 * Description:
 */
define(['underscore', 'Fn'],function(_, Fn){
    //获取window.location实例
    var location = window.location;
    //用来维护及管理URL的常用方法
    function $location(cfg){
        this.__$$config = cfg;
    }

    /**
     * 更新通过backbone配置获取的路由参数，
     * 以方便直接在控制器中获取路由参数
     */
    $location.prototype.upgrade = function(args){
        this.__$$pathRrguments = Array.prototype.slice.apply(args);
    };


    /**
     * get absolute path
     * e.g http://www.lyblog.net/a/bs?sj#aa
     * return http://www.lyblog.net/a/bs?sj#aa
     * @returns {string}
     */
    $location.prototype.absUrl = function(){
        return location.href;
    };


    /**
     * gettter and setter
     * get current path
     * e.g http://www.lyblog.net/a/b?s=a#sj      //$location.url()  /a/b?s=a#sj
     * @returns {string}
     */
    $location.prototype.url = function(url){
        if(url && typeof url === 'string'){
            if(this.__$$config.hash) {
                location.hash = url;
            } else {
                location.assign(url);
            }
        } else {
            if(this.__$$config.hash) {
                return ('/' + location.hash.replace('#','').replace(/^\//,''));
            }
            return (location.pathname + location.search + location.hash);
        }
    };

    /**
     * get current protocol
     * e.g http, file, https, ftp
     * @returns {string}
     */
    $location.prototype.protocol = function(){
        return location.protocol.replace(':', '');
    };


    /**
     * get current host
     * @returns {string}
     */
    $location.prototype.host = function(){
        return location.host;
    };

    /**
     * get current port
     */
    $location.prototype.port = function(){
        return location.port;
    };

    /**
     * get or set current path
     */
    $location.prototype.path = function(newPath){
        var url = this.url();
        if(newPath && typeof newPath === 'string') {
            //TODO 完善路由的设置工作
        }
        return url.replace(/(?:#.*)|(?:\?.*)/,'').replace(/\/*$/,'');
    };

    /**
     * this method is getter/setter
     * @param search
     * @param [paramValue]
     */
    $location.prototype.search = function(search, paramValue){
        //获取参数
        var l = arguments.length,
            searchParam = Fn.getAttr(this.url().match(/\?([^?#]*)/), '1', ''),
            parsedParam = parseUrl(searchParam),
            path = this.path(),
            hash = this.hash();

        if(!l) {
            return parsedParam;
        } else if(l == 1) {
            if(_.isObject(search)) {
                var buildParam = _.extend(parsedParam, search);
                var buildUrl = buildUrl(buildParam);
                var url = path;
                url += buildUrl ? '?' + buildUrl: '';
                url += hash ? '#' + hash : '';
                this.url(url);
            } else {
                return parsedParam[search];
            }
        } else if(l == 2) {
            if(_.isString(search) && _.isString(paramValue)) {
                if(parsedParam[search] && (parsedParam[search] != paramValue)) {

                }
            }
        }

        /**
         * 解析URL参数
         * @param str a=b&c=d
         * @returns {{}}
         */
        function parseUrl(str){
            var ret = {},
                reg = /([^=&]+)(?:=([^&]*))?/g,
                currentVal;
            while (currentVal = reg.exec(str)) {
                ret[currentVal[1] || ''] = currentVal[2];
            }
            return ret;
        }
        //TODO 完善search来设置参数

        /**
         * 传入对象，构建对应的url参数
         * @param obj
         * @returns {string}
         */
        function buildUrl(obj){
            var search = '';
            for(var i in obj) {
                if($.trim(i)) search += (i + '=' + obj[i] + '&');
            }
            return search.slice(0, -1);
        }

    };

    /**
     *
    **/
    $location.prototype.hash = function(newHash){
        var url = this.url();
        if(newHash) {
            //TODO 完善HASH的设置
            return true;
        }
        return Fn.getAttr(url.match(/#.*/), '1', '');
    };

    /**
     *
     */
    $location.prototype.replace = function(){

    };

    /**
     *
     */
    $location.prototype.state = function(){

    };

    /**
     * get and setter
     * 获取通过pathInfo得到的数据参数
     */
    $location.prototype.pathInfo = function(){
        return this.__$$pathRrguments;
    };

    /**
     * getter
     * get all params
     */
    $location.prototype.searchAll = function(){
        var params = this.search();
        params.$path = this.__$$pathRrguments;
        return params;
    };

    $location.prototype.back = function(){
        window.history.back();
    };

    return window.$location = (new $location({
        hash: true
    }));
});