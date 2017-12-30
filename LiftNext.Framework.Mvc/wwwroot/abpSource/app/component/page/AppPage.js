Ext.define('abp.component.page.AppPage', {
    extend: 'Ext.container.Container',
    xtype: 'apppage',
    layout: 'card',
    requires: [
        'abp.component.page.AppPageCtl',
       
    ],
    controller: 'apppagectl',
    config: {},

    initComponent: function () {
        var me = this;
        me.items.forEach(function(item){
            item.appPage = me;
        });
        me.callParent();
    }
});