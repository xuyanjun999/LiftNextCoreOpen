//UserList
Ext.define('sef.app.liftnext.system.layout.LayoutList', {
    extend: 'sef.core.components.page.ListPage',
    xtype: 'sef-layoutlist',
    colConfig: [{
        index: 0,
        text: '模块',
        name: 'UseType',
        width: 100
    },{
        index: 1,
        text: '名称',
        name: 'Name',
        width: 200
    }, {
        index: 2,
        name: 'Code',
        text: '编号',
        width: 150
    }, {
        index: 4,
        text: '适用',
        name: 'Owner',
        width: 100
    }, {
        index: 5,
        name: 'User',
        renderer: sef.utils.relRenderer('Name'),
        text: '用户',
        width: 150
    }, {
        index: 6,
        name: 'Company',
        renderer: sef.utils.relRenderer('Name'),
        text: '公司',
        width: 150
    }, {
        index: 7,
        text: '是否默认',
        name: 'IsDefault',
        width: 80
    }, {
        name: 'Items',
        hidden: true
    }],
    //columns:['code'],
    searchConfig: {
        quickSearch: ['Name']
    },
    bars: [{
        xtype: 'sef-actionbutton',
        actionName: 'newlayout',
        btnType: 'default',
        dataAction: false,
        text: '新增布局'
    },{
        xtype: 'sef-actionbutton',
        actionName: 'changelayout',
        btnType: 'default',
        dataAction: true,
        text: '调整布局'
    },
        sef.runningCfg.BUTTONS.DELETE
    ],

    newlayout__execute: function () {
        var form = this;
        var dialog = Ext.create('sef.core.components.window.CustomFormLayoutDialog', {
            width: '80%',
            height: '80%',
            layoutId: 0
        });
        dialog.show();
    },

    changelayout__execute: function () {
        var grid = this;
        var selId = grid.getSelectionIDs()[0];
        var dialog = Ext.create('sef.core.components.window.CustomFormLayoutDialog', {
            width: '80%',
            height: '80%',
            layoutId: selId
        });
        dialog.show();
    },

    onPageReady: function () {
        this.updatePermission({
            newlayout:true,
            changelayout: true
        });
    },
});