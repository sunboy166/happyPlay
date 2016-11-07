/**
 * Created with PhpStorm.
 * User: Screat
 * Date: 2015/12/17
 * Time: 23:04
 * Description: 列表基础view
 */
define(['baseView'],function(baseView){

    function Pull(config){
        this.$$callback = config.callback;
        this.$$scope = config.scope;
        this.$$el = $(window);
        this.$$limitBottom = config.limitBottom || 60;
        this.$$timer = null;
    }


    Pull.prototype = {
        startPull: function(){
            if(!this.$$lastPull) {
                var $el = this.$$el,
                    self = this;
                this.$$scrollFn = this.$$scrollFn || function(e){
                    window.clearTimeout(self.$$timer);
                    self.$$timer = window.setTimeout(function(){
                        var currentScrollTop,
                            height = document.documentElement.clientHeight,
                            totalHeight = document.documentElement.scrollHeight;
                        if((currentScrollTop = $el.scrollTop()) > self.$$lastPull && (totalHeight - (height + currentScrollTop)) < self.$$limitBottom){
                            self.$$callback.apply(self.$$scope, []);
                            self.$$lastPull = currentScrollTop;
                        }
                    }, 200);
                };
                this.$$lastPull = $el.scrollTop();
                $el.scroll(this.$$scrollFn);
            }
            this.$$lastPull = 0;
        },
        endPull: function(){
            this.$$el.off('scroll', this.$$scrollFn);
        },
        destroy: function(){
            this.$$lastPull = null;
            this.$$timer = null;
        }
    };


    var view = baseView.extend({
        onBottomPull: function(){},
        startPull: function(){
            this.__$$Pull = this.__$$Pull || new Pull({
                callback: this.onBottomPull.bind(this),
                scope: this
            });
            this.__$$Pull.startPull();
        },
        endPull: function(){
            if(this.__$$Pull && _.isFunction(this.__$$Pull.endPull)) {
                this.__$$Pull.endPull();
                this.__$$Pull.destroy();
            }
        }
    });
    return view;
});