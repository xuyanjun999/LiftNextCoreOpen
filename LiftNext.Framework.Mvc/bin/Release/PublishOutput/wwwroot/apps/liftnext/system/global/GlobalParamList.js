//UserList
Ext.define('sef.app.liftnext.system.global.GlobalParamList', {
    extend: 'sef.core.components.page.ListPage',
    xtype: 'sef-globalparamlist',
    colConfig: [{
        nam: 'KeyDes',
        flex:1
    }],
    //columns: ['Code'],
    searchConfig: {
        quickSearch: ['KeyName']
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
        url: '/GlobalParam/GetTree'
    },

    onTreeItemClick: function (tree, record) {
        //console.log('user.tree.click', tree, record);
        tree.up('sef-globalparam').down('sef-globalparamlist').getStore().makeQuerys({
            FieldName: 'KeyName', Values: [record.data.Data]
        });
    },


    bars: [sef.runningCfg.BUTTONS.CREATE,
        sef.runningCfg.BUTTONS.EDIT,
        sef.runningCfg.BUTTONS.DELETE,
        sef.runningCfg.BUTTONS.EXPORT
    ]
});