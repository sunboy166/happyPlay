/**
 * Created with PhpStorm.
 * User: LiuYang
 * Date: 2013/12/21
 * Time: 22:27
 * Description:分页组件
 */
define(['underscore', 'Fn'],function(_, Fn){

    var getAttr = Fn.getAttr,
        setAttr = Fn.setAttr;
    /**
     * 页面分页处理类
     * @param data 请求参数
     * @param config 配置，主要通过
     */
    function pagenation(data, config){
        this.$$data = data;
        this.$$totalCount = undefined;
        this.$$config = config || {
             currentPageKey: 'page',
             pageSizeKey: 'row'
        };
    }

    pagenation.prototype = {
        /**
         * 获取下一页数据
         * @param callback 如果存在下一页，则执行callback
         * @param endCallback 如果分页结束，则执行endCallback
         * @param scope 回调函数的调用函数
         */
        getNextPage: function(callback, endCallback, scope){
            var self = this,
                config = this.$$config,
                data = this.$$data,
                currentPage = this.getCurrentPage(),
                pageSize = getAttr(this.$$data, config.pageSizeKey),
                total = this.$$totalCount,
                scope = scope || null;

            callback = _.isFunction(callback) ? callback : _.noop;
            endCallback = _.isFunction(endCallback) ? endCallback : _.noop;

            var successFn = (function(){
                var ret = null;
                if(ret = callback.call(scope, data)){
                    if(ret.then && _.isFunction(ret.then)) {
                        ret.then(function(totalCount){
                            if(totalCount && !total) self.$$totalCount = totalCount;
                            setAttr(data, config.currentPageKey, ++currentPage);

                            //再次计算当前信息，看是否已经到达最后一页
                            if((currentPage - 1) * pageSize >= (total || totalCount)){
                                endCallback.call(scope);
                            }
                        });
                    }
                } else {
                    throw new Error('the pagenation class must be receive a Promise Object');
                }
            }).bind(this);
            //实例化pagenation后第一次执行
            if(total === undefined){
                successFn();
                return ;
            }
            //实例化pagenation第二次或第三次执行
            if((currentPage - 1) * pageSize >= total) {
                endCallback.call(scope);
            } else {
                successFn();
            }
        },
        /**
         * 更新对象数据
         * @param data 需要更新的数值
         */
        updateData: function(data){
            //重置当前总的页码数
            this.$$totalCount = undefined;
            Fn.setMixin(this.$$data, data);
        },
        //获取当页所在页
        getCurrentPage: function(df){
            return getAttr(this.$$data, this.$$config.currentPageKey,df);
        }
    };

    return pagenation;
});
