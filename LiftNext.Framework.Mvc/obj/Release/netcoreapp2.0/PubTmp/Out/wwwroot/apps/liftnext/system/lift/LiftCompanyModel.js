Ext.define('sef.app.liftnext.system.lift.LiftCompanyModel',{
    extend:'sef.core.model.BaseModel',

    fields: [{
        index:1,
        name:'Company',
        text: _('参数编号'),
        assstype: 'asso',
    }, {
            index:2,
        name:'EffectDate',
        text: '生效日期',
        type:'date'
        }, {
            index: 3,
            name: 'EndDate',
            text: '失效日期',
            type: 'date'
        }]
});