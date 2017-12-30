//包含左边树以及右侧高级查询的List页面
Ext.define('abp.component.page.FormPage', {
    extend: 'Ext.container.Container',
    xtype: 'formpage',
    layout: 'border',
    requires: [
        'abp.component.page.FormPageCtl'
    ],
    controller:'formpagectl',
    config: {
        appPage: null, //父级容器,
        pageData:null,
        tree: null, //左边树
        form: null, //form
    },
    initComponent: function () {
        var me = this;
        var tree = me.tree;
        var form = me.form;
        me.items = me.items || [];

        if(!tree) me.layout='fit';

        if (tree) {
            tree.region = tree.region || "west";
            tree.formPage = me;
            me.items.push(tree);
        }
        if (form) {
            if(me.layout==='border') form.region = form.region || "center";
            
            form.formPage = me;
            me.items.push(form);
        }

        me.callParent();
    }
});