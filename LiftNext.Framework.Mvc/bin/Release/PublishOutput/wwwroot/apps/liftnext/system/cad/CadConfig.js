//User.js

Ext.define('sef.app.liftnext.system.cad.CadConfig', {
    extend: 'sef.core.view.appcontainer.AppPageContainer',
    xtype: 'sef-cadconfig',
    title: '服务配置',
    closable: true,
    requires: [
        'sef.app.liftnext.system.cad.CadConfigForm'
    ],
    //用于指定当前页面默认显示的vname，与下面的views中的vname相对应
    defaultView:'list',
   
    //若单独指定model则页面在加载完成时会自动生成一个store
    model: '',

    //用于MODEL在加载数据时对应的url地址
    //正式使用时应该是 /api/user
    api: '/CadConfig',

    additionFilterFn:function(){
    },
    
    //store:
    views: [{
        vname:'form',
        xtype: 'sef-cadconfigform'
    }],

    initComponent: function() {
        this.callParent(arguments);
        //console.log(this.store);
        
    }
});