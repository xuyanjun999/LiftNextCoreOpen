//User.jssef.app.liftnext.design.DesignBlockM

Ext.define('sef.app.liftnext.design.Design', {
    extend: 'sef.core.view.appcontainer.AppPageContainer',
    xtype: 'sef-design',
    title: '土建图设计',
    closable: true,
  
    requires: [
        'sef.app.liftnext.project.ProjectModel',
        'sef.app.liftnext.design.DesignList',
        'sef.app.liftnext.design.DesignForm',
        'sef.app.liftnext.system.customer.CustomerModel',
        'sef.app.liftnext.system.lift.LiftModel',
        'sef.app.liftnext.design.DesignParamModel',
        'sef.app.liftnext.design.DesignBlockModel',
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
    api: '/Design',

    additionFilterFn: function () {
        var filter = [{ FieldName: 'ProjectStatus', Values: [0], Operator: 3 }];
        var user = sef.runningCfg.getUser();
        if (!user.IsSuperAdmin) {
            filter.push({ FieldName: 'CompanyID', Values: [user.CompanyID], Operator: 5, Rel: "And", SearchGroupID: 10 });
            filter.push({ FieldName: 'DesignUserID', Values: [null], Operator: 5, Rel: "And", SearchGroupID: 11 });
            filter.push({ FieldName: 'DesignUserID', Values: [user.ID], Operator: 5, Rel: "Or", SearchGroupID: 11 });
        }
        return filter;
    },

    include:['Company', 'DesignUser'],
    //store:
    views: [{
        //用于在列表和表单之间的切换
        vname:'list',
        xtype: 'sef-designlist'
    }, {
        vname:'form',
        xtype: 'sef-designform'
    }],

    initComponent: function() {
        this.callParent(arguments);
        //console.log(this.store);
        
    }
});