//User.js

Ext.define('sef.app.liftnext.system.lift.Lift', {
    extend: 'sef.core.view.appcontainer.AppPageContainer',
    xtype: 'sef-lift',
    title: '梯型管理',
    closable: true,
    requires: [
        'sef.app.liftnext.system.lift.LiftModel',
        'sef.app.liftnext.system.lift.LiftList',
        'sef.app.liftnext.system.lift.LiftForm',
        'sef.app.liftnext.system.lift.LiftParamModel',
        'sef.app.liftnext.system.lift.LiftBlockModel',
        'sef.app.liftnext.system.lift.LiftParamForm',
        'sef.app.liftnext.system.lift.LiftBlockForm',
        'sef.app.liftnext.system.params.ParamsModel',
        'sef.app.liftnext.system.lift.LiftOptionModel',
        'sef.app.liftnext.system.lift.LiftOptionForm',
        'sef.app.liftnext.system.lift.LiftNonstdModel',
        'sef.app.liftnext.system.lift.LiftNonstdForm',
        'sef.app.liftnext.system.lift.LiftValidForm',
        'sef.app.liftnext.system.lift.LiftValidModel',
        'sef.app.liftnext.system.lift.LiftCompanyModel',
        'sef.app.liftnext.system.customer.CustomerModel'
    ],
    //用于指定当前页面默认显示的vname，与下面的views中的vname相对应
    defaultView:'list',
   
    //若单独指定model则页面在加载完成时会自动生成一个store
    model: 'sef.app.liftnext.system.lift.LiftModel',

    //用于MODEL在加载数据时对应的url地址
    //正式使用时应该是 /api/user
    api: '/Model',

    additionFilterFn:function(){
    },
    
    //store:
    views: [{
        //用于在列表和表单之间的切换
        vname:'list',
        xtype: 'sef-liftlist'
    }, {
        vname:'form',
        xtype: 'sef-liftform'
    }],
    
    initComponent: function() {
        this.callParent(arguments);
        //console.log(this.store);
        
    }
});