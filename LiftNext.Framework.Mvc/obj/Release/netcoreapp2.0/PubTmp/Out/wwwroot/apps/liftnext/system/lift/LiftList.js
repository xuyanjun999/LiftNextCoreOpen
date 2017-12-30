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
    //���ϴ˽ڵ�������ʾ��׼��
    tree: {
        //���������ڿ����Ƿ���ʾcheckhbox
        //enableCheck:true,
        xtype: 'sef-pagetree',

        title: '���ͷ���',
        //���ڼ�������url
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