Ext.define('sef.app.liftnext.system.message.MessageModel', {
    extend: 'sef.core.model.BaseModel',
    fields: [  {
        index: 1,
        name: 'Title',
        text: _('标题')
    }, {
        index: 2,
        name: 'Content',
        text: _('内容'),
        }, {
            index: 3,
            name: 'Type',
            text: _('类型'),
            stype: 'enum',
            sassb: 'SEF.Core.Common.MessageTypeEnum,SEF.Core.Common'
        }, {
        index: 4,
        name: 'IsReaded',
        text: _('是否已读'),
        stype: 'enum',
        sassb: 'SEF.Core.Common.YesOrNoEnum,SEF.Core.Common'
        }, {
            index: 5,
            name: 'IsNeedHandle',
            text: _('是否需要处理'),
            stype: 'enum',
            sassb: 'SEF.Core.Common.YesOrNoEnum,SEF.Core.Common'
        }, {
        index: 6,
        name: 'SendDate',
        text: _('发送时间'),
        type : 'date'
        }, {
            index: 7,
            name: 'ExpiryTime',
            text: _('过期时间'),
            type: 'date'
        },]
});