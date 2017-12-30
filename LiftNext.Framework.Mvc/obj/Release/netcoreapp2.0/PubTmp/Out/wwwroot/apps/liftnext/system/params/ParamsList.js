//UserList
Ext.define('sef.app.liftnext.system.params.ParamsList', {
    extend: 'sef.core.components.page.ListPage',
    xtype: 'sef-paramslist',
    colConfig: [{
        name: 'ParamClass',
        width: 120
    },{
        name: 'Name',
        width : 200
    }, {
        name: 'Code',
        width: 120
    },  {
        nam: 'Desc',
        flex:1
    }],
    //columns: ['Code'],
    searchConfig: {
        quickSearch: ['Code', 'Name']
    },


    refresh__execute: function () {
        this.down('sef-pagetree').reload();
    },

    //���ϴ˽ڵ�������ʾ��׼��
    tree: {
        //���������ڿ����Ƿ���ʾcheckhbox
        //enableCheck:true,
        xtype: 'sef-pagetree',

        title: '��������',
        //���ڼ�������url
        url: '/ParamDefine/GetTree'
    },

    onTreeItemClick: function (tree, record) {
        tree.up('sef-params').down('sef-paramslist').getStore().makeQuerys({
            FieldName: 'ParamClass', Values: [record.data.Data]
        });
        //tree.reload();
    },

    bars: [sef.runningCfg.BUTTONS.CREATE,
        sef.runningCfg.BUTTONS.EDIT,
        sef.runningCfg.BUTTONS.DELETE,
        sef.runningCfg.BUTTONS.EXPORT
    ]
});