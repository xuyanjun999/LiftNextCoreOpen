//UserForm

Ext.define('sef.app.liftnext.system.user.UserForm', {
    extend: 'sef.core.components.page.FormPage',
    xtype: 'sef-userform',
    bars: [sef.runningCfg.BUTTONS.SAVE,
        sef.runningCfg.BUTTONS.EDIT_INFORM,
        sef.runningCfg.BUTTONS.DEL_INFORM,
        {
            text:'激活',
            xtype: 'sef-actionbutton',
            btnType: 'default',
            actionName:'activate'
        }
    ],

    activate__execute:function(btn){
        //console.log('here is activate click#',btn,this);
    },

    onPageReady: function() {

        //console.log('formpage will on ready');
        //此方法用于更新权限信息
        //roles为子表名称，若不加则为主表的行为
        this.updatePermission({
            activate:false,
            roles_create: true,
            roles_delete: true,
            roles_test: true,
            roles_edit: true
        });
    },

    onBeforeSave:function(data){
        //console.log('will cancel saveing...#', arguments);
        //return false;//
    },
    onRecordChange: function (rec) {
        if (rec != null) {
            //console.log('onRecordChange', rec);
        }
    },

    //用于子表的按钮事件，若返回了false则系统内置的行为全部被屏蔽
    //标准子页面按钮事件名称为 [子列表名称(name)]_[按钮名称(name)]__execute
    _roles_create__execute: function(btn) {
        //console.log('will process for create', btn, this);
        return false;
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
            name: 'Company',
            fieldLabel: _('所属公司'),
            xtype: 'sef-lookupfield',
            columns: ['Code', 'Name'],
            quickSearch: ['Code', 'Name'],
            displayField: 'Name',
            allowBlank: false,
            store: {
                type: 'sef-store',
                url: '/Company',
                //autoLoad:true,
                model: 'sef.app.liftnext.system.customer.CustomerModel',
                additionFilterFn: function () { }
            }
        },{
            name: 'Dept',
        fieldLabel: _('部门')
        }, {
            name: 'Region',
            fieldLabel: _('区域')
        },{
            name: 'Email',
        fieldLabel: _('邮箱')
    }, {
            name: 'Phone',
        fieldLabel: _('电话')
    }, {
        xtype:'sef-subtitle',
        columnWidth:1,
        title:_('登录信息')
    },{
            name:'Pwd',
        fieldLabel:_('登录密码'),
        inputType:'password'
    }, {
        name: 'PwdExpiryTime',
        fieldLabel: _('密码过期'),
        xtype: 'datefield'
    }]
});