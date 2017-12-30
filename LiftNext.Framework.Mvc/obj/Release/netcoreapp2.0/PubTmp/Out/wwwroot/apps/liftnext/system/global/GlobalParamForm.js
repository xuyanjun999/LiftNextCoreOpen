//UserForm

Ext.define('sef.app.liftnext.system.global.GlobalParamForm', {
    extend: 'sef.core.components.page.FormPage',
    xtype: 'sef-globalparamform',



    bars: [sef.runningCfg.BUTTONS.SAVE,
        sef.runningCfg.BUTTONS.EDIT_INFORM,
        sef.runningCfg.BUTTONS.DEL_INFORM
    ],

    activate__execute: function(btn) {
        //console.log('here is activate click#', btn, this);
    },

    onPageReady: function() {

        //console.log('formpage will on ready');
        //此方法用于更新权限信息
        //roles为子表名称，若不加则为主表的行为
        this.updatePermission({
        });
    },

    items: [{
        name: 'KeyName',
        fieldLabel: _('键名'),
        allowBlank: false
    },{
        name: 'KeyValue',
        fieldLabel: _('键值'),
        allowBlank: false
    }, {
            xtype: 'numberfield',
            name: 'KeySeq',
            fieldLabel: _('序号'),
            value: 0
        },{
            xtype:'textarea',
            name: 'KeyDes',
            fieldLabel: _('描述'),
            columnWidth:1
    }, {
            name: 'KeyDef1',
        fieldLabel: _('备注1')
        }, {
            name: 'KeyDef2',
            fieldLabel: _('备注2')
    }, {
        name: 'KeyDef3',
        fieldLabel: _('备注3')
    }]
});