//UserForm

Ext.define('sef.app.liftnext.system.lift.LiftBlockForm', {
    extend: 'sef.core.components.page.FormPage',
    xtype: 'sef-liftblockform',


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
            name: 'InsertPointX',
            fieldLabel: _('插入点坐标X'),
            columnWidth: 0.5,
            height:200
    }, {
        xtype: 'textarea',
        name: 'InsertPointY',
        fieldLabel: _('插入点坐标Y'),
        columnWidth: 0.5,
        height: 200
        }, {
            xtype: 'textarea',
            name: 'ExInsertPointX',
            fieldLabel: _('额外插入点坐标X'),
            columnWidth: 0.5,
            height: 200
        }, {
            xtype: 'textarea',
            name: 'ExInsertPointY',
            fieldLabel: _('额外插入点坐标Y'),
            columnWidth: 0.5,
            height: 200
        }
    ]
});