Ext.define('sef.app.liftnext.system.lift.LiftNonstdModel',{
    extend:'sef.core.model.BaseModel',

    fields: [{
        index:1,
        name:'ParamDefine',
        text: _('参数编号'),
        assstype: 'asso',
    }, {
            index:2,
        name:'NonstdValue',
        text:'非标公式'
    }]
});