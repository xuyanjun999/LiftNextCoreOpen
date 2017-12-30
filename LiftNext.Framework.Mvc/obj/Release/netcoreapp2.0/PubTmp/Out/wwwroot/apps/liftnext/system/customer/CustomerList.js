//UserList
Ext.define('sef.app.liftnext.system.customer.CustomerList', {
    extend: 'sef.core.components.page.ListPage',
    xtype: 'sef-customerlist',
    colConfig: [{
        name: 'Code',
        width: 100
    }, {
        name: 'Name',
        width : 200
    }, {
        name: 'ShortCode',
        width: 90
    }, {
            name: 'Tel',
            width: 150
        }, {
        name: 'Email',
        width: 150
    }, {
        name: 'CompanyType',
        width: 120
    },  {
        name: 'Level',
        width: 120
    }, {
        name: 'Address',
        flex:1
    },{
        name: 'Users',
        hidden: true
    }, {
        name: 'Params',
        hidden:true
    }, {
        name: 'Layouts',
        hidden: true
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