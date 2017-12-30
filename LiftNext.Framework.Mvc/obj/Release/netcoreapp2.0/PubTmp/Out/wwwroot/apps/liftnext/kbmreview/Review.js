//User.js

Ext.define('sef.app.liftnext.kbmreview.Review', {
    extend: 'sef.core.view.appcontainer.AppPageContainer',
    xtype: 'sef-nonstd',
    title: '跨部门评审',
    closable: true,
    requires: [
        'sef.app.liftnext.project.ProjectModel',
        'sef.app.liftnext.kbmreview.ReviewList',
        'sef.app.liftnext.kbmreview.ReviewForm',
        'sef.app.liftnext.design.ParamModel',
        'sef.app.liftnext.design.DesignItemModel'
    ],
    //用于指定当前页面默认显示的vname，与下面的views中的vname相对应
    defaultView:'list',
   
    //若单独指定model则页面在加载完成时会自动生成一个store
    model: 'sef.app.liftnext.project.ProjectModel',

    //用于MODEL在加载数据时对应的url地址
    //正式使用时应该是 /api/user
    api: '/KbmReview',

    additionFilterFn: function () {
        var filter = [{ FieldName: 'ReviewStatus', Values: [85], Operator: 4 }];//, { FieldName: 'ChangeStatus', Values: [90], Operator: 4 , Rel : 'Or'}
        var user = sef.runningCfg.getUser();
        if (!user.IsSuperAdmin) {
            filter.push({ FieldName: 'CompanyID', Values: [user.CompanyID], Operator: 5, Rel: 'And' });
        }
        return filter;
    },

    include:['Company'],
    //store:
    views: [{
        //用于在列表和表单之间的切换
        vname:'list',
        xtype: 'sef-kbmreviewlist'
    }, {
        vname:'form',
        xtype: 'sef-kbmreviewform'
    }],

    initComponent: function() {
        this.callParent(arguments);
        //console.log(this.store);
        
    }
});