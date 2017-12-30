//User.js

Ext.define('sef.app.liftnext.projectitem.ProjectItem', {
    extend: 'sef.core.view.appcontainer.AppPageContainer',
    xtype: 'sef-projectitem',
    title: '土建图汇总',
    closable: true,
    requires: [
        'sef.app.liftnext.project.ProjectModel',
        'sef.app.liftnext.projectitem.ProjectItemList',
        'sef.app.liftnext.projectitem.ProjectItemForm',
        'sef.app.liftnext.design.DesignItemModel',
        'sef.app.liftnext.design.ParamModel'
    ],
    //用于指定当前页面默认显示的vname，与下面的views中的vname相对应
    defaultView:'list',
   
    //若单独指定model则页面在加载完成时会自动生成一个store
    model: 'sef.app.liftnext.design.DesignItemModel',

    //用于MODEL在加载数据时对应的url地址
    //正式使用时应该是 /api/user
    api: '/ProjectItem',

    additionFilterFn: function () {
        var filter = [];
        var user = sef.runningCfg.getUser();
        if (!user.IsSuperAdmin) {
            filter.push({ FieldName: 'Project.CompanyID', Values: [user.CompanyID], Operator: 5 });
        }
        return filter;
    },

    include: ['Project','Project.Company'],
    //store:
    views: [{
        //用于在列表和表单之间的切换
        vname:'list',
        xtype: 'sef-projectitemlist'
    }, {
        vname:'form',
        xtype: 'sef-projectitemform'
    }],

    initComponent: function() {
        this.callParent(arguments);
        //console.log(this.store);
        
    }
});