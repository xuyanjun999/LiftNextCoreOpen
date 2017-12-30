Ext.define('sef.app.liftnext.system.block.BlockParamModel',{
    extend:'sef.core.model.BaseModel',

    fields: [{
        index: 1,
        name: 'DrawingType',
        text: _('类型'),
        stype: 'enum',
        sassb: 'SEF.Core.Common.OwnerTypeEnum,SEF.Core.Common'
    }, {
        index:2,
        name:'ParamDefine',
        text: _('参数名称'),
        assstype: 'asso'
    }, {
            index:4,
        name:'DefaultValue',
        text:'默认值'
    }]
});