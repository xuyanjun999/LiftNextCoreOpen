Ext.define('sef.app.liftnext.system.lift.LiftValidModel',{
    extend:'sef.core.model.BaseModel',

    fields: [{
        index:1,
        name:'ParamDefine',
        text: _('参数编号'),
        assstype: 'asso',
    }, {
            index:2,
        name:'ValidValue',
        text:'验证公式'
    }]
});