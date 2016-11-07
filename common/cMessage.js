/**
 * Created with PhpStorm.
 * User: LiuYang
 * Date: 2016/3/7
 * Time: 0:05
 * Description: 组件中实现一事件订阅及发布的一套代码
 */
define([],function(){
    var defaultMessage;

    var publisher = {
        subscribers: {
            any: []            //事件类型，订阅者
        },
        subscribe: function(fn, type){
            type = type || 'any';
            if(typeof this.subscribers[type] === 'undefined') {
                this.subscribers[type] = [];
            }
            this.subscribers[type].push(fn);
        },
        unsubscribe: function(fn, type){
            this.visitSubscribers('unsubscribe', fn, type);
        },
        publish: function(publication, type){
            this.visitSubscribers('publish', publication, type);
        },
        visitSubscribers: function(action, arg, type){
            var pubtype = type || 'any',
                subscribers = this.subscribers[pubtype],
                i,
                max = subscribers.length;
            for(i = 0; i < max; i++){
                if(action === 'publish'){
                    subscribers[i](arg);
                } else {
                    if(subscribers[i] === arg){
                        subscribers.splice(i ,1);
                    }
                }
            }
        }
    };

    function newMessage(o){
        var i;
        for(i in publisher){
            if(publisher.hasOwnProperty(i) && typeof publisher[i] === 'function'){
                o[i] = publisher[i];
            }
        }
        o.subscribers = {any: []};
        return o;
    }

    defaultMessage = {
        $new: newMessage
    };

    defaultMessage = newMessage(defaultMessage);

    return defaultMessage;
});