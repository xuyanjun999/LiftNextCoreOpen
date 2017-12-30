Ext.define('sef.app.liftnext.system.lift.LiftGroupModel',{
    extend:'sef.core.model.BaseModel',

    fields: [{
        index: 1,
        name: 'Seq',
        text: '序号'
    }, {
        index: 2,
        name: 'BlockGroup',
        text: '所属组'
    }, {
        index:3,
        name:'CheckGroup',
        text:'检测规则'
    }, {
        index: 4,
        name: 'InsertPointX',
        text: '插入点(X)'
    }, {
        index: 5,
        name: 'InsertPointY',
        text: '插入点(Y)'
    }]
});