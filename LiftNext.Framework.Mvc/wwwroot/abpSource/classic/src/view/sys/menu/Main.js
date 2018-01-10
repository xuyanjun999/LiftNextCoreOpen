Ext.define('abp.view.sys.menu.Main', {
    extend: 'abp.component.page.AppPage',
    requires: [
        'abp.view.sys.menu.List',
        'abp.view.sys.menu.Form',
    ],
    title:'菜单',
    items:[{
        xtype:'menulist'
    },{
        xtype:'menuform'
    }]
});