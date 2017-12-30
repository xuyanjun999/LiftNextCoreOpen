//UserList
Ext.define('sef.app.liftnext.system.block.BlockParamList', {
    extend: 'sef.core.components.page.ListPage',
    xtype: 'sef-blockparamlist',
    colConfig: [],
    //columns:[],
    searchConfig: {
        quickSearch: ['Name']
    },
    bars: [sef.runningCfg.BUTTONS.CREATE,
        sef.runningCfg.BUTTONS.EDIT,
        sef.runningCfg.BUTTONS.DELETE,
        sef.runningCfg.BUTTONS.EXPORT
    ]
});