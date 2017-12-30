Ext.define('sef.app.liftnext.system.customer.CustomerModel',{
    extend:'sef.core.model.BaseModel',

    fields: [{
        index:0,
        name:'Code',
        text:_('编号')
    }, {
            index: 1,
        name: 'Name',
        text: _('名称')
        }, {
            index: 2,
            name: 'ShortCode',
            text: _('缩写编号')
    }, {
        index: 3,
        name: 'CompanyType',
        text: _('类型'),
        stype: 'enum',
        sassb: 'SEF.Core.Common.CompanyTypeEnum,SEF.Core.Common'
    }, {
        index: 4,
        name: 'Level',
        text: _('级别'),
        stype: 'enum',
        sassb: 'SEF.Core.Common.CompanyLevelEnum,SEF.Core.Common'
    }, {
            index: 5,
        name: 'Tel',
        text: _('电话')
    }, {
            index: 6,
        name: 'Email',
        text: _('邮箱')
    }, {
        index: 7,
        name: 'Address',
        text: _('地址')
    }, {
            index: 8,
            name: 'Desc',
            text: _('备注')
    }, {
            index: 9,
            name: 'ModelOption',
            text:_('梯型配置')
}, {
        name:'Users',
        stype:'asso',
        ref:'ID'
    },{
        name:'Params',
        stype:'asso',
        ref:'ID'
    }, {
        name: 'Layouts',
        stype: 'asso',
        ref: 'ID'
    }]
});