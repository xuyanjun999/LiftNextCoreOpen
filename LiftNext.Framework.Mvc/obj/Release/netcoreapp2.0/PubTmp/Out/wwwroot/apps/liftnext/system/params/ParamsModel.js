Ext.define('sef.app.liftnext.system.params.ParamsModel',{
    extend:'sef.core.model.BaseModel',

    fields: [{
        index:2,
        name:'Code',
        text:_('编号')
    }, {
            index: 3,
        name:'Name',
        text: _('名称')
        }, {
            index: 1,
        name:'ParamClass',
        text:_('分类')
        }, {
            index: 4,
        name:'UseType',
        text: _('使用类型'),
        stype: 'enum',
        sassb: 'SEF.Core.Common.UseTypeEnum,SEF.Core.Common'
    }, {
            index: 5,
        name:'DataType',
        text: _('数据类型'),
        stype: 'enum',
        sassb: 'SEF.Core.Common.DataTypeEnum,SEF.Core.Common'
        }, {
            index: 6,
            name: 'DigitNum',
            text:_('小数位数')
    }, {
        index: 7,
        name: 'DefaultValue',
        text: _('可选值')
    }, {
            index: 8,
            name: 'Desc',
            text: _('描述')
    }]
});