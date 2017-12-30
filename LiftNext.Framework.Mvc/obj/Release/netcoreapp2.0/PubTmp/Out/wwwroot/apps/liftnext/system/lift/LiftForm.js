//UserForm

Ext.define('sef.app.liftnext.system.lift.LiftForm', {
    extend: 'sef.core.components.page.FormPage',
    xtype: 'sef-liftform',
    bodyPadding: 0,// '0 10px 20px 0px',
    scrollable: false,
    // layout: 'fit',
    layout: {
        type: 'hbox',
        align: 'stretch'
    },

    bars: [sef.runningCfg.BUTTONS.SAVE,
    sef.runningCfg.BUTTONS.EDIT_INFORM,
    sef.runningCfg.BUTTONS.DEL_INFORM,
    {
        text: '获取块分组',
        xtype: 'sef-actionbutton',
        btnType: 'default',
        actionName: 'getgroup'
    },
    {
        text: '复制梯型',
        xtype: 'sef-actionbutton',
        btnType: 'default',
        actionName: 'copymodel'
    }
    ],

    getgroup__execute: function (btn) {
        var form = this;
        sef.utils.ajax({
            url: 'Model/GetBlockGroups',
            method: 'POST',
            paramAsJson: true,
            jsonData: {
                modelId: form.recID
            },
            scope: form,
            success: function (result) {
                var tree = form.down('#formTree');
                tree.reload();

                sef.message.success("获取块分组成功", 3000);
            },
            failure: function (err, resp) {
                sef.dialog.error(err.message);
                form.setLoading(false);
                console.log('error', err);
            }
        });
    },

    copymodel__execute: function (btn) {
        var form = this;
        sef.dialog.confirm("确定要复制梯型数据?", null, function () {
            sef.utils.ajax({
                url: 'Model/CopyModel',
                method: 'POST',
                paramAsJson: true,
                jsonData: {
                    modelId: form.recID
                },
                scope: form,
                success: function (result) {
                    sef.message.success("复制梯型成功", 3000);
                },
                failure: function (err, resp) {
                    sef.dialog.error(err.message);
                    form.setLoading(false);
                    console.log('error', err);
                }
            });
        });
    },

    onPageReady: function () {

        //console.log('formpage will on ready');
        //此方法用于更新权限信息
        //roles为子表名称，若不加则为主表的行为
        this.updatePermission({
            getgroup: true,
            copymodel: true,
            modelblocks_delete: true,
            modelblocks_edit: true,
            modelblocks_selectblock: true,
            modelparams_exportparam: true,
            modelparams_importparam: true,
            modelparams_delete: true,
            modelparams_edit: true,
            modelcusparams_exportparam: true,
            modelcusparams_importcusparam: true,
            modelcusparams_delete: true,
            modelcusparams_edit: true,
            modeloptions_exportoption: true,
            modeloptions_importoption: true,
            modeloptions_delete: true,
            modeloptions_edit: true,
            modelnonstds_exportnonstd: true,
            modelnonstds_importnonstd: true,
            modelnonstds_delete: true,
            modelnonstds_edit: true,
            modelvalids_exportvalid: true,
            modelvalids_importvalid: true,
            modelvalids_delete: true,
            modelvalids_edit: true,
            modelcompanys_applycompany: true,
            modelcompanys_effectdate: true,
            modelcompanys_enddate: true
        });
        this.editMode = false;
    },
    //加上此节点用于显示标准树
    onRecordChange: function (rec) {
        if (rec != null) {
            this.down('#formTree').reload();
        }
    },

    onTreeItemClick: function (tree, record) {
        //console.log('child user.tree.click', tree, record);
        //console.log(tree.up('sef-liftform').down('#ModelBlocks'));
        tree.up('sef-liftform').down('#ModelBlocks').getStore().makeQuerys({
            FieldName: 'ModelGroupID', Values: [record.data.ID], Rel: 'And', Operator: 5
        });
        tree.up('sef-liftform').down('#ModelParams').store.makeQuerys({
            FieldName: 'BlockGroups', Values: [record.data.Data], Rel: 'And', Operator: 6
        });
        //tree.reload();
    },

    modelblocks_selectblock__execute: function (btn) {
        var form = this;
        var tree = form.down('#formTree');
        var grid1 = form.down('#ModelBlocks');
        var grid2 = form.down('#ModelParams');
        var selectNodes = tree.getSelection();
        if (selectNodes.length > 0) {
            //console.log('select tree node..', selectNodes)
            var modelGroupId = selectNodes[0].data.ID;
            var modelGroup = selectNodes[0].data.Data;
            //return;
            var dialog = Ext.create('sef.core.components.window.LookupDialog', { //SEF.core.view.security.LoginDialog', {
                //url: url
                closeAction: 'hide',
                singleSelection: false,
                quickSearch: ['Name', 'Code'],
                store: {
                    type: 'sef-store',
                    url: '/Block',
                    autoLoad: true,
                    model: 'sef.app.liftnext.system.block.BlockModel',
                    additionFilterFn: function () {
                        return [{ FieldName: 'BlockGroup', Values: [modelGroup], Rel: "And" }, { FieldName: "BlockStatus", Values: [0], Rel: "And", Operator: 3 }];
                        //, ;
                    }
                },
                columns: ['Code', 'Name', 'Desc']
            });
            dialog.on('dialogclose', function (state, result) {
                //console.log('export dialog will close#', state, result);
                if (result.Result && result.Result.length > 0) {
                    var ids = [];
                    Ext.Array.each(result.Result, function (item) {
                        ids.push(item.data.ID);
                    });
                    sef.utils.ajax({
                        url: 'Model/AddModelBlocks',
                        method: 'POST',
                        paramAsJson: true,
                        jsonData: {
                            modelId: form.recID,
                            modelGroupId: modelGroupId,
                            blockIDs: ids
                        },
                        scope: form,
                        success: function (result) {
                            dialog.close();
                            grid1.reload();
                            grid2.reload();
                            sef.message.success("选择块成功.", 3000);
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
        }
    },

    modelparams_exportparam__execute: function (btn) {
        var grid = this.down('#ModelParams');
        var dialog = Ext.create('sef.core.components.window.ExportDialog', { //SEF.core.view.security.LoginDialog', {
            url: 'ModelParam/Export',
            columns: ['BlockGroups', 'BlockCodes', 'ParamDefine.Name', 'ParamDefine.Code', 'ParamValue'],
            include: ['ParamDefine'],
            store: grid.store
        });
        dialog.show();
    },

    modelparams_importparam__execute: function (btn) {
        var form = this;
        var grid = form.down('#ModelParams');
        var dialog = Ext.create('sef.core.components.uploader.UploadDialog', {
            //dialogTitle: 'My Upload Widget',
            uploadParams: {
                modelId: form.recID
            },
            uploadUrl: '/Model/UploadModelParams'
        });
        dialog.on('uploadcomplete', function (up, mgr, uploadedItems, err, errMsg) {
            //console.log('uploadcomplete arguments', arguments);
            if (errMsg) {
                sef.dialog.error(errMsg);
            } else {
                sef.message.success("上传成功", 3000);
                grid.reload();
            }
            dialog.close();
        });
        dialog.show();
    },

    modelcusparams_exportparam__execute: function (btn) {
        var grid = this.down('#ModelCusParams');
        var dialog = Ext.create('sef.core.components.window.ExportDialog', { //SEF.core.view.security.LoginDialog', {
            url: 'ModelParam/Export',
            columns: ['ParamDefine.Name', 'ParamDefine.Code', 'ParamValue'],
            include: ['ParamDefine'],
            store: grid.store
        });
        dialog.show();
    },

    modelcusparams_importcusparam__execute: function (btn) {
        var form = this;
        var grid = form.down('#ModelCusParams');
        var dialog = Ext.create('sef.core.components.uploader.UploadDialog', {
            uploadParams: {
                modelId: form.recID
            },
            uploadUrl: '/Model/UploadModelCusParams'
        });
        dialog.on('uploadcomplete', function (up, mgr, uploadedItems, err, errMsg) {
            //console.log('uploadcomplete arguments', arguments);
            if (errMsg) {
                sef.dialog.error(errMsg);
            } else {
                sef.message.success("上传成功", 3000);
                grid.reload();
            }
            dialog.close();
        });
        dialog.show();
    },

    modeloptions_exportoption__execute: function (btn) {
        var grid = this.down('#ModelOptions');
        var dialog = Ext.create('sef.core.components.window.ExportDialog', { //SEF.core.view.security.LoginDialog', {
            url: 'ModelOption/Export',
            columns: ['ParamDefine.Name', 'ParamDefine.Code', 'DefaultValue'],
            include: ['ParamDefine'],
            store: grid.store
        });
        dialog.show();
    },

    modeloptions_importoption__execute: function (btn) {
        var form = this;
        var grid = form.down('#ModelOptions');
        var dialog = Ext.create('sef.core.components.uploader.UploadDialog', {
            uploadParams: {
                modelId: form.recID
            },
            uploadUrl: '/Model/UploadModelOptions'
        });
        dialog.on('uploadcomplete', function (up, mgr, uploadedItems, err, errMsg) {
            //console.log('uploadcomplete arguments', arguments);
            if (errMsg) {
                sef.dialog.error(errMsg);
            } else {
                sef.message.success("上传成功", 3000);
                grid.reload();
            }
            dialog.close();
        });
        dialog.show();
    },

    modelnonstds_exportnonstd__execute: function (btn) {
        var grid = this.down('#ModelNonstds');
        var dialog = Ext.create('sef.core.components.window.ExportDialog', { //SEF.core.view.security.LoginDialog', {
            url: 'ModelNonstd/Export',
            columns: ['ParamDefine.Name', 'ParamDefine.Code', 'NonstdValue'],
            include: ['ParamDefine'],
            store: grid.store
        });
        dialog.show();
    },

    modelnonstds_importnonstd__execute: function (btn) {
        var form = this;
        var grid = form.down('#ModelNonstds');
        var dialog = Ext.create('sef.core.components.uploader.UploadDialog', {
            uploadParams: {
                modelId: form.recID
            },
            uploadUrl: '/Model/UploadModelNonstds'
        });
        dialog.on('uploadcomplete', function (up, mgr, uploadedItems, err, errMsg) {
            //console.log('uploadcomplete arguments', arguments);
            if (errMsg) {
                sef.dialog.error(errMsg);
            } else {
                sef.message.success("上传成功", 3000);
                grid.reload();
            }
            dialog.close();
        });
        dialog.show();
    },

    modelvalids_exportvalid__execute: function (btn) {
        var grid = this.down('#ModelValids');
        var dialog = Ext.create('sef.core.components.window.ExportDialog', { //SEF.core.view.security.LoginDialog', {
            url: 'ModelValid/Export',
            columns: ['ParamDefine.Name', 'ParamDefine.Code', 'ValidValue'],
            include: ['ParamDefine'],
            store: grid.store
        });
        dialog.show();
    },

    modelvalids_importvalid__execute: function (btn) {
        var form = this;
        var grid = form.down('#ModelValids');
        var dialog = Ext.create('sef.core.components.uploader.UploadDialog', {
            uploadParams: {
                modelId: form.recID
            },
            uploadUrl: '/Model/UploadModelValids'
        });
        dialog.on('uploadcomplete', function (up, mgr, uploadedItems, err, errMsg) {
            //console.log('uploadcomplete arguments', arguments);
            if (errMsg) {
                sef.dialog.error(errMsg);
            } else {
                sef.message.success("上传成功", 3000);
                grid.reload();
            }
            dialog.close();
        });
        dialog.show();
    },

    modelcompanys_applycompany__execute: function (btn) {
        var form = this;
        var grid = form.down('#ModelCompanys');
        var dialog = Ext.create('sef.core.components.window.LookupDialog', { //SEF.core.view.security.LoginDialog', {
            closeAction: 'hide',
            singleSelection: false,
            quickSearch: ['Name', 'Code'],
            store: {
                type: 'sef-store',
                url: '/Company',
                autoLoad: true,
                model: 'sef.app.liftnext.system.customer.CustomerModel',
                additionFilterFn: function () {
                }
            },
            columns: ['Code', 'Name']
        });
        dialog.on('dialogclose', function (state, result) {
            //console.log('export dialog will close#', state, result);
            if (result.Result && result.Result.length > 0) {
                var ids = [];
                Ext.Array.each(result.Result, function (item) {
                    ids.push(item.data.ID);
                });
                sef.utils.ajax({
                    url: 'Model/AddModelCompanys',
                    method: 'POST',
                    paramAsJson: true,
                    jsonData: {
                        modelId: form.recID,
                        companyIds: ids
                    },
                    scope: form,
                    success: function (result) {
                        dialog.close();
                        grid.reload();
                        sef.message.success("选择公司成功.", 3000);
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

    modelcompanys_effectdate__execute: function (btn) {
        var form = this;
        var grid = form.down('#ModelCompanys');
        var ids = grid.getSelectionIDs();

        var dialog = Ext.create('sef.core.components.window.BaseDialog', { //SEF.core.view.security.LoginDialog', {
            closeAction: 'hide',
            title: _('设置生效日期'),
            closable: false,
            width: 250,
            height: 200,
            iconCls: 'x-fa fa-lock',
            dynamicContent: true,
            onBeforeCloseDialog: function () {
                var dateForm = this.down('#dateForm');
                if (dateForm.hasInvalidField()) return false;
                var date = dateForm.down('#Date').getValue();
                var me = this;
                sef.utils.ajax({
                    url: 'Model/EffectModelCompanys',
                    method: 'POST',
                    jsonData: {
                        modelCompanyIds: ids,
                        date: date
                    },
                    scope: me,
                    success: function (result) {
                        this.setDialogLoading(false, false);
                        sef.message.success(_('设置生效日期成功'));
                        grid.reload();
                        this.closeDialog(0, 1);
                    },
                    failure: function (err, resp) {
                        this.setDialogLoading(false, false);
                        //this.unmask();
                        sef.dialog.error(err.message);
                    }
                });
                this.setDialogLoading(true, false);
                return false;
            },
            items: [{
                xtype: 'form',
                itemId: 'dateForm',
                layout: 'column',
                defaults: {
                    xtype: 'textfield',
                    labelAlign: 'top',
                    allowBlank: false
                },
                items: [{
                    xtype: 'datefield',
                    fieldLabel: _('生效日期'),
                    name: 'Date',
                    itemId: 'Date'
                }]
            }]
        });
        dialog.show();
    },

    modelcompanys_enddate__execute: function (btn) {
        var form = this;
        var grid = form.down('#ModelCompanys');
        var ids = grid.getSelectionIDs();

        var dialog = Ext.create('sef.core.components.window.BaseDialog', { //SEF.core.view.security.LoginDialog', {
            closeAction: 'hide',
            title: _('设置失效日期'),
            closable: false,
            width: 250,
            height: 200,
            iconCls: 'x-fa fa-lock',
            dynamicContent: true,
            onBeforeCloseDialog: function () {
                var dateForm = this.down('#dateForm');
                if (dateForm.hasInvalidField()) return false;
                var date = dateForm.down('#Date').getValue();
                var me = this;
                sef.utils.ajax({
                    url: 'Model/EndModelCompanys',
                    method: 'POST',
                    jsonData: {
                        modelCompanyIds: ids,
                        date: date
                    },
                    scope: me,
                    success: function (result) {
                        this.setDialogLoading(false, false);
                        sef.message.success(_('设置失效日期成功'));
                        grid.reload();
                        this.closeDialog(0, 1);
                    },
                    failure: function (err, resp) {
                        this.setDialogLoading(false, false);
                        //this.unmask();
                        sef.dialog.error(err.message);
                    }
                });
                this.setDialogLoading(true, false);
                return false;
            },
            items: [{
                xtype: 'form',
                itemId: 'dateForm',
                layout: 'column',
                defaults: {
                    xtype: 'textfield',
                    labelAlign: 'top',
                    allowBlank: false
                },
                items: [{
                    xtype: 'datefield',
                    fieldLabel: _('失效日期'),
                    name: 'Date',
                    itemId: 'Date'
                }]
            }]
        });
        dialog.show();
    },

    items: [{
        itemId: 'formTree',
        xtype: 'sef-pagetree',
        title: '块分组',
        //用于加载树的url
        url: '/ModelGroup/GetGroupTree',
        width: 250,
        collapsible: false,
        autoLoad: false,
        onTreeWillLoad: function () {
            var modelId = this.up('sef-liftform').recID;
            return {
                ID: modelId
            };
        }
    }, {
        xtype: 'container',
        //layout: 'fit',
        flex: 1,
        scrollable: 'y',
        items: {
            xtype: 'container',
            layout: 'column',
            defaults: {
                columnWidth: .333333,
                margin: '0 10px 5px 10px',
                xtype: 'textfield',
                labelAlign: 'top',
                labelSeparator: ''
            },
            items: [{
                name: 'Code',
                fieldLabel: _('梯型编号'),
                allowBlank: false
            }, {
                name: 'Name',
                fieldLabel: _('名称'),
                allowBlank: false
            }, {
                name: 'ModelClass',
                fieldLabel: _('梯型分类'),
                value: '未设置'
            }, {
                name: 'CreateUser',
                fieldLabel: _('创建用户'),
                readOnly: true
            }, {
                xtype: 'datefield',
                name: 'CreateDate',
                fieldLabel: _('创建日期'),
                readOnly: true,
                value: new Date()
            }, {
                name: 'OwnerType',
                fieldLabel: _('所属类型'),
                xtype: 'sef-enumcombo',
                enumType: 'SEF.Core.Common.OwnerTypeEnum,SEF.Core.Common',
                value: 0,
                readOnly: true
            }, {
                xtype: 'textarea',
                name: 'Desc',
                fieldLabel: _('描述'),
                columnWidth: 1
            }, {
                itemId: 'ModelBlocks',
                name: 'ModelBlocks',
                columnWidth: 1,
                xtype: 'sef-datagridfield',
                title: _('块信息'),
                maxHeight: 400,
                quickSearchFields: ['BlockName', 'BlockCode'],
                bars: [{
                    xtype: 'sef-actionbutton',
                    actionName: 'selectblock',
                    btnType: 'default',
                    text: '选择分组块'
                }, 'EDIT', 'DELETE'],
                assoField: 'ModelID',
                colConfig: [{
                    name: 'ModelGroup',
                    renderer: sef.utils.relRenderer('BlockGroup'),
                    width: 150
                }, {
                    name: 'BlockName',
                    width: 150,
                    text: _('块名称')
                }, {
                    name: 'BlockCode',
                    width: 150,
                    text: _('块编号')
                }, {
                    name: 'InsertPointY',
                    width: 150,
                    renderer: function (v) {
                        return Ext.String.htmlEncode(v);
                    }
                }, {
                    name: 'InsertPointY',
                    width: 150,
                    renderer: function (v) {
                        return Ext.String.htmlEncode(v);
                    }
                }, {
                    name: 'ExInsertPointY',
                    width: 150,
                    renderer: function (v) {
                        return Ext.String.htmlEncode(v);
                    }
                }, {
                    name: 'ExInsertPointY',
                    width: 150,
                    renderer: function (v) {
                        return Ext.String.htmlEncode(v);
                    }
                }],
                editor: {
                    formType: 'sef-liftblockform',
                    title: _('块管理'),
                    width: '80%',
                    height: '80%',
                },
                onAfterDelete: function () {
                    //console.log('onAfterDelete', this);
                    this.up('sef-liftform').down('#ModelParams').reload();
                },
                store: {
                    type: 'sef-store',
                    url: '/ModelBlock',
                    include: ['ModelGroup'],
                    autoLoad: false,
                    model: 'sef.app.liftnext.system.lift.LiftBlockModel'
                }
            }, {
                itemId: 'ModelParams',
                name: 'ModelParams',
                columnWidth: 1,
                xtype: 'sef-datagridfield',
                title: _('块参数管理'),
                quickSearchFields: ['ParamDefine.Name', 'ParamDefine.Code'],
                maxHeight: 400,
                bars: [{
                    xtype: 'sef-actionbutton',
                    actionName: 'exportparam',
                    btnType: 'default',
                    dataAction: false,
                    text: '导出块参数'
                }, {
                    xtype: 'sef-actionbutton',
                    actionName: 'importparam',
                    btnType: 'default',
                    dataAction: false,
                    text: '上传块参数'
                }, 'EDIT', 'DELETE'],
                assoField: 'ModelID',
                colConfig: [{
                    name: 'BlockGroups',
                    width: 120
                }, {
                    name: 'BlockCodes',
                    width: 150
                }, {
                    index: 4,
                    name: 'ParamDefine.Name',
                    dataIndex: 'ParamDefine.Name',
                    renderer: function (v, f, p) {
                        if (!p.data.ParamDefine) return "";
                        return p.data.ParamDefine.Name;
                    },
                    width: 150,
                    text: '参数名称'
                }, {
                    index: 5,
                    name: 'ParamDefine.Code',
                    dataIndex: 'ParamDefine.Code',
                    renderer: function (v, f, p) {
                        if (!p.data.ParamDefine) return "";
                        return p.data.ParamDefine.Code;
                    },
                    width: 120,
                    text: '参数编码'
                }, {
                    index: 6,
                    name: 'ParamValue',
                    flex: 1,
                    text: '参数逻辑',
                    renderer: function (v) {
                        return Ext.String.htmlEncode(v);
                    }
                }, {
                    name: 'ParamDefine',
                    hidden: true
                }],
                editor: {
                    formType: 'sef-liftparamform',
                    title: _('块参数管理')
                },
                store: {
                    type: 'sef-store',
                    url: '/ModelParam',
                    include: ["ParamDefine"],
                    //autoLoad:true,
                    model: 'sef.app.liftnext.system.lift.LiftParamModel',
                    additionFilterFn: function () {
                        return { FieldName: 'IsBlockParam', Values: [true] };
                    },
                }
            }, {
                itemId: 'ModelCusParams',
                name: 'ModelCusParams',
                columnWidth: 1,
                xtype: 'sef-datagridfield',
                title: _('其它参数管理'),
                maxHeight: 400,
                quickSearchFields: ['ParamDefine.Name', 'ParamDefine.Code'],
                bars: [{
                    xtype: 'sef-actionbutton',
                    actionName: 'exportparam',
                    btnType: 'default',
                    dataAction: false,
                    text: '导出其它参数'
                }, {
                    xtype: 'sef-actionbutton',
                    actionName: 'importcusparam',
                    btnType: 'default',
                    dataAction: false,
                    text: '上传其它参数'
                }, 'EDIT', 'DELETE'],
                assoField: 'ModelID',
                colConfig: [{
                    name: 'BlockGroups',
                    width: 120,
                    hidden: true
                }, {
                    name: 'BlockCodes',
                    width: 150,
                    hidden: true
                }, {
                    index: 4,
                    name: 'ParamDefine.Name',
                    dataIndex: 'ParamDefine.Name',
                    renderer: function (v, f, p) {
                        if (!p.data.ParamDefine) return "";
                        return p.data.ParamDefine.Name;
                    },
                    width: 150,
                    text: '参数名称'
                }, {
                    index: 5,
                    name: 'ParamDefine.Code',
                    dataIndex: 'ParamDefine.Code',
                    renderer: function (v, f, p) {
                        if (!p.data.ParamDefine) return "";
                        return p.data.ParamDefine.Code;
                    },
                    width: 120,
                    text: '参数编码'
                }, {
                    index: 6,
                    name: 'ParamValue',
                    flex: 1,
                    text: '参数逻辑',
                    renderer: function (v) {
                        return Ext.String.htmlEncode(v);
                    }
                }, {
                    name: 'ParamDefine',
                    hidden: true
                }],
                editor: {
                    formType: 'sef-liftparamform',
                    title: _('梯型其它参数管理')
                },
                store: {
                    type: 'sef-store',
                    url: '/ModelParam',
                    include: ["ParamDefine"],
                    //autoLoad:true,
                    model: 'sef.app.liftnext.system.lift.LiftParamModel',
                    additionFilterFn: function () {
                        return { FieldName: 'IsBlockParam', Values: [false] };
                    },
                }
            }, {
                itemId: 'ModelOptions',
                name: 'ModelOptions',
                columnWidth: 1,
                xtype: 'sef-datagridfield',
                title: _('参数可选项管理'),
                maxHeight: 400,
                quickSearchFields: ['ParamDefine.Name', 'ParamDefine.Code'],
                bars: [{
                    xtype: 'sef-actionbutton',
                    actionName: 'exportoption',
                    btnType: 'default',
                    dataAction: false,
                    text: '导出参数可选项'
                }, {
                    xtype: 'sef-actionbutton',
                    actionName: 'importoption',
                    btnType: 'default',
                    dataAction: false,
                    text: '上传参数可选项'
                }, 'EDIT', 'DELETE'],
                assoField: 'ModelID',
                colConfig: [{
                    index: 4,
                    name: 'ParamDefine',
                    renderer: sef.utils.relRenderer('Name'),
                    width: 150,
                    text: '参数名称'
                }, {
                    index: 5,
                    dataIndex: 'ParamCode',
                    renderer: function (v, f, p) {
                        if (!p.data.ParamDefine) return "";
                        return p.data.ParamDefine.Code
                    },
                    width: 120,
                    text: '参数编码'
                }, {
                    index: 6,
                    name: 'DefaultValue',
                    flex: 1,
                    text: '可选项',
                    renderer: function (v) {
                        return Ext.String.htmlEncode(v);
                    }
                }],
                editor: {
                    formType: 'sef-liftoptionform',
                    title: _('参数可选项管理')
                },
                store: {
                    type: 'sef-store',
                    url: '/ModelOption',
                    include: ["ParamDefine"],
                    //autoLoad:true,
                    model: 'sef.app.liftnext.system.lift.LiftOptionModel'
                }
            }, {
                itemId: 'ModelNonstds',
                name: 'ModelNonstds',
                columnWidth: 1,
                xtype: 'sef-datagridfield',
                title: _('参数非标管理'),
                maxHeight: 400,
                quickSearchFields: ['ParamDefine.Name', 'ParamDefine.Code'],
                bars: [{
                    xtype: 'sef-actionbutton',
                    actionName: 'exportnonstd',
                    btnType: 'default',
                    dataAction: false,
                    text: '导出参数非标'
                }, {
                    xtype: 'sef-actionbutton',
                    actionName: 'importnonstd',
                    btnType: 'default',
                    dataAction: false,
                    text: '上传参数非标'
                }, 'EDIT', 'DELETE'],
                assoField: 'ModelID',
                colConfig: [{
                    index: 4,
                    name: 'ParamDefine',
                    renderer: sef.utils.relRenderer('Name'),
                    width: 150,
                    text: '参数名称'
                }, {
                    index: 5,
                    dataIndex: 'ParamCode',
                    renderer: function (v, f, p) {
                        if (!p.data.ParamDefine) return "";
                        return p.data.ParamDefine.Code
                    },
                    width: 120,
                    text: '参数编码'
                }, {
                    index: 6,
                    name: 'NonstdValue',
                    flex: 1,
                    text: '非标公式',
                    renderer: function (v) {
                        return Ext.String.htmlEncode(v);
                    }
                }],
                editor: {
                    formType: 'sef-liftnonstdform',
                    title: _('参数非标管理')
                },
                store: {
                    type: 'sef-store',
                    url: '/ModelNonstd',
                    include: ["ParamDefine"],
                    //autoLoad:true,
                    model: 'sef.app.liftnext.system.lift.LiftNonstdModel'
                }
            }, {
                itemId: 'ModelValids',
                name: 'ModelValids',
                columnWidth: 1,
                xtype: 'sef-datagridfield',
                title: _('参数检验管理'),
                maxHeight: 400,
                quickSearchFields: ['ParamDefine.Name', 'ParamDefine.Code'],
                bars: [{
                    xtype: 'sef-actionbutton',
                    actionName: 'exportvalid',
                    btnType: 'default',
                    dataAction: false,
                    text: '导出参数校验'
                }, {
                    xtype: 'sef-actionbutton',
                    actionName: 'importvalid',
                    btnType: 'default',
                    dataAction: false,
                    text: '上传参数校验'
                }, 'EDIT', 'DELETE'],
                assoField: 'ModelID',
                colConfig: [{
                    index: 4,
                    name: 'ParamDefine',
                    renderer: sef.utils.relRenderer('Name'),
                    width: 150,
                    text: '参数名称'
                }, {
                    index: 5,
                    dataIndex: 'ParamCode',
                    renderer: function (v, f, p) {
                        if (!p.data.ParamDefine) return "";
                        return p.data.ParamDefine.Code
                    },
                    width: 120,
                    text: '参数编码'
                }, {
                    index: 6,
                    name: 'ValidValue',
                    flex: 1,
                    text: '验证公式'
                }],
                editor: {
                    formType: 'sef-liftvalidform',
                    title: _('参数检验管理')
                },
                store: {
                    type: 'sef-store',
                    url: '/ModelValid',
                    include: ["ParamDefine"],
                    //autoLoad:true,
                    model: 'sef.app.liftnext.system.lift.LiftValidModel'
                }
            }, {
                itemId: 'ModelCompanys',
                name: 'ModelCompanys',
                columnWidth: 1,
                xtype: 'sef-datagridfield',
                title: _('所属公司管理'),
                maxHeight: 400,
                quickSearchFields: ['Company.Name', 'Company.Code'],
                bars: [{
                    xtype: 'sef-actionbutton',
                    actionName: 'applycompany',
                    btnType: 'default',
                    dataAction: false,
                    text: '选择公司'
                }, {
                    xtype: 'sef-actionbutton',
                    actionName: 'effectdate',
                    btnType: 'default',
                    dataAction: true,
                    text: '设置生效日期'
                }, {
                    xtype: 'sef-actionbutton',
                    actionName: 'enddate',
                    btnType: 'default',
                    dataAction: true,
                    text: '设置失效日期'
                }, 'DELETE'],
                assoField: 'ModelID',
                colConfig: [{
                    index: 1,
                    name: 'Company',
                    renderer: sef.utils.relRenderer('Name'),
                    width: 150,
                    text: '公司名称'
                }, {
                    index: 2,
                    dataIndex: 'CompanyCode',
                    renderer: function (v, f, p) {
                        if (!p.data.Company) return "";
                        return p.data.Company.Code
                    },
                    width: 120,
                    text: '公司代码'
                }, {
                    index: 5,
                    name: 'EffectDate',
                    width: 120,
                    text: '生效日期'
                }, {
                    index: 6,
                    name: 'EndDate',
                    width: 120,
                    text: '失效日期'
                }],
                store: {
                    type: 'sef-store',
                    url: '/ModelCompany',
                    include: ["Company"],
                    //autoLoad:true,
                    model: 'sef.app.liftnext.system.lift.LiftCompanyModel'
                }
            }]
        }
    }]
});