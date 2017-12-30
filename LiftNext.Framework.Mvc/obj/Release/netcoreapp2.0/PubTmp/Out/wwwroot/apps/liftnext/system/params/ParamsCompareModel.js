Ext.define('sef.app.liftnext.system.params.ParamsCompareModel',{
    extend:'sef.core.model.BaseModel',

    fields: [{
        index:1,
        name:'Code',
        text: _('编号')
    }, {
            index: 2,
        name:'Name',
        text: _('名称')
        }, {
            index: 3,
            name: 'Desc',
            text: _('描述')
        }]
});