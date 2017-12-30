//UserList
Ext.define('sef.app.liftnext.audit.AuditList', {
    extend: 'sef.core.components.page.ListPage',
    xtype: 'sef-auditlist',
    colConfig: [{
        name: 'DrawingNo',
        width: 140
    }, {
        name: 'ProjectName',
        width: 150
    }, {
        name: 'Company',
        renderer: sef.utils.relRenderer('Name'),
        width: 120
    }, {
        name: 'DesignUser',
        renderer: sef.utils.relRenderer('Name'),
        width: 90
    }, {
        name: 'CustomerName',
        width: 150
    }, {
        name: 'ContractNo',
        hidden: true
    }, {
        name: 'AutoModifyFiled',
        hidden: true
    }, {
        name: 'ProjectParams',
        hidden: true
    }],
    //columns:['code'],
    searchConfig: {
        quickSearch: ['DrawingNo','ProjectName']
    },
    bars: [sef.runningCfg.BUTTONS.EXPORT],

    onPageReady: function () {
        //console.log('formpage will on ready');
        //此方法用于更新权限信息
        //roles为子表名称，若不加则为主表的行为
        this.updatePermission({

        });
    }
});