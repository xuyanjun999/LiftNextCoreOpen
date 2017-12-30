//User.js

Ext.define('sef.app.liftnext.dashboard.DefaultDashboard', {
    extend: 'sef.core.view.appcontainer.AppPageContainer',
    xtype: 'sef-dashboard',
    title: 'Dashboard',
    closable: false,
    requires: [
        'sef.app.liftnext.system.block.BlockModel',
        'sef.app.liftnext.dashboard.DashboardView'
        //'sef.app.liftnext.block.BlockView'
        //'sef.app.liftnext.system.customer.UserModel'
    ],
    //用于指定当前页面默认显示的vname，与下面的views中的vname相对应
    defaultView:'view',
   
    //若单独指定model则页面在加载完成时会自动生成一个store
    //model: 'sef.app.liftnext.system.block.BlockModel',

    
    
    //store:
    views: [{
        //用于在列表和表单之间的切换
        vname:'view',
        xtype: 'sef-dashboardview'
    }],

    

    

    initComponent: function() {
        this.callParent(arguments);
        //console.log(this.store);
        
    }
});