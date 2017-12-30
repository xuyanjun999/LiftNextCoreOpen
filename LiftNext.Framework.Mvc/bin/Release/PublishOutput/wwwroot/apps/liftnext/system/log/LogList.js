//UserList
Ext.define('sef.app.liftnext.system.log.LogList', {
    extend: 'sef.core.components.page.ListPage',
    xtype: 'sef-loglist',
    colConfig: [{
        name: 'CreateOn',
        renderer: sef.utils.dateTimeRenderer,
        width : 150
    }],
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
        quickSearch: ['UserName','UserCode']
    }
});