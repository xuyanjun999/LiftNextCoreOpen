//UserForm

Ext.define('sef.app.liftnext.system.customer.CustomerForm', {
    extend: 'sef.core.components.page.FormPage',
    xtype: 'sef-customerform',

    bars: [sef.runningCfg.BUTTONS.SAVE,
        sef.runningCfg.BUTTONS.EDIT_INFORM,
        sef.runningCfg.BUTTONS.DEL_INFORM,
        {
            text: '初始化参数',
            xtype: 'sef-actionbutton',
            btnType: 'default',
            actionName: 'initparam'
        }
    ],

    initparam__execute: function () {
        var form = this;
        var grid = form.down('#Params');
        sef.dialog.confirm(_('确认要初始化客户参数?'), '', function () {
            form.mask();
            sef.utils.ajax({
                url: 'CompanyParam/InitCompanyParams',
                method: 'POST',
                paramAsJson: true,
                jsonData: {
                    companyId: form.recID
                },
                scope: form,
                success: function (result) {
                    sef.message.success("初始化成功", 3000);
                    grid.reload();
                    form.unmask();
                },
                failure: function (err, resp) {
                    sef.dialog.error(err.message);
                    form.unmask();
                    console.log('error', err);
                }
            });
        });
    },

    params_addparam__execute: function () {
        var form = this;
        var grid= form.down('#Params');
        //return;
        var dialog = Ext.create('sef.core.components.window.LookupDialog', { 
            //url: url
            width: '60%',
            height: '60%',
            closeAction: 'hide',
            singleSelection: false,
            quickSearch: ['ParamClass','Name', 'Code'],
            store: {
                type: 'sef-store',
                url: '/ParamDefine',
                autoLoad: true,
                model: 'sef.app.liftnext.system.params.ParamsModel',
                additionFilterFn: function () {
                    return [];
                }
            },
            columns: [{
                text: '分类',
                dataIndex: 'ParamClass',
                width: 150
            }, {
                text:'编号',
                dataIndex: 'Code',
                width : 150
            }, {
                text:'名称',
                dataIndex: 'Name',
                width: 150
            }, {
                text: '使用类型',
                dataIndex: 'UseType',
                width: 150,
                renderer: sef.utils.enumRenderer('SEF.Core.Common.UseTypeEnum,SEF.Core.Common')
            }]
        });
        dialog.on('dialogclose', function (state, result) {
            //console.log('export dialog will close#', state, result);
            if (result.Result && result.Result.length > 0) {
                var ids = [];
                Ext.Array.each(result.Result, function (item) {
                    ids.push(item.data.ID);
                });
                sef.utils.ajax({
                    url: 'CompanyParam/AddCompanyParams',
                    method: 'POST',
                    paramAsJson: true,
                    jsonData: {
                        companyId: form.recID,
                        paramIds: ids
                    },
                    scope: form,
                    success: function (result) {
                        dialog.close();
                        grid.reload();
                        sef.message.success("添加参数成功.", 3000);
                    },
                    failure: function (err, resp) {
                        sef.dialog.error(err.message);
                        form.setLoading(false);
                        console.log('error', err);
                    }
                });
            }
            this.updateLayout();
        }, this);
        dialog.show();
    },


    params_editparam__execute: function () {
        var form = this;
        var grid = form.down('#Params');
        var ids = grid.getSelectionIDs();
        //return;
        var dialog = Ext.create('sef.core.components.window.BaseDialog', {
            //url: url
            width: '40%',
            height: '40%',
            title: '批量编辑参数',
            layout:'column',
            defaults: {
                columnWidth: .5,
                margin: '5px 5px 5px 5px',
                xtype: 'textfield',
                labelAlign: 'left',
                labelWidth: 80,
                labelSeparator: ''
            },
            items: [{
                name: 'AllowBlank',
                itemId: 'AllowBlank',
                fieldLabel: _('可为空'),
                xtype: 'sef-enumcombo',
                enumType: 'SEF.Core.Common.YesOrNoEnum,SEF.Core.Common',
                value: null
            }, {
                name: 'Editable',
                itemId: 'Editable',
                fieldLabel: _('可编辑'),
                xtype: 'sef-enumcombo',
                enumType: 'SEF.Core.Common.YesOrNoEnum,SEF.Core.Common',
                value: null
            }, {
                name: 'Linkage',
                itemId: 'Linkage',
                fieldLabel: _('可联动'),
                xtype: 'sef-enumcombo',
                enumType: 'SEF.Core.Common.YesOrNoEnum,SEF.Core.Common',
                value: null
            }, {
                name: 'Modify',
                itemId: 'Modify',
                fieldLabel: _('可计算'),
                xtype: 'sef-enumcombo',
                enumType: 'SEF.Core.Common.YesOrNoEnum,SEF.Core.Common',
                value: null
            }, {
                name: 'Layout',
                itemId: 'Layout',
                fieldLabel: _('可布局'),
                xtype: 'sef-enumcombo',
                enumType: 'SEF.Core.Common.YesOrNoEnum,SEF.Core.Common',
                value: null
            }, {
                name: 'Display',
                itemId: 'Display',
                fieldLabel: _('可显示'),
                xtype: 'sef-enumcombo',
                enumType: 'SEF.Core.Common.LayoutDisplayEnum,SEF.Core.Common',
                value: null
            }]
        });
        dialog.on('dialogclose', function (state, result) {
            var AllowBlank = dialog.down("#AllowBlank").getValue();
            var Editable = dialog.down("#Editable").getValue();
            var Linkage = dialog.down("#Linkage").getValue();
            var Modify = dialog.down("#Modify").getValue();
            var Layout = dialog.down("#Layout").getValue();
            var Display = dialog.down("#Display").getValue();

            sef.utils.ajax({
                url: 'CompanyParam/UpdateCompanyParams',
                method: 'POST',
                paramAsJson: true,
                jsonData: {
                    paramIds: ids,
                    companyId: form.recID,
                    allowBlank: AllowBlank,
                    editable: Editable,
                    linkage: Linkage,
                    modify: Modify,
                    layout: Layout,
                    display: Display
                },
                scope: form,
                success: function (result) {
                    dialog.close();
                    grid.reload();
                    sef.message.success("批量修改成功.", 3000);
                },
                failure: function (err, resp) {
                    sef.dialog.error(err.message);
                    form.setLoading(false);
                    console.log('error', err);
                }
            });
            this.updateLayout();
        }, this);
        dialog.show();
    },

    layouts_changelayout__execute: function () {
        var form = this;
        var grid = this.down('#Layouts');
        var selId = grid.getSelectionIDs()[0];
        var dialog = Ext.create('sef.core.components.window.CustomFormLayoutDialog', {
            width: '80%',
            height: '80%',
            layoutId: selId,
            companyId: form.recID,
        });
        dialog.show();
    },

    layouts_newlayout__execute: function () {
        var form = this;
        var dialog = Ext.create('sef.core.components.window.CustomFormLayoutDialog', {
            width: '80%',
            height: '80%',
            companyId: form.recID,
            newLayout: true
        });
        dialog.show();
    },

    layouts_publishlayout__execute: function () {
        var form = this;
        var grid = form.down('#Layouts');
        var layoutIds = grid.getSelectionIDs();
        
        var dialog = Ext.create('sef.core.components.window.LookupDialog', {
            //url: url
            width: '60%',
            height: '60%',
            closeAction: 'hide',
            singleSelection: false,
            quickSearch: [ 'Name', 'Code'],
            store: {
                type: 'sef-store',
                url: '/Company',
                autoLoad: true,
                model: 'sef.app.liftnext.system.customer.CustomerModel',
                additionFilterFn: function () {
                    return [];
                }
            },
            columns: [ {
                text: '编号',
                dataIndex: 'Code',
                width: 150
            }, {
                text: '名称',
                dataIndex: 'Name',
                width: 250
            }]
        });
        dialog.on('dialogclose', function (state, result) {
            //console.log('export dialog will close#', state, result);
            if (result.Result && result.Result.length > 0) {
                var ids = [];
                Ext.Array.each(result.Result, function (item) {
                    ids.push(item.data.ID);
                });
                sef.utils.ajax({
                    url: 'MyLayout/PublishLayout',
                    method: 'POST',
                    paramAsJson: true,
                    jsonData: {
                        companyId: form.recID,
                        layoutIds: layoutIds,
                        companyIds: ids
                    },
                    scope: form,
                    success: function (result) {
                        dialog.close();
                        grid.reload();
                        sef.message.success("发布布局成功.", 3000);
                    },
                    failure: function (err, resp) {
                        sef.dialog.error(err.message);
                        form.setLoading(false);
                        console.log('error', err);
                    }
                });
            }
            this.updateLayout();
        }, this);
        dialog.show();
    },

    layouts_layoutitem__execute: function () {
        var form = this;
        var grid = form.down('#Params');
        //return;
        var dialog = Ext.create('sef.core.components.window.LookupDialog', {
            //url: url
            width: '60%',
            height: '60%',
            closeAction: 'hide',
            singleSelection: false,
            quickSearch: ['ParamClass', 'Name', 'Code'],
            store: {
                type: 'sef-store',
                url: '/ParamDefine',
                autoLoad: true,
                model: 'sef.app.liftnext.system.params.ParamsModel',
                additionFilterFn: function () {
                    return [];
                }
            },
            columns: [{
                text: '分类',
                dataIndex: 'ParamClass',
                width: 150
            }, {
                text: '编号',
                dataIndex: 'Code',
                width: 150
            }, {
                text: '名称',
                dataIndex: 'Name',
                width: 150
            }, {
                text: '使用类型',
                dataIndex: 'UseType',
                width: 150,
                renderer: sef.utils.enumRenderer('SEF.Core.Common.UseTypeEnum,SEF.Core.Common')
            }]
        });
        dialog.on('dialogclose', function (state, result) {
            //console.log('export dialog will close#', state, result);
            if (result.Result && result.Result.length > 0) {
                var ids = [];
                Ext.Array.each(result.Result, function (item) {
                    ids.push(item.data.ID);
                });
                sef.utils.ajax({
                    url: 'CompanyParam/AddCompanyParams',
                    method: 'POST',
                    paramAsJson: true,
                    jsonData: {
                        companyId: form.recID,
                        paramIds: ids
                    },
                    scope: form,
                    success: function (result) {
                        dialog.close();
                        grid.reload();
                        sef.message.success("添加参数成功.", 3000);
                    },
                    failure: function (err, resp) {
                        sef.dialog.error(err.message);
                        form.setLoading(false);
                        console.log('error', err);
                    }
                });
            }
            this.updateLayout();
        }, this);
        dialog.show();
    },

    layouts_copylayout__execute: function () {
        var form = this;
        var grid = form.down('#Layouts');
        var layoutIds = grid.getSelectionIDs();
        sef.dialog.confirm(_('确认要复制布局?'), '', function () {
            sef.utils.ajax({
                url: 'MyLayout/CopyLayout',
                method: 'POST',
                paramAsJson: true,
                jsonData: {
                    companyId: form.recID,
                    layoutIds: layoutIds
                },
                scope: form,
                success: function (result) {
                    dialog.close();
                    grid.reload();
                    sef.message.success("复制布局成功.", 3000);
                },
                failure: function (err, resp) {
                    sef.dialog.error(err.message);
                    form.setLoading(false);
                    console.log('error', err);
                }
            });
        });
    },

    onPageReady: function() {
        this.updatePermission({
            initparam: true,
            params_addparam: true,
            params_editparam: true,
            params_delete: true,
            params_edit: true,
            users_create: true,
            users_delete: true,
            users_edit: true,
            layouts_changelayout: true,
            layouts_newlayout: true,
            layouts_delete: true,
            layouts_publishlayout: true,
            layouts_copylayout : true
        });
    },

    items: [{
        name: 'Code',
        fieldLabel: _('编号'),
        allowBlank: false,
        columnWidth:0.25
    }, {
        name: 'Name',
        fieldLabel: _('名称'),
        allowBlank: false,
        columnWidth: 0.25
        }, {
            name: 'ShortCode',
            fieldLabel: _('缩写编号'),
            allowBlank: false,
            columnWidth: 0.25
        },{
            xtype: 'sef-enumcombo',
            enumType: 'SEF.Core.Common.CompanyTypeEnum,SEF.Core.Common',
            name: 'CompanyType',
            fieldLabel: _('类型'),
            value: 2,
            allowBlank: false,
            columnWidth: 0.25
        },{
        name: 'Level',
        fieldLabel: _('级别'),
        xtype: 'sef-enumcombo',
        enumType: 'SEF.Core.Common.CompanyLevelEnum,SEF.Core.Common',
        value: 0,
        allowBlank: false,
        columnWidth: 0.25
        }, {
            name: 'Tel',
            fieldLabel: _('电话'),
            columnWidth: 0.25
        }, {
            name: 'Email',
            fieldLabel: _('邮箱'),
            columnWidth: 0.25
        }, {
            xtype: 'textarea',
            name: 'ModelOption',
            fieldLabel: _('梯型配置'),
            columnWidth: 1
        },  {
        name: 'Users',
        columnWidth: 1,
        xtype: 'sef-datagridfield',
        title: _('用户列表'),
        quickSearchFields: ['Code', 'Name'],
        bars: ['ADD', 'EDIT'],
        assoField: 'CompanyID',
        editor: {
            formType: 'sef-customeruserform',
            title: _('用户')
        },
        store: {
            type: 'sef-store',
            url: '/User',
            include: ['Company'],
            model: 'sef.app.liftnext.system.user.UserModel'
        },
        colConfig: [{
            name: 'Name',
            width:150
        },{
            name: 'Company',
            hidden:true
        }, {
            name: 'Pwd',
            hidden: true
        }, {
                name: 'AutoModifyFiled',
                hidden:true
        }]
    }, {
            name: 'Params',
            itemId: 'Params',
        columnWidth: 1,
        xtype: 'sef-datagridfield',
        title: _('客户参数'),
        maxHeight: 400,
        quickSearchFields: ['ParamDefine.Code', 'ParamDefine.Name'],
        bars: [{
            xtype: 'sef-actionbutton',
            actionName: 'addparam',
            btnType: 'default',
            dataAction: false,
            text: '新增参数'
        }, {
            xtype: 'sef-actionbutton',
            actionName: 'editparam',
            btnType: 'default',
            dataAction: true,
            text: '批量修改'
        }, 'EDIT',  'DELETE'],
        assoField: 'CompanyID',
        editor: {
            formType: 'sef-customerparamform',
            title: _('客户参数'),
            width: '65%',
            height: '65%'
        },
        colConfig: [{
            name: 'ParamDefine',
            hidden:true
        }],
        column: [{
            name: 'ParamNameAs',
            text: '参数名称',
            width: 150
        }, {
            index:2,
            name: 'ParamCode',
            text: '参数编号',
            width: 110
            }, {
                name: 'ParamCodeAs',
                text: '客户参数编号',
                width: 110
        }, {
            text:'显示类型',
            name: 'ParamXtype',
            width: 90
        }, {
            text: '可为空',
            name: 'AllowBlank',
            width: 75
        }, {
            text: '可编辑',
            name: 'Editable',
            width: 75
        }, {
            text: '可联动',
            name: 'Linkage',
            width: 75
        },{
            text: '可计算',
            name: 'Modify',
            width: 75
        }, {
            text: '可布局',
            name: 'Layout',
            width: 75
        }, {
            text: '可显示',
            name: 'Display',
            width: 80
        }],
        store: {
            type: 'sef-store',
            url: '/CompanyParam',
            include: ['ParamDefine'],
            //autoLoad:true,
            model: 'sef.app.liftnext.system.customer.CustomerParamModel'
        }
    }, {
        name: 'Layouts',
        itemId: 'Layouts',
        columnWidth: 1,
        xtype: 'sef-datagridfield',
        title: _('客户布局'),
        maxHeight: 400,
        quickSearchFields: ['Code', 'Name'],
        bars: [{
            xtype: 'sef-actionbutton',
            actionName: 'newlayout',
            btnType: 'default',
            dataAction: false,
            text: '新增布局'
        },{
            xtype: 'sef-actionbutton',
            actionName: 'changelayout',
            btnType: 'default',
            dataAction: true,
            text: '调整布局'
            }, {
                xtype: 'sef-actionbutton',
                actionName: 'copylayout',
                btnType: 'default',
                dataAction: true,
                text: '复制布局'
            }, {
            xtype: 'sef-actionbutton',
            actionName: 'publishlayout',
            btnType: 'default',
            dataAction: true,
            text: '发布布局'
        },'DELETE'],
        assoField: 'CompanyID',
        colConfig: [{
            index: 0,
            text: '适用',
            name: 'Owner',
            width: 100
        }, {
            index: 1,
            text: '名称',
            name: 'Name',
            width: 200
        }, {
            index: 5,
            name: 'User',
            renderer: sef.utils.relRenderer('Name'),
            text: '用户',
            width: 150
        }, {
            index: 7,
            text: '是否默认',
            name: 'IsDefault',
            width: 80
        }, {
            index: 8,
            text: '模块',
            name: 'UseType',
            width : 100
        }, {
            name: 'Items',
            hidden: true
        }, {
            name: 'Company',
            hidden: true
        }],
        store: {
            type: 'sef-store',
            url: '/MyLayout',
            include: ['User'],
            //autoLoad:true,
            model: 'sef.app.liftnext.system.layout.LayoutModel'
        }
    }, {
        xtype: 'textarea',
        name: 'Address',
        fieldLabel: _('地址'),
        columnWidth: 1
    }, {
        xtype: 'textarea',
        name: 'Desc',
        fieldLabel: _('备注'),
        columnWidth: 1
    }]
});