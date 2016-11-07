/**
 * Created by sqsun on 2015/9/22.
 */

define(['react', 'koala', 'Models', 'jsx!searchViewComponent'],function(React, koala, Models, SearchComp){
    /**
     * @{Name} : search
     * @{Desc} : 搜索页
     */
    koala.pageView.search = koala.pageView.extend({
        tagName: "section"
        ,className: 'happyplay-search'
        ,onCreate: function(options){  //所有执行一次的事件都写在这里

        },
        onShow: function(keyword){
            var searchComp = React.createFactory(SearchComp);
            var searchComp = searchComp({model:Models.searchItems});
            React.render(searchComp, this.el);
        },
        onLoad: function(params){

        },
        onHide: function(params){

        }
    });
    return koala.pageView.search;
})
