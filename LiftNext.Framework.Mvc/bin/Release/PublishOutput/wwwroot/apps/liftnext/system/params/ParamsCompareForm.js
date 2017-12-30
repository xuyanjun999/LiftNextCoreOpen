//UserForm

Ext.define('sef.app.liftnext.system.block.ParamCompareForm', {
    extend: 'sef.core.components.page.FormPage',
    xtype: 'sef-paramcompareform',



    bars: [sef.runningCfg.BUTTONS.SAVE,
        sef.runningCfg.BUTTONS.EDIT_INFORM
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
        name: 'Code',
        fieldLabel: _('编号'),
        allowBlank:false
    },{
            name: 'Name',
            fieldLabel: _('名称')
        }, {
            xtype: 'textarea',
            name: 'Desc',
            fieldLabel: _('描述'),
            columnWidth: 1
        }
    ]
});