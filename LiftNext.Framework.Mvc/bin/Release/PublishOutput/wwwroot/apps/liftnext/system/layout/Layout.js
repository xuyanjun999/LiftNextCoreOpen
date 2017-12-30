//User.js

Ext.define('sef.app.liftnext.system.layout.Layout', {
    extend: 'sef.core.view.appcontainer.AppPageContainer',
    xtype: 'sef-layout',
    title: '布局管理',
    closable: true,
    requires: [
        'sef.app.liftnext.system.layout.LayoutModel',
        'sef.app.liftnext.system.layout.LayoutList',
    ],
    //用于指定当前页面默认显示的vname，与下面的views中的vname相对应
    defaultView:'list',
   
    //若单独指定model则页面在加载完成时会自动生成一个store
    model: 'sef.app.liftnext.system.layout.LayoutModel',

    //用于MODEL在加载数据时对应的url地址
    //正式使用时应该是 /api/user
    api: '/MyLayout',

    include : ['User', 'Company'],

    additionFilterFn: function () {
        //return {TEST:2012114};
        //return { FieldName: 'Test', Values: [2012114], Rel: 'Or', Operator: sef.runningCfg.searchOperator.Like };
    },
    
    //store:
    views: [{
        //用于在列表和表单之间的切换
        vname:'list',
        xtype: 'sef-layoutlist'
    }],

    

    initComponent: function() {
        this.callParent(arguments);
        //console.log(this.store);
        
    }
});