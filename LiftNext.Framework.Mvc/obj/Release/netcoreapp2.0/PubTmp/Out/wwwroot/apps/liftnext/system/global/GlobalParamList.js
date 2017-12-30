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

    //加上此节点用于显示标准树
    tree: {
        //此属性用于控制是否显示checkhbox
        //enableCheck:true,
        xtype: 'sef-pagetree',

        title: '参数分类',
        //用于加载树的url
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