Ext.define('sef.app.liftnext.system.log.Log', {
    extend: 'sef.core.view.appcontainer.AppPageContainer',
    xtype: 'sef-log',
    title: '操作日志管理',
    closable: true,
    requires: [
        'sef.app.liftnext.system.log.LogModel',
        'sef.app.liftnext.system.log.LogList',
        //'sef.app.liftnext.system.customer.UserModel'
    ],
    //用于指定当前页面默认显示的vname，与下面的views中的vname相对应
    defaultView:'list',
   
    //若单独指定model则页面在加载完成时会自动生成一个store
    model: 'sef.app.liftnext.system.log.LogModel',

    //用于MODEL在加载数据时对应的url地址
    //正式使用时应该是 /api/user
    api: '/Log',

    additionFilterFn:function(){
    },
    
    //store:
    views: [{
        //用于在列表和表单之间的切换
        vname:'list',
        xtype: 'sef-loglist'
    }],

    

    initComponent: function() {
        this.callParent(arguments);
        //console.log(this.store);
        
    }
});