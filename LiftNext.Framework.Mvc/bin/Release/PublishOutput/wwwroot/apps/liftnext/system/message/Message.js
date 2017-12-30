﻿Ext.define('sef.app.liftnext.system.message.Message', {
    extend: 'sef.core.view.appcontainer.AppPageContainer',
    xtype: 'sef-message',
    title: '系统日志管理',
    closable: true,
    requires: [
        'sef.app.liftnext.system.message.MessageModel',
        'sef.app.liftnext.system.message.MessageList',
        //'sef.app.liftnext.system.customer.UserModel'
    ],
    //用于指定当前页面默认显示的vname，与下面的views中的vname相对应
    defaultView:'list',
   
    //若单独指定model则页面在加载完成时会自动生成一个store
    model: 'sef.app.liftnext.system.message.MessageModel',

    //用于MODEL在加载数据时对应的url地址
    //正式使用时应该是 /api/user
    api: '/Message',

    additionFilterFn:function(){
    },
    
    //store:
    views: [{
        //用于在列表和表单之间的切换
        vname:'list',
        xtype: 'sef-messagelist'
    }],

    

    initComponent: function() {
        this.callParent(arguments);
        //console.log(this.store);
        
    }
});