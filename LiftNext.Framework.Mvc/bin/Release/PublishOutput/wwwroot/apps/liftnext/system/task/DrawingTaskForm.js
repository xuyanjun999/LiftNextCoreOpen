//UserForm

Ext.define('sef.app.liftnext.system.task.DrawingTaskForm', {
    extend: 'sef.core.components.page.FormPage',
    xtype: 'sef-drawingtaskform',
    bars: [],
    onPageReady: function() {
        //console.log('formpage will on ready');
        //此方法用于更新权限信息
        //roles为子表名称，若不加则为主表的行为
        this.updatePermission({
        });
    },

    //用于子表的按钮事件，若返回了false则系统内置的行为全部被屏蔽
    //标准子页面按钮事件名称为 [子列表名称(name)]_[按钮名称(name)]__execute
    _roles_create__execute: function(btn) {
        //console.log('will process for create', btn, this);
        return false;
    },

    onRecordChange: function(rec) {
        if (rec != null) {
            var form = this;
        }
    },

    onBeforeSave: function(data) {
        //console.log('will cancel saveing...#', data);
    },

    items: [{
            name: 'CompanyName',
            fieldLabel: _('所属公司')
        }, {
            name: 'TaskOwner',
            fieldLabel: _('所属用户')
        }, {
            name: 'TaskCode',
            fieldLabel: _('任务代号')
        },
        {
            name: 'TaskDesc',
            columnWidth: 1,
            fieldLabel: _('任务描述')
        },
        {
            name: 'TaskType',
            fieldLabel: _('任务类型'),
            xtype: 'sef-enumcombo',
            enumType: 'SEF.Core.Common.TaskTypeEnum,SEF.Core.Common',
        }, {
            name: 'TaskStatus',
            fieldLabel: _('任务状态'),
            xtype: 'sef-enumcombo',
            enumType: 'SEF.Core.Common.TaskStatusEnum,SEF.Core.Common',
        }, {
            name: 'TaskDate',
            fieldLabel: _('任务日期'),
            xtype: 'datefield'
        }, {
            name: 'TaskMsg',
            xtype: 'textarea',
            columnWidth: 1,
            fieldLabel: _('任务结果')
        },{
            name: 'StartTime',
            fieldLabel: _('客户名称'),
            xtype: 'datefield'
        }, {
            name: 'EndTime',
            fieldLabel: _('创建用户'),
            xtype: 'datefield'
        }, {
            name: 'ErrorCount',
            fieldLabel: _('重试次数')
        }
    ]
});