Ext.define('sef.app.liftnext.system.autonumber.AutoNumberModel', {
    extend: 'sef.core.model.BaseModel',
    fields: [{
        index: 1,
        name: 'Key',
        text: _('唯一标识')
    }, {
        index: 2,
        name: 'ResetMode',
        text: _('重置方式'),
        stype: 'enum',
        sassb: 'SEF.Core.Common.AutoNumberResetModeEnum,SEF.Core.Common'
    }, {
        index: 4,
        name: 'Pref',
        text: _('起始字符')
    }, {
        index: 3,
        name: 'DateFormat',
        text: _('日期格式'),
    }, {
        index: 5,
        name: 'Num',
        text: _('当前编号')
    }, {
        index: 6,
        name: 'NumDigit',
        text: _('编号位数')
    },  {
        index: 7,
        name: 'Group',
        text: _('分组编号')
    },{
        index: 8,
        name: 'Remark',
        text: _('备注'),
    }]
});