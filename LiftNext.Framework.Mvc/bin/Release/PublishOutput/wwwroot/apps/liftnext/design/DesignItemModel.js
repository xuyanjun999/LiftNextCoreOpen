Ext.define('sef.app.liftnext.design.DesignItemModel',{
    extend:'sef.core.model.BaseModel',

    fields: [{
        index: 0,
        name: 'DrawingNo',
        text: '图纸编号'
    }, {
        index: 1,
        name: 'Code',
        text: '梯号'
    }, {
        index: 2,
        name: 'Model',
        text: '梯型'
    }, {
        index: 3,
        name: 'VerUser',
        text: '创建用户'
    }, {
        index: 4,
        name: 'VerDate',
        text: _('创建日期'),
        type: 'date'
    }, {
        index: 5,
        name: 'VerNo',
        text: _('版本号')
    }, {
            index: 6,
            name: 'Output',
            text:_("图纸")
    }]
});