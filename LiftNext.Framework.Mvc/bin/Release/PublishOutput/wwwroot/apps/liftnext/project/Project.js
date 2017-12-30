//User.js

Ext.define('sef.app.liftnext.project.Project', {
    extend: 'sef.core.view.appcontainer.AppPageContainer',
    xtype: 'sef-project',
    title: '土建图申请',
    closable: true,
    requires: [
        'sef.app.liftnext.project.ProjectModel',
        'sef.app.liftnext.project.ProjectList',
        'sef.app.liftnext.project.ProjectForm',
        'sef.app.liftnext.system.customer.CustomerModel',
        'sef.app.liftnext.system.lift.LiftModel',
        'sef.app.liftnext.design.ParamModel',
        'sef.app.liftnext.design.DesignItemModel'
        //'sef.app.liftnext.system.customer.UserModel'
    ],
    //用于指定当前页面默认显示的vname，与下面的views中的vname相对应
    defaultView:'list',
   
    //若单独指定model则页面在加载完成时会自动生成一个store
    model: 'sef.app.liftnext.project.ProjectModel',

    //用于MODEL在加载数据时对应的url地址
    //正式使用时应该是 /api/user
    api: '/Project',

    additionFilterFn: function () {
        var filter = [];
        var user = sef.runningCfg.getUser();
        if (!user.IsSuperAdmin) {
            filter.push({ FieldName: 'CompanyID', Values: [user.CompanyID], Operator: 5 });
        }
        return filter;
    },

    include:['Company'],
    //store:
    views: [{
        //用于在列表和表单之间的切换
        vname:'list',
        xtype: 'sef-projectlist'
    }, {
        vname:'form',
        xtype: 'sef-projectform'
    }],

    initComponent: function () {
        this.callParent(arguments);
        //console.log(this.store);
        
    }
});