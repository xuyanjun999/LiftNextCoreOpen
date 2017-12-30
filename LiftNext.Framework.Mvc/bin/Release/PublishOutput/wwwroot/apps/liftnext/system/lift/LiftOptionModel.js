Ext.define('sef.app.liftnext.system.lift.LiftOptionModel',{
    extend:'sef.core.model.BaseModel',

    fields: [{
        index:1,
        name:'ParamDefine',
        text: _('参数编号'),
        assstype: 'asso',
    }, {
            index:2,
        name:'DefaultValue',
        text:'可选值'
    }]
});