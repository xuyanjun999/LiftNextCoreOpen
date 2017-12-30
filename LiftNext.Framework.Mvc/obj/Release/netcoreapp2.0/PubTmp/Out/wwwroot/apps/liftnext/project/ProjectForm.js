//UserForm

Ext.define('sef.app.liftnext.project.ProjectForm', {
    extend: 'sef.core.components.page.FormPage',
    xtype: 'sef-projectform',
    layout: 'fit',
    focusModifingField: 'AutoModifyFiled',
    editMode: false,
    bars: [sef.runningCfg.BUTTONS.SAVE,
        '-',
    {
        text: '提交申请',
        xtype: 'sef-actionbutton',
        actionName: 'submitproject'
    }, {
        text: '变更申请',
        xtype: 'sef-actionbutton',
        actionName: 'submitchange'
    }, {
        text: '选择布局',
        xtype: 'sef-actionbutton',
        actionName: 'selectlayout'
    }
    ],

    showProjectItemDialog: function (form, filters, action) {
        var dialog = Ext.create('sef.core.components.window.EditorGridDialog', {
            rowEditable: false,//true则表示可编辑
            quickSearch: ['Code'],
            autoSave: false,//默认为true，在行编辑取消后自动保存到数据库
            width: '60%',
            height: '65%',
            singleSelection: false,
            title: '选择需要操作梯号',
            store: {
                type: 'sef-store',
                url: '/ProjectItem',
                autoLoad: true,
                include: ['Project'],
                model: 'sef.app.liftnext.design.DesignItemModel',
                additionFilterFn: function () {
                    return filters;
                }
            },
            colConfig: [{
                index: 0,
                name: 'Code',
                text: '梯号',
                width: 120
            }, {
                index: 1,
                name: 'DrawingNo',
                width: 150,
                text: '图纸编号'
            }, {
                index: 2,
                name: 'Model',
                text: '电梯型号',
                width: 150
            }, {
                index: 3,
                name: 'VerUser',
                text: '创建用户',
                width: 120
            }, {
                index: 4,
                name: 'VerDate',
                text: '创建日期',
                width: 120
            }, {
                index: 5,
                name: 'VerNo',
                text: '版本号',
                width: 80
            }, {
                name: 'Output',
                hidden: true
            }]
        });
        dialog.on('willclosedialog', function (state, result) {
            if (result.Result && result.Result.length > 0) {
                var codes = [];
                result.Result.forEach(function (f) {
                    codes.push(f.get('Code'));
                });
                action(form.recID, codes);
                return true;
            }
            this.updateLayout();
        }, form);
        dialog.show();
    },

    submitproject__execute: function (btn) {

        var form = this;
        sef.dialog.confirm(_('确认要申请图纸?'), '', function () {
            form.setLoading("Loading...");
            sef.utils.ajax({
                url: 'Project/SubmitProject',
                method: 'POST',
                paramAsJson: true,
                jsonData: {
                    projectId: form.recID
                },
                scope: form,
                success: function (result) {
                    sef.dialog.success("申请图纸成功");
                    form.setLoading(false);
                },
                failure: function (err, resp) {
                    sef.dialog.error(err.message);
                    form.setLoading(false);
                    console.log('error', err);
                }
            });
        });
    },

    submitchange__execute: function (btn) {
        var form = this;
        var filters = [{ FieldName: 'ProjectID', Values: [form.recID], Rel: "And" }, { FieldName: 'ProjectStatus', Values: [90], Rel: "And" }, { FieldName: "IsCurrentVer", Values: [1], Rel: "And", Operator: 5 }];
        form.showProjectItemDialog(form, filters, function (projectId, codes) {
            sef.utils.showInputDialog('变更描述', function (review) {
                form.setLoading("Loading...");
                sef.utils.ajax({
                    url: 'Project/SubmitChange',
                    method: 'POST',
                    paramAsJson: true,
                    jsonData: {
                        projectId: projectId,
                        codes: codes,
                        review: review
                    },
                    scope: form,
                    success: function (result) {
                        sef.dialog.success("申请变更成功");
                        form.setLoading(false);
                        return true;
                    },
                    failure: function (err, resp) {
                        sef.dialog.error(err.message);
                        form.setLoading(false);
                        console.log('error', err);
                        return true;
                    }
                });
            });
        });
    },

    downdraw__execute: function (btn) {
        var form = this;
        var compform = form.down('sef-complexprojectform');
        //console.log('compform', compform.selectCode);
        var code = compform.selectCode;
        sef.dialog.confirm(_('确认要下载图纸?'), '', function () {
            //form.setLoading("Loading...");
            sef.utils.ajax({
                url: 'Project/DownloadDrawingFile',
                method: 'POST',
                paramAsJson: true,
                jsonData: {
                    projectId: form.recID,
                    code: code
                },
                scope: form,
                success: function (result) {
                    //console.log('...result', result);
                    window.open('Download/DownloadFile?url=' + result.Output);
                    //form.setLoading(false);
                },
                failure: function (err, resp) {
                    sef.dialog.error(err.message);
                    form.setLoading(false);
                    console.log('error', err);
                }
            });
        });
    },

    selectlayout__execute: function (btn) {
        var me = this;
        var compform = me.down('sef-complexprojectform');
        var code = compform.selectCode;
        var layoutId = compform.selectNode.LayoutID || 0;
        var dialog = Ext.create('sef.core.components.window.CustomFormLayoutDialog', {
            width: '80%',
            height: '80%',
            layoutId: layoutId,
            useType: 0,
            selectLayout: true,
            companyId: me._rec.get('CompanyID')
        });
        dialog.on('dialogclose', function (state, result) {
            me.saveProjectLayout(result);
        });
        dialog.show();
    },

    saveProjectLayout: function (layoutId) {
        var me = this;
        var compform = me.down('sef-complexprojectform');
        var code = compform.selectCode;
        sef.utils.ajax({
            url: 'Project/SaveProjectLayout',
            method: 'POST',
            paramAsJson: true,
            jsonData: {
                projectId: me.recID,
                code: code,
                layoutId: layoutId
            },
            scope: me,
            success: function (result) {
                me.loadProjectParams()
            },
            failure: function (err, resp) {
                sef.dialog.error(err.message);
                console.log('error', err);
            }
        });
    },

    loadProjectParams: function () {
        var form = this;
        form.mask();
        sef.utils.ajax({
            url: 'Project/LoadProjectParams',
            method: 'POST',
            paramAsJson: true,
            jsonData: {
                projectId: form.recID
            },
            scope: form,
            success: function (result) {
                form.down('#pform').loadData(result, true);
                if (result.ProjectID === 0) {
                    var user = sef.runningCfg.getUser();
                    form.down('#SUBP').setValue(user.Name);
                    form.down('#SUBZ').setValue(user.Region);
                    form.down('#SUBD').setValue(new Date());
                }
                var nonstdForm = form.down('sef-nonstdtform');
                if (nonstdForm) {
                    nonstdForm.disabledStepCtl([1]);
                };
                form.unmask();
            },
            failure: function (err, resp) {
                sef.dialog.error(err.message);
                form.unmask();
                console.log('error', err);
            }
        });
    },

    onPageReady: function () {
        this.updatePermission({
            submitproject: true,
            submitchange: true,
            selectlayout: true
        });

    },

    onRecordChange: function (rec) {
        this.loadProjectParams();

    },

    onAfterSave: function (rec, data) {
        var form = this;
        form.loadRecordById(rec.getId());
    },

    onBeforeSave: function (data) {
        //debugger
        var vs = this.down('#pform').getValue();
        data.Params = vs;
        data.CreateDate = new Date();// Ext.Date.format(new Date(), 'Y-m-d');
        console.log(vs, data);
    },
    items: [{
        xtype: 'sef-complexprojectform',
        itemId: 'pform',
        columnWidth: 1,
        addUrl: '/Project/NewProjectItem',
        removeUrl: '/Project/DeleteProjectItem',
        changeCodeUrl: '/Project/ChangeProjectItem',
        margin: '10px 0 0 0',
        commonFormCollapsed: false,
        contextMenuType: 'default',
        onTreeNodeClick: function (me, rec, code) {
            var form = this.up('sef-projectform');
            var projectId = form.recID;
            if (projectId > 0) {
                this.getDrawResult(this, form, projectId, code);
            }
        },
        onDownDraw: function (me, id, code) {
            var form = me.up('sef-projectform');
            var projectId = form.recID;

            form.setLoading("Loading...");
            sef.utils.ajax({
                url: 'Project/DownloadDrawingFile',
                method: 'POST',
                paramAsJson: true,
                jsonData: {
                    projectId: projectId,
                    code: code
                },
                scope: form,
                success: function (result) {
                    window.open('Download/DownloadFile?url=' + result.Output);
                    form.setLoading(false);
                },
                failure: function (err, resp) {
                    sef.dialog.error(err.message);
                    form.setLoading(false);
                    console.log('error', err);
                }
            });
        },
        getDrawResult: function (me, form, projectId, code) {
            sef.utils.ajax({
                url: 'Design/GetDrawingTaskResult',
                method: 'POST',
                paramAsJson: true,
                jsonData: {
                    projectId: projectId,
                    code: code
                },
                scope: form,
                success: function (result) {
                    if (result.IsComplete) {
                        form.setStampMessage(null);
                        form.setStamp('');
                        form.setStamp('sef-stamp');
                    }
                    else if (result.IsError) {
                        form.setStamp('');
                        if (result.ErrorMsg) {
                            form.setStampMessage({
                                top: 180,
                                right: 45,
                                text: result.ErrorMsg
                            });
                        } else {
                            form.setStampMessage(null);
                        }
                    } else if (result.IsLoading) {
                        form.setStampMessage(null);
                        form.setStamp('');
                        form.setStamp('sef-stamp-loading');
                        //重新读取最新状态
                        //form.timeout = setTimeout(function () { return form.getDrawResult(form, projectId, code); }, "2000")
                    } else {
                        form.setStampMessage(null);
                        form.setStamp('');
                    }
                },
                failure: function (err, resp) {
                    sef.dialog.error(err.message);
                    console.log('error', err);
                }
            });
        },
        onHistory: function (me, id, code) {
            var form = me.up('sef-projectform');
            var dialog = Ext.create('sef.core.components.window.EditorGridDialog', {
                rowEditable: false,//true则表示可编辑
                quickSearch: ['Code'],
                autoSave: false,//默认为true，在行编辑取消后自动保存到数据库
                width: '70%',
                height: '70%',
                singleSelection: true,
                okText: '查看参数',
                title: '历史版本查看(请先选择版本号数据再查看参数)',
                store: {
                    type: 'sef-store',
                    url: '/ProjectItem',
                    autoLoad: true,
                    include: ['Project'],
                    model: 'sef.app.liftnext.design.DesignItemModel',
                    additionFilterFn: function () {
                        return [{ FieldName: 'ProjectID', Values: [form.recID], Rel: "And" }, { FieldName: 'Code', Values: [code], Rel: "And" }, { FieldName: 'IsCurrentVer', Values: [false], Rel: "And" }];
                    }
                },
                colConfig: [{
                    index: 0,
                    name: 'Code',
                    text: '梯号',
                    width: 120
                }, {
                    index: 1,
                    name: 'DrawingNo',
                    width: 150,
                    text: '图纸编号'
                }, {
                    index: 2,
                    name: 'Model',
                    text: '电梯型号',
                    width: 150
                }, {
                    index: 3,
                    name: 'VerUser',
                    text: '创建用户',
                    width: 100
                }, {
                    index: 4,
                    name: 'VerDate',
                    text: '创建日期',
                    width: 110
                }, {
                    index: 5,
                    name: 'VerNo',
                    text: '版本号',
                    width: 80
                }, {
                    index: 6,
                    name: 'Output',
                    text: '图纸',
                    width: 100,
                    renderer: function (v, f, p) {
                        var html = "<a href='#' onclick=window.open('" + v + "')>下载</a>";
                        return html;
                    },
                }]
            });
            dialog.on('willclosedialog', function (state, result) {
                var id = result.Result[0].get("ID");

                var formDialog = Ext.create('sef.core.components.window.BaseDialog', {
                    width: '70%',
                    height: '70%',
                    singleSelection: false,
                    title: '历史版本参数',
                    items: [{
                        xtype: 'sef-complexprojectformsingle',
                        itemId: 'pform',
                        columnWidth: 1,
                        //height:400,
                        margin: 0,
                        bodyPadding: 0,
                        onLoadData: function () {
                            sef.utils.ajax({
                                url: 'Design/LoadProjectParamSingle',
                                method: 'POST',
                                paramAsJson: true,
                                jsonData: {
                                    projectItemId: id
                                },
                                scope: formDialog,
                                success: function (result) {
                                    formDialog.down('#pform').loadData(result, true);
                                    formDialog.unmask();
                                },
                                failure: function (err, resp) {
                                    sef.dialog.error(err.message);
                                    formDialog.unmask();
                                    console.log('error', err);
                                }
                            });
                        }
                    }]
                });
                formDialog.show();
                return false;
            }, this);
            dialog.show();
        },
        onFormFieldBlur: function (me, form, code) {
            var pform = form.up('sef-projectform');
            var projectId = pform.recID;
            sef.utils.ajax({
                url: 'Project/CalcRelationParam',
                method: 'POST',
                paramAsJson: true,
                jsonData: {
                    param: me.name,
                    value: me.getValue(),
                    formValues: form.getValues()
                },
                scope: form,
                success: function (result) {
                    pform.setStamp(null);
                    if (result.Values) {
                        form.getForm().setValues(result.Values);

                        result.Params.forEach(function (f) {
                            var field = form.getForm().findField(f);
                            if (field) {
                                //console.log(field._oldValue, field.getValue())
                                if (field._oldValue != field.getValue()) {
                                    field.setFieldStyle("color:#000;font-weight:bold");
                                } else {
                                    field.setFieldStyle("color:rgba(0, 0, 0, 0.7);font-weight:400");
                                }
                            }
                        });
                    }
                },
                failure: function (err, resp) {
                    sef.dialog.error(err.message);
                    console.log('error', err);
                    form.setLoading(false);
                    form.setStamp(null);
                }
            });
            pform.setStamp('sef-stamp-loading');
        }
    }]
});