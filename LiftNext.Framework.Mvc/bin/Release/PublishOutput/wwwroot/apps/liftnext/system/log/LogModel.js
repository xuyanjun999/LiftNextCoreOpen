Ext.define('sef.app.liftnext.system.log.LogModel', {
    extend: 'sef.core.model.BaseModel',
    fields: [ {
        index: 2,
        name: 'OperateType',
        text: _('动作类型'),
        stype: 'enum',
        sassb: 'SEF.Core.Common.LogOperateTypeEnum,SEF.Core.Common'
    }, {
        index: 4,
        name: 'ActionDescription',
        text: _('动作描述')
    }, {
        index: 3,
        name: 'UserName',
        text: _('操作人名称'),
    }, {
        index: 5,
        name: 'UserCode',
        text: _('操作人编号')
    }, {
        index: 6,
        name: 'CreateOn',
        text: _('操作时间'),
        type: 'date'
    }, {
        index: 7,
        name: 'Remark',
        text: _('备注'),
    }]
});