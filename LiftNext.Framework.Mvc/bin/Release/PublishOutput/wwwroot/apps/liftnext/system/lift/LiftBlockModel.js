Ext.define('sef.app.liftnext.system.lift.LiftBlockModel',{
    extend:'sef.core.model.BaseModel',

    fields: [{
        index: 1,
        name: 'ModelGroup',
        stype: 'asso',
        text:_('分组')
    }, {
        index: 2,
        name: 'BlockCode',
        text: _('块编号')
    }, {
        index: 3,
        name: 'BlockName',
        text:_('块名称')
    }, {
        index: 4,
        name: 'InsertPointX',
        text: _('插入点坐标X')
    }, {
        index: 5,
        name: 'InsertPointY',
        text: _('插入点坐标Y')
    }, {
        index: 6,
        name: 'ExInsertPointX',
        text: _('额外插入点坐标X')
    }, {
        index: 7,
        name: 'ExInsertPointY',
        text: _('额外插入点坐标Y')
    }]
});