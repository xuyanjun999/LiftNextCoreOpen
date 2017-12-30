Ext.define('sef.app.liftnext.system.task.DrawingTaskModel',{
    extend:'sef.core.model.BaseModel',

    fields: [ {
        index: 1,
        name: 'TaskStatus',
        text: _('任务状态'),
        stype: 'enum',
        sassb: 'SEF.Core.Common.TaskStatusEnum,SEF.Core.Common'
    },{
        index: 2,
        name: 'TaskCode',
        text: _('任务代号')
        }, {
            index: 2,
            name: 'TaskDesc',
            text: _('任务描述')
        }, {
            index: 3,
            name: 'CompanyName',
        text: _('所属公司')
    }, {
        index: 4,
        name: 'TaskOwner',
        text: _('所属用户')
    }, {
        index: 5,
        name: 'TaskDate',
        text: _('任务日期'),
        type: 'date'
        }, {
            index: 6,
            name: 'TaskMsg',
        text: _('任务结果')
    }, {
        index: 7,
        name: 'ErrorCount',
        text: _('重试次数')
        }, {
            index: 8,
            name: 'StartTime',
            text: _('开始时间'),
            type : 'date'
    }, {
        index: 9,
        name: 'EndTime',
        text: _('结束时间'),
        type: 'date'
        }, {
            index: 10,
            name: 'Output',
            text: _('输出文件')
        },{
            index: 11,
            name: 'SourceFile',
        text: _('原始文件')
    }]
});