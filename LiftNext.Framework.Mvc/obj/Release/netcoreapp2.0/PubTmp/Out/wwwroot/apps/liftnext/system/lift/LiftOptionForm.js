//UserForm

Ext.define('sef.app.liftnext.system.lift.LiftOptionForm', {
    extend: 'sef.core.components.page.FormPage',
    xtype: 'sef-liftoptionform',



    bars: [sef.runningCfg.BUTTONS.SAVE
    ],

    onPageReady: function() {
        //console.log('formpage will on ready');
        //此方法用于更新权限信息
        //roles为子表名称，若不加则为主表的行为
        this.updatePermission({

        });
    },

    items: [{
            xtype: 'textarea',
            name: 'DefaultValue',
            fieldLabel: _('可选项(逗号分隔)'),
            columnWidth: 1,
            allowBlank: true,
            height:300
        }
    ]
});