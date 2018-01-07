//包含左边树以及右侧高级查询的List页面
Ext.define('abp.component.page.ListPage', {
    extend: 'Ext.container.Container',
    xtype: 'listpage',
    layout: 'border',
    requires: [
        'abp.component.page.ListPageCtl'
    ],
    controller:'listpagectl',
    config: {
        appPage: null, //父级容器
        pageData:null,
        tree: null, //左边树
        list: null, //表格
        advSearch: null, //高级查询
    },
    initComponent: function () {
        
        var me = this;
        var tree = me.tree;
        var list = me.list;
        var advSearch = me.advSearch;
        me.items = me.items || [];
        if (tree) {
            tree.region = tree.region || "west";
            tree.listPage = me;
            me.items.push(tree);
        }
        if (list) {
            list.region = list.region || "center";
            list.listPage = me;
            me.items.push(list);
        }
        if (advSearch) {
            advSearch.region = advSearch.region || "east";
            advSearch.listPage = me;
            me.items.push(advSearch);
        }

        me.callParent();
    }
});