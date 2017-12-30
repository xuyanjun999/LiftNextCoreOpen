//UserList
Ext.define('sef.app.liftnext.swreview.ReviewList', {
    extend: 'sef.core.components.page.ListPage',
    xtype: 'sef-swreviewlist',
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
        name: 'ProjectParams',
        hidden: true
    }, {
        name: 'AutoModifyFiled',
        hidden:true
    }],
    searchConfig: {
        quickSearch: ['DrawingNo','ProjectName']
    },
    bars: [
        sef.runningCfg.BUTTONS.EDIT,
        sef.runningCfg.BUTTONS.EXPORT
    ]
});