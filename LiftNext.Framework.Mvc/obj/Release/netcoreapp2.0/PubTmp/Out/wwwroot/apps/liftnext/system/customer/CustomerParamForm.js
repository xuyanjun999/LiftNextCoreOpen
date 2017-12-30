//UserForm

Ext.define('sef.app.liftnext.system.customer.CustomerParamForm', {
    extend: 'sef.core.components.page.FormPage',
    xtype: 'sef-customerparamform',

    bars: [sef.runningCfg.BUTTONS.SAVE
    ],

    onPageReady: function() {
        this.updatePermission({

        });
    },

    items: [{
        name: 'ParamDefine',
        fieldLabel: _('参数'),
        xtype: 'sef-lookupfield',
        columns: [{
            dataIndex: 'Code',
            width: 200
        }, {
            dataIndex: 'Name',
            width: 200
        }],
        quickSearch: ['Code', 'Name'],
        displayField: 'Code',
        allowBlank: false,
        columnWidth:0.5,
        store: {
            type: 'sef-store',
            url: '/ParamDefine',
            //autoLoad:true,
            model: 'sef.app.liftnext.system.params.ParamsModel',
            additionFilterFn: function () { }
        },
        readOnly:true
    }, {
        name: 'ParamXtype',
        fieldLabel: _('显示类型'),
        xtype: 'sef-enumcombo',
        enumType: 'SEF.Core.Common.LayoutXtypeEnum,SEF.Core.Common',
        value: 'textfield',
        columnWidth: 0.5,
        allowBlank:false
        }, {
            name: 'ParamNameAs',
            fieldLabel: _('客户参数名称'),
            xtype: 'textfield',
            columnWidth: 0.5,
            allowBlank: false
    }, {
            name: 'ParamCodeAs',
            fieldLabel: _('客户参数编号'),
            xtype: 'textfield',
            columnWidth: 0.5
        },  {
            name: 'AllowBlank',
            fieldLabel: _('可为空'),
            xtype: 'sef-enumcombo',
            enumType: 'SEF.Core.Common.YesOrNoEnum,SEF.Core.Common',
            value: true,
            columnWidth: 0.5
        }, {
            name: 'Editable',
            fieldLabel: _('可编辑'),
            xtype: 'sef-enumcombo',
            enumType: 'SEF.Core.Common.YesOrNoEnum,SEF.Core.Common',
            value: true,
            columnWidth: 0.5
        }, {
            name: 'Linkage',
            fieldLabel: _('可联动'),
            xtype: 'sef-enumcombo',
            enumType: 'SEF.Core.Common.YesOrNoEnum,SEF.Core.Common',
            value: true,
            columnWidth: 0.5
        }, {
            name: 'Modify',
            fieldLabel: _('可计算'),
            xtype: 'sef-enumcombo',
            enumType: 'SEF.Core.Common.YesOrNoEnum,SEF.Core.Common',
            value: true,
            columnWidth: 0.5
        }, {
            name: 'Layout',
            fieldLabel: _('可布局'),
            xtype: 'sef-enumcombo',
            enumType: 'SEF.Core.Common.YesOrNoEnum,SEF.Core.Common',
            value: false,
            columnWidth: 0.5
        }, {
            name: 'Display',
            fieldLabel: _('可显示'),
            xtype: 'sef-enumcombo',
            enumType: 'SEF.Core.Common.LayoutDisplayEnum,SEF.Core.Common',
            value: 0,
            columnWidth: 0.5
        }
    ]
});