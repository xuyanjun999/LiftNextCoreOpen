//UserList
Ext.define('sef.app.liftnext.system.lift.LiftList', {
    extend: 'sef.core.components.page.ListPage',
    xtype: 'sef-liftlist',
    colConfig: [{
        name: 'ModelBlocks',
        hidden:true
    }, {
        name: 'ModelParams',
        hidden: true
        }, {
            name: 'ModelCusParams',
            hidden:true
    }, {
            name: 'ModelOptions',
            hidden:true
        }, {
            name: 'ModelValids',
            hidden: true
    }, {
        name: 'ModelNonstds',
        hidden: true
        }, {
            name: 'ModelCompanys',
            hidden: true
        }, {
            name: 'AuditUser',
            hidden:true
    }, {
            name: 'CreateDate',
            renderer: sef.utils.dateRenderer
    }],
    //columns: [],
    searchConfig: {
        quickSearch: ['Code','Name']
    },
    //加上此节点用于显示标准树
    tree: {
        //此属性用于控制是否显示checkhbox
        //enableCheck:true,
        xtype: 'sef-pagetree',

        title: '梯型分类',
        //用于加载树的url
        url: '/Model/GetTree'
    },

    onTreeItemClick: function (tree, record) {
        tree.up('sef-lift').down('sef-liftlist').getStore().makeQuerys({
            FieldName: 'ModelClass', Values: [record.data.Data]
        });
    },

    bars: [sef.runningCfg.BUTTONS.CREATE,
        sef.runningCfg.BUTTONS.EDIT,
        sef.runningCfg.BUTTONS.DELETE,
        sef.runningCfg.BUTTONS.EXPORT
    ]
});