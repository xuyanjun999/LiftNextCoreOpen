//User.js

Ext.define('sef.app.liftnext.system.global.GlobalParam', {
    extend: 'sef.core.view.appcontainer.AppPageContainer',
    xtype: 'sef-globalparam',
    title: '全局配置',
    closable: true,
    requires: [
        'sef.app.liftnext.system.global.GlobalParamModel',
        'sef.app.liftnext.system.global.GlobalParamList',
        'sef.app.liftnext.system.global.GlobalParamForm'
    ],
    //用于指定当前页面默认显示的vname，与下面的views中的vname相对应
    defaultView:'list',
   
    //若单独指定model则页面在加载完成时会自动生成一个store
    model: 'sef.app.liftnext.system.global.GlobalParamModel',

    //用于MODEL在加载数据时对应的url地址
    //正式使用时应该是 /api/user
    api: '/GlobalParam',

    additionFilterFn:function(){
    },
    
    //store:
    views: [{
        //用于在列表和表单之间的切换
        vname:'list',
        xtype: 'sef-globalparamlist'
    }, {
        vname:'form',
        xtype: 'sef-globalparamform'
    }],

    initComponent: function() {
        this.callParent(arguments);
        //console.log(this.store);
        
    }
});