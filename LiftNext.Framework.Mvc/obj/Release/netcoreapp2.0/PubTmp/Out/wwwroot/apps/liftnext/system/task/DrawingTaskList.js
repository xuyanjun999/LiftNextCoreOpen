//UserList
Ext.define('sef.app.liftnext.system.task.DrawingTaskList', {
    extend: 'sef.core.components.page.ListPage',
    xtype: 'sef-drawingtasklist',
    colConfig: [{
            name: 'CompanyName',
            width:150
    }, {
            name: 'TaskDesc',
            width: 150
        }, {
            name: 'Output',
            hidden:true
        }, {
            name: 'SourceFile',
            hidden:true
    }],
    //columns:['code'],
    searchConfig: {
        quickSearch: ['TaskCode','CompanyName']
    },
    bars: [
        sef.runningCfg.BUTTONS.EDIT,
        sef.runningCfg.BUTTONS.DELETE,
        sef.runningCfg.BUTTONS.EXPORT
    ]
});