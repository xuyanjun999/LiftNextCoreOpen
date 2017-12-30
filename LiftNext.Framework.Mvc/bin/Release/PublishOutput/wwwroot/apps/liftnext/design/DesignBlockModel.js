Ext.define('sef.app.liftnext.design.DesignBlockModel',{
    extend:'sef.core.model.BaseModel',

    fields: [{
        index: 0,
        name: 'Code',
        text: '梯号'
    }, {
        index: 1,
        name: 'BlockGroup',
        text: '分组'
    }, {
        index: 2,
        name: 'BlockName',
        text: '块名称'
    }, {
        index:3,
        name:'BlockCode',
        text:'块编号'
    }, {
        index: 4,
        name: 'InsertPointX',
        text: '插入点坐标'
    }, {
        index: 5,
        name: 'ExInsertPointX',
        text: '额外插入点坐标'
    }]
});