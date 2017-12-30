//UserForm

Ext.define('sef.app.liftnext.account.AccountUserForm', {
    extend: 'sef.core.components.page.FormPage',
    xtype: 'sef-accountuserform',
    focusModifingField: 'AutoModifyFiled',
    bars: [sef.runningCfg.BUTTONS.SAVE
    ],
    onPageReady: function() {
        this.updatePermission({

        });
    },
    onRecordChange: function (rec) {
        var func = {};
        var userFunc = rec.get('UserFuncs');
        if (userFunc) {
            rec.get('UserFuncs').forEach(function (f) {
                func[f] = f;
            });
            this.down('#checkboxgroup').setValue(func);
        }
    },
    onBeforeSave: function (data) {
        data.UpdateOn = new Date();
        var vs = this.down('#checkboxgroup').getValue();
        var funcs = [];
        for (var p in vs) {
            funcs.push(p);
        }
        data.UserFuncs = funcs;
        //var fs = this.down('#floor').getValue();
        //console.log('before save', vs);
        //return false;//
    },

    items: [{
            name: 'Code',
            fieldLabel: _('编号'),
            allowBlank: false
    }, {
        name: 'Name',
        fieldLabel: _('名称'),
        allowBlank: false
        }, {
            name: 'Dept',
            fieldLabel: _('部门')
    }, {
        name: 'Region',
        fieldLabel: _('区域')
        }, {
            name: 'Email',
            fieldLabel: _('邮箱')
    }, {
            name: 'Phone',
        fieldLabel: _('电话')
        }, {
            xtype: 'sef-subtitle',
            columnWidth: 1,
            title: _('登录信息')
        }, {
            name: 'Pwd',
            fieldLabel: _('登录密码'),
            inputType: 'password',
            allowBlank: false
        }, {
            name: 'PwdExpiryTime',
            fieldLabel: _('密码过期'),
            xtype: 'datefield'
        }, {
            xtype: 'sef-subtitle',
            columnWidth: 1,
            title: _('权限功能')
        }, {
            xtype: 'checkboxgroup',
            name: 'checkboxgroup',
            id: 'checkboxgroup',
            columnWidth: 1,
            items: [
                { boxLabel: '申请', name: 'Apply', inputValue: 'Apply' },
                { boxLabel: '设计', name: 'Design', inputValue: 'Design' },
                { boxLabel: '技术审核', name: 'Audit', inputValue: 'Audit' },
                { boxLabel: '跨部门审核', name: 'MultiDept', inputValue: 'MultiDept' },
                { boxLabel: '财务审核', name: 'Business', inputValue: 'Business' },
                { boxLabel: '管理员', name: 'Admin', inputValue: 'Admin' }
            ]
        } 
    ]
});