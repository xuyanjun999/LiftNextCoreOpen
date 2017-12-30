Ext.define('sef.app.liftnext.system.layout.LayoutModel',{
    extend:'sef.core.model.BaseModel',

    fields: [{
        name: 'Name',
        text: _('名称')
        }, {
            index: 3,
            name: 'Company',
            text: _('公司'),
            stype: 'asso'
    }, {
        index: 3,
        name: 'User',
        text: _('用户'),
        stype: 'asso'
    },  {
            name: 'Owner',
        text: _('适用'),
        stype: 'enum',
        sassb: 'SEF.Core.Common.LayoutOwnerEnum,SEF.Core.Common'
    },{
            name: 'IsDefault',
        text: _('是否默认'),
        stype: 'enum',
        sassb: 'SEF.Core.Common.YesOrNoEnum,SEF.Core.Common'
    }, {
        name: 'UseType',
        text: _('模块'),
        stype: 'enum',
        sassb: 'SEF.Core.Common.LayoutUseTypeEnum,SEF.Core.Common'
    }, {
        name:'Items',
        stype:'asso',
        ref:'ID'
    }]
});