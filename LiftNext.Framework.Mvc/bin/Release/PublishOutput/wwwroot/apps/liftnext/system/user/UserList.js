//UserList
Ext.define('sef.app.liftnext.system.user.UserList', {
    extend: 'sef.core.components.page.ListPage',
    xtype: 'sef-userlist',
    colConfig: [{
        name:'Company',
        renderer: sef.utils.relRenderer('Name'),
        width : 200
    }, {
        name: 'Dept',
        width: 150
    },{
        name: 'Name',
        width: 150
        }, {
            name: 'Code',
            width: 150
    }, {
        name: 'Region',
        width: 150
    }, {
            name: 'Pwd',
            hidden:true
        }],
    //columns:['code'],
    searchConfig: {
        quickSearch: ['Name']
    },
    bars: [sef.runningCfg.BUTTONS.CREATE,
        sef.runningCfg.BUTTONS.EDIT,
        sef.runningCfg.BUTTONS.DELETE,
        sef.runningCfg.BUTTONS.EXPORT
    ]
});