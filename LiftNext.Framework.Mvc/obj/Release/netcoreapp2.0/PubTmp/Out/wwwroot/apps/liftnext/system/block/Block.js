//User.js

Ext.define('sef.app.liftnext.system.block.Block', {
    extend: 'sef.core.view.appcontainer.AppPageContainer',
    xtype: 'sef-block',
    title: '块管理',
    closable: true,
    requires: [
        'sef.app.liftnext.system.block.BlockModel',
        'sef.app.liftnext.system.block.BlockList',
        'sef.app.liftnext.system.block.BlockForm',
        'sef.app.liftnext.system.block.BlockParamModel',
        'sef.app.liftnext.system.block.BlockParamForm',
        'sef.app.liftnext.system.global.GlobalParamModel'
    ],
    //用于指定当前页面默认显示的vname，与下面的views中的vname相对应
    defaultView:'list',
   
    //若单独指定model则页面在加载完成时会自动生成一个store
    model: 'sef.app.liftnext.system.block.BlockModel',

    //用于MODEL在加载数据时对应的url地址
    //正式使用时应该是 /api/user
    api: '/Block',

    additionFilterFn:function(){
        //return { FieldName: 'Test', Values: [2012114], Rel: 'Or', Operator: sef.runningCfg.searchOperator.Like }
    },
    
    //store:
    views: [{
        //用于在列表和表单之间的切换
        vname:'list',
        xtype: 'sef-blocklist'
    }, {
        vname:'form',
        xtype: 'sef-blockform'
    }],


    

    initComponent: function() {
        this.callParent(arguments);
        //console.log(this.store);
        
    }
});