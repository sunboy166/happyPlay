/**
 * Created with PhpStorm.
 * User: Screat
 * Date: 2015/12/17
 * Time: 23:22
 * Description: 统一请求维护管理
 * eg.
 *      {
 *          storage: {
 *              keyname: "onedb",
 *              init: {
 *                  "prefix": "", //默认前缀
 *                  "defaultData": null,
 *                  "maxSize": "5M",   //默认最大保存数据空间为5M
 *                  "engine": localStorage,
 *                  "lifeTime": "30D",  //默认保存时间为30天 D表示天，H表示小时，M表示分钟，S表示为秒
 *                  "timeOutClear": 1   //超出保存时间自动清除该localstorage
 *              }
 *          }
 *      }
 */
define(['koala', '$user', 'Fn'],function(koala, $user, Fn){
    var cache = {};
    /**
     * StoreModel代理层
     * @param config
     * @constructor
     */
    function StoreModel(config){
        //保存输入的默认参数
        this.$$UConfig = {};
        config.__poopertys__.call(this.$$UConfig);
        //初始化
        this.init();
    }

    /**
     * 初始化配置项
     */
    StoreModel.prototype.init = function(){
        var config = this.$$UConfig;
        this.$$key = config.key;
        var c = this.$$config = {};
        _.each(config, function(k, v){
            if(['maxSize','engine','lifeTime','defaultData', 'prefix'].indexOf(k) != -1) c[k] = v;
        });
    };

    /**
     * 验证当前Store
     */
    StoreModel.prototype.validateStore = function(){
        if(this.$$instance) {
            var ins = this.$$instance,
                set = ins.set,
                get = ins.get,
                self = this;

            /**
             * 代理参数设置函数
             */
            ins.set = function(){
                if(self.$$UConfig.isUserData) {      //如果是用户数据
                    var data = arguments[0] || {};
                    data['__$$token'] = '';
                    if($user.isLogin()) data['__$$token'] = $user.getUserToken();
                }
                set.apply(ins, arguments);
            };
            /**
             * 代理参数获取函数
             * @returns {null|*}
             */
            ins.get = function(){
                //获取原来的数据
                var data = get.apply(ins, arguments);
                if(self.$$UConfig.isUserData) {       //如果是用户数据
                    var token = Fn.getAttr(data, '__$$token', '');
                    if(token === '' || token === $user.getUserToken()) {
                        delete data['__$$token'];
                        return data;
                    }
                    ins.clear();
                    return (self.$$UConfig.defaultData || null);
                }
                return data;
            };

            ins.getAttr = function(key, def){
                return Fn.getAttr(ins.get(), key,def);
            };

            ins.setAttr = function(key, value, check){
                var data = ins.get();
                if(check) {
                    if(!(Fn.getAttr(data,key,'') === '')) {
                        console.warn('当前数据格式不正确，设置失败');
                        return false;
                    }
                }
                data = data || {};
                Fn.setAttr(data,key, value);
                ins.set(data);
            };
        }
    };


    //获取实例
    StoreModel.prototype.getInstance = function() {
        if(this.$$instance) return this.$$instance;
        this.$$instance = new koala.StorageDB(this.$$key, this.$$config);
        this.validateStore();
        return this.$$instance;
    };

    return StoreModel;
});
