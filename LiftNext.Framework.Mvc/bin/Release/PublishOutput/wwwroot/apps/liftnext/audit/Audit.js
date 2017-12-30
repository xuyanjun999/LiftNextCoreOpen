//User.js

Ext.define('sef.app.liftnext.audit.Audit', {
    extend: 'sef.core.view.appcontainer.AppPageContainer',
    xtype: 'sef-audit',
    title: '土建图审核',
    closable: true,
  
    requires: [
        'sef.app.liftnext.project.ProjectModel',
        'sef.app.liftnext.audit.AuditList',
        'sef.app.liftnext.audit.AuditForm',
        'sef.app.liftnext.system.customer.CustomerModel',
        'sef.app.liftnext.design.DesignParamModel',
        'sef.app.liftnext.design.ParamModel',
        'sef.app.liftnext.system.user.UserModel',
        'sef.app.liftnext.design.DesignItemModel'
    ], 
    //用于指定当前页面默认显示的vname，与下面的views中的vname相对应
    defaultView:'list',
   
    //若单独指定model则页面在加载完成时会自动生成一个store
    model: 'sef.app.liftnext.project.ProjectModel',

    //用于MODEL在加载数据时对应的url地址
    //正式使用时应该是 /api/user
    api: '/Audit',

    additionFilterFn: function () {
        var filter = [{ FieldName: 'ProjectStatus', Values: [10], Operator: 3 }];
        var user = sef.runningCfg.getUser();
        if (!user.IsSuperAdmin) {
            filter.push({ FieldName: 'CompanyID', Values: [user.CompanyID], Operator: 5 });
        }
        return filter;
    },

    include:['Company', 'DesignUser'],
    //store:
    views: [{
            vname: 'list',
            xtype: 'sef-auditlist'
        }, {
            vname: 'form',
            xtype: 'sef-auditform'
        }],

    initComponent: function() {
        this.callParent(arguments);
        //console.log(this.store);
        
    }
});