//UserList
Ext.define('sef.app.liftnext.system.autonumber.AutoNumberList', {
    extend: 'sef.core.components.page.ListPage',
    xtype: 'sef-autonumberlist',
    //colConfig: [{
    //    name: 'Company',
    //    renderer: sef.utils.relRenderer('Name'),
    //    width: 200
    //}, {
    //    name: 'Dept',
    //    width: 150
    //}, {
    //    name: 'Name',
    //    width: 150
    //}, {
    //    name: 'Code',
    //    width: 150
    //}],
    //columns:['code'],
    searchConfig: {
        quickSearch: ['Key']
    },
    bars: [sef.runningCfg.BUTTONS.CREATE,
    sef.runningCfg.BUTTONS.EDIT,
    sef.runningCfg.BUTTONS.DELETE
    ]
});