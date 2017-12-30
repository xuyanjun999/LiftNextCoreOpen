Ext.define('sef.app.liftnext.project.ProjectModel',{
    extend:'sef.core.model.BaseModel',

    fields: [{
        index: 1,
        name: 'DrawingNo',
        text: _('图纸编号')
    }, {
        index: 2,
        name: 'ProjectName',
        text: _('项目名称')
    }, {
        index: 3,
        name: 'CustomerName',
        text: _('客户名称')
    }, {
        index: 4,
        name: 'CreateDate',
        text: _('创建日期'),
        type: 'date'
    }, {
        index: 5,
        name: 'DesignUser',
        text: _('设计人员'),
        stype: 'asso'
    }, {
        index: 6,
        name: 'ProjectStatus',
        text: _('任务状态'),
        stype: 'enum',
        sassb: 'SEF.Core.Common.ProjectStatusEnum,SEF.Core.Common'
    }, {
        index: 7,
        name: 'ReviewStatus',
        text: _('评审状态'),
        stype: 'enum',
        sassb: 'SEF.Core.Common.ReviewStatusEnum,SEF.Core.Common'
    }, {
        index: 9,
        name: 'Company',
        text: _('所属公司'),
        stype: 'asso'
    }, {
        index: 10,
        name: 'CreateUser',
        text: _('创建用户')
    }, {
        name: 'ContractNo',
        text: _('合同号')
    }, {
        name: 'AutoModifyFiled'
    }, {
        name: 'ProjectParams',
        stype: 'asso',
        ref: 'ID'
    }]
});