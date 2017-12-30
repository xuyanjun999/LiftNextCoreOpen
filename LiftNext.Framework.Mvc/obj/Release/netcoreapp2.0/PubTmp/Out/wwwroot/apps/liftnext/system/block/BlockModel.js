Ext.define('sef.app.liftnext.system.block.BlockModel',{
    extend:'sef.core.model.BaseModel',

    fields: [{
        index: 1,
        name: 'BlockStatus',
        text: _('状态'),
        stype: 'enum',
        sassb: 'SEF.Core.Common.BlockStatusEnum,SEF.Core.Common'
    }, {
        index : 2,
        name:'Code',
        text:_('代号')
    }, {
            index: 2,
        name: 'Name',
        text: _('名称')
    },{
            name:'Thumbnail',
            text: _('缩略图')
    }, {
            index: 4,
        name: 'OwnerType',
        text: _('所属类型'),
        stype: 'enum',
        sassb: 'SEF.Core.Common.OwnerTypeEnum,SEF.Core.Common'
    }, {
            index: 5,
        name: 'BlockGroup',
        text: _('所属组')
    }, {
        index: 6,
        name: 'BlockConfig',
        text: _('选取规则')
    }, {
        index: 7,
        name: 'InsertPointX',
        text: _('插入点坐标X')
    }, {
        index: 8,
        name: 'InsertPointY',
        text: _('插入点坐标Y')
    }, {
        index: 9,
        name: 'InsertPosition',
        text: _('插入次序'),
        stype: 'enum',
        sassb: 'SEF.Core.Common.InsertPositionEnum,SEF.Core.Common'
    },{
            index: 10,
            name:'CreateUser',
            text: _('创建用户')
    }, {
            index: 11,
            name: 'CreateDate',
            text: _('创建日期'),
        type:'date'
    }, {
            index: 12,
            name: 'AuditDate',
            text: _('审核日期'),
        type: 'date'
    }, {
        index: 13,
        name: 'ExInsertPointX',
        text: _('额外插入点坐标X')
    }, {
        index: 14,
        name: 'ExInsertPointY',
        text: _('额外插入点坐标Y')
    },  {
            index: 15,
            name:'ErrMsg',
        text: _('日志')
    }, {
        name: 'BlockParams',
        stype: 'asso',
        ref: 'ID'
    }]
});