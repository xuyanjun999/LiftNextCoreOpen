//UserForm

Ext.define('sef.app.liftnext.system.autonumber.AutoNumberForm', {
    extend: 'sef.core.components.page.FormPage',
    xtype: 'sef-autonumberform',
    bars: [sef.runningCfg.BUTTONS.SAVE,
    sef.runningCfg.BUTTONS.EDIT_INFORM,
    sef.runningCfg.BUTTONS.DEL_INFORM
    ],


    onPageReady: function () {
    },


    items: [{
        name: 'Key',
        fieldLabel: _('唯一标识'),
        allowBlank: false
    }, {
        name: 'ResetMode',
        fieldLabel: _('重置方式'),
        xtype: 'sef-enumcombo',
        enumType: 'SEF.Core.Common.AutoNumberResetModeEnum,SEF.Core.Common',
        value: 0,
        allowBlank: false
    }, {
        name: 'Pref',
        fieldLabel: _('起始字符')
    }, {
        name: 'DateFormat',
        fieldLabel: _('日期格式')
    }, {
        name: 'Num',
        fieldLabel: _('当前编号'),
        value: 0,
        readOnly: true,
    }, {
        name: 'NumDigit',
        fieldLabel: _('编号位数'),
        xtype: 'numberfield',
        allowBlank: false,
        minValue: 2,
        value:2
    }, {
        name: 'Group',
        fieldLabel: _('分组编号')
    }, {
        name: 'Remark',
        fieldLabel: _('备注'),
        xtype: 'textarea',
        columnWidth: 1
        //inputType:'password'
    }]
});