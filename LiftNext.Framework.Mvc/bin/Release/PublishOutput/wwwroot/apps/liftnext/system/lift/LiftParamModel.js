Ext.define('sef.app.liftnext.system.lift.LiftParamModel',{
    extend:'sef.core.model.BaseModel',

    fields: [{
        index: 1,
        name: 'BlockGroups',
        text: '分组'
    }, {
            index: 2,
            name: 'BlockCodes',
            text: '块编号'
        },{
        index:1,
        name:'ParamDefine',
        text: _('参数编号'),
        assstype: 'asso',
        //sassb: 'SEF.Core.Model.CompanyModel,SEF.Core.Model',
        //assomodel: 'sef.app.liftnext.system.params.ParamsModel'
    }, {
            index:3,
        name:'ParamValue',
        text:'参数值'
    }]
});