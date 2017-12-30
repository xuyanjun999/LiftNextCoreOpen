Ext.define('sef.app.liftnext.system.customer.CustomerParamModel',{
    extend:'sef.core.model.BaseModel',

    fields: [ {
            index: 0,
            name: 'ParamNameAs',
            text: _('参数名称')
    }, {
        index: 1,
        name: 'ParamCode',
        text: _('参数编号')
    }, {
        index:1,
        name: 'ParamDefine',
        stype:'asso',
        text:_('参数')
    },{
            index: 2,
            name: 'ParamCodeAs',
            text: _('客户参数编号')
        },{
            index: 3,
            name: 'ParamXtype',
        text: _('类型'),
        stype: 'enum',
        sassb: 'SEF.Core.Common.LayoutXtypeEnum,SEF.Core.Common'
        },  {
            index: 4,
            name: 'AllowBlank',
            text: _('可为空'),
            stype: 'enum',
            sassb: 'SEF.Core.Common.YesOrNoEnum,SEF.Core.Common'
    }, {
            index: 5,
            name: 'Editable',
            text: _('可编辑'),
            stype: 'enum',
            sassb: 'SEF.Core.Common.YesOrNoEnum,SEF.Core.Common'
        }, {
            index: 6,
            name: 'Linkage',
            text: _('可联动'),
            stype: 'enum',
            sassb: 'SEF.Core.Common.YesOrNoEnum,SEF.Core.Common'
    }, {
            index: 7,
            name: 'Modify',
        text: _('可修改'),
        stype: 'enum',
        sassb: 'SEF.Core.Common.YesOrNoEnum,SEF.Core.Common'
        }, {
            index: 8,
            name: 'Layout',
            text: _('可布局'),
            stype: 'enum',
            sassb: 'SEF.Core.Common.YesOrNoEnum,SEF.Core.Common'
    }, {
            index: 9,
            name: 'Display',
            text: _('可显示'),
            stype: 'enum',
            sassb: 'SEF.Core.Common.LayoutDisplayEnum,SEF.Core.Common'
        }]
});