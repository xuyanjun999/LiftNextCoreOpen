Ext.define('sef.app.liftnext.design.DesignParamModel',{
    extend:'sef.core.model.BaseModel',

    fields: [ {
        index: 0,
        name: 'Code',
        text: '梯号'
    },{
        index: 1,
        name: 'ParamForm',
        text: _('类型'),
        stype: 'enum',
        sassb: 'SEF.Core.Common.ParamFormEnum,SEF.Core.Common'
    }, {
        index:2,
        name:'ParamDefine',
        text: _('参数名称'),
        assstype: 'asso'
    }, {
        index: 3,
        name: 'IsLock',
        text: _('锁定')
    }, {
            index:4,
        name:'ParamValue',
        text: _('参数值')
    },{
            index:5,
        name:'OldValue',
        text: _('历史值')
    }, {
        index: 6,
        name: 'ChangeDesc',
        text: _('更改描述')
    }]
});