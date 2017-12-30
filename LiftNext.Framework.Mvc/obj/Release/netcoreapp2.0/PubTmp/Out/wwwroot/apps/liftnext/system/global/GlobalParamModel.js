Ext.define('sef.app.liftnext.system.global.GlobalParamModel',{
    extend:'sef.core.model.BaseModel',

    fields: [{
        index: 0,
        name: 'KeySeq',
        text: _('序号')
    },{
        index:1,
        name:'KeyName',
        text:_('键名')
    }, {
            index: 2,
        name:'KeyValue',
        text: _('键值')
        }, {
            index: 3,
            name:'KeyDes',
        text:_('描述')
    }, {
        index: 4,
        name: 'KeyDef1',
        text: _('备注1')
        }, {
            index: 5,
            name: 'KeyDef2',
            text: _('备注2')
    }, {
        index: 6,
        name: 'KeyDef3',
        text: _('备注3')
    }]
});