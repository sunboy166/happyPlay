/**
 * Created by sqsun on 2015/9/22.
 */
require(["router","C", "fastck", '$WX'], function(Router,Config, FastClick, $WX) {
    $WX.getSignatureInfo();
    FastClick.attach(document.body);
    //启动应用
    Router.start();
});
require(['Models','$location','jsx!headerViewComponent','jsx!mainViewComponent'],function(){});