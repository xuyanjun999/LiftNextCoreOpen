//UserForm

Ext.define('sef.app.liftnext.design.DesignForm', {
    extend: 'sef.core.components.page.FormPage',
    xtype: 'sef-designform',
    layout: 'fit',
    focusModifingField: 'AutoModifyFiled',
    editMode: false,
    bodyPadding:0,
    timeout :null,
    bars: [sef.runningCfg.BUTTONS.SAVE,
        {
            text: '查看参数',
            xtype: 'sef-actionbutton',
            actionName: 'loadparam'
        }, {
            text: '查看块',
            xtype: 'sef-actionbutton',
            actionName: 'loadblock'
        },  {
            text: '生成图纸',
            xtype: 'sef-actionbutton',
            actionName: 'markdraw'
        }, {
            text: '下载图纸',
            xtype: 'sef-actionbutton',
            actionName: 'downdraw'
        }, {
            text: '图纸审核',
            xtype: 'sef-actionbutton',
            actionName: 'submitauditproject'
        },
        {
            text: '驳回申请',
            xtype: 'sef-actionbutton',
            actionName: 'cancelproject'
        },{
            text: '选择布局',
            xtype: 'sef-actionbutton',
            actionName: 'selectlayout'
        }],

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

    submitauditproject__execute: function (btn) {
        var form = this;
        var filters = [{ FieldName: 'ProjectID', Values: [form.recID], Rel: "And", SearchGroupID: 10 },
            { FieldName: "IsCurrentVer", Values: [1], Rel: "And", Operator: 5, SearchGroupID: 10 },
            { FieldName: 'ProjectStatus', Values: [10], Rel: "And", SearchGroupID: 11 },
            { FieldName: 'ReviewStatus', Values: [10], Rel: "Or", SearchGroupID: 11 }];

        form.showProjectItemDialog(form, filters, function (projectId, codes) {
            sef.utils.showInputDialog('评审意见', function (review) {
                form.setLoading("Loading...");
                sef.utils.ajax({
                    url: 'Design/SubmitAuditProject',
                    method: 'POST',
                    paramAsJson: true,
                    jsonData: {
                        projectId: projectId,
                        codes: codes,
                        review: review
                    },
                    scope: form,
                    success: function (result) {
                        sef.dialog.success("提交图纸审核成功", 3000);
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
    
    cancelproject__execute: function (btn) {
        var form = this;
        sef.dialog.confirm(_('确认要驳回图纸申请?'), '', function () {
            form.setLoading("Loading...");
            sef.utils.ajax({
                url: 'Project/CancelProject',
                method: 'POST',
                paramAsJson: true,
                jsonData: {
                    projectId: form.recID
                },
                scope: form,
                success: function (result) {
                    sef.dialog.success("驳回成功");
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

    updatefloor__execute: function (btn) {
        var form = this;
        var compform = form.down('sef-complexprojectform');
        var code = compform.selectCode;

        var card = this.down('#card_' + code);

        var floorField = card.down('sef-floorfield');
        var floorCount = 1;
        var nf = card.down('#NF');
        if (nf) {
            floorCount = card.down('#NF').getValue();
        }
        var floorHeight = 3000;
        var dbflr = card.down('#DBFLR');
        if (dbflr) {
            floorHeight = card.down('#DBFLR').getValue();
        }
        var floorStart = 1;
        var bfl = card.down('#BFL');
        if (bfl) {
            floorStart = card.down('#BFL').getValue();
        }
        var floorDoor = "前门无后门无";
        var dbflr = card.down('#FRD');
        if (dbflr) {
            floorDoor = card.down('#FRD').getValue();
        }

        if (floorCount < 1 || floorCount > 50) {
            sef.dialog.error("楼层数可设置范围为(1~50)");
            return;
        }
        if (floorStart == 0) {
            sef.dialog.error("起始楼层不能设置为0");
            return;
        }

        floorField.makeFloors({
            floorCount: floorCount,
            floorHeight: floorHeight,
            floorStart: floorStart,
            floorDoor: floorDoor
        });
    },

    selectlayout__execute: function (btn) {
        var me = this;
        //console.log(me);
        var compform = me.down('sef-complexprojectform');
        var code = compform.selectCode;
        var layoutId = compform.selectNode.LayoutID || 0;
        var dialog = Ext.create('sef.core.components.window.CustomFormLayoutDialog', {
            width: '80%',
            height: '80%',
            layoutId: layoutId,
            useType: 1,
            selectLayout: true,
            companyId: me._rec.get('CompanyID')
        });
        dialog.on('dialogclose', function (state, result) {
            me.saveProjectLayout(result);
        });
        dialog.show();
    },

    loadparam__execute: function (btn) {
        var me = this;
        var projectId = me.recID;
        var compform = me.down('sef-complexprojectform');
        var code = compform.selectCode;

        me.loadparam(me, projectId, code);
    },

    loadblock__execute: function (btn) {
        var me = this;
        var projectId = me.recID;
        var compform = me.down('sef-complexprojectform');
        var code = compform.selectCode;

        me.loadblock(me, projectId, code);
    },

    markdraw__execute: function (btn) {
        var me = this;
        var projectId = me.recID;
        var compform = me.down('sef-complexprojectform');
        var code = compform.selectCode;
        var card = compform.down('#card_' + code);
        var formValues = card.getValues();
        sef.dialog.confirm('确认生成梯号[' + code + ']图纸?', null, function () {
            me.markdraw(me, projectId, code, formValues);
        });
    },

    downdraw__execute: function (btn) {
        var me = this;
        var projectId = me.recID;
        var compform = me.down('sef-complexprojectform');
        var code = compform.selectCode;

        this.downdraw(me, projectId, code);
    },

    onRecordChange: function (rec) {
        this.loadProjectParams();
    },

    saveProjectLayout: function (layoutId) {
        var me = this;
        var compform = me.down('sef-complexprojectform');
        var code = compform.selectCode;
        sef.utils.ajax({
            url: 'Design/SaveDesignLayout',
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
            url: 'Design/LoadProjectParams',
            method: 'POST',
            paramAsJson: true,
            jsonData: {
                projectId: form.recID
            },
            scope: form,
            success: function (result) {
                if (form.timeout) {
                    clearTimeout(form.timeout);
                }
                form.down('#pform').loadData(result, true);
                //var nonstdForms = form.query('sef-nonstdtform');
                //nonstdForms.forEach(function (f) {
                //    f.disabledStepCtl([0, 1]);
                //});
                form.unmask();
            },
            failure: function (err, resp) {
                sef.dialog.error(err.message);
                form.unmask();
                console.log('error', err);
            }
        });
    },

    onBeforeSave: function(data) {
        var vs = this.down('#pform').getValue();
        data.Params = vs;
        //var fs = this.down('#floor').getValue();
        //console.log('before save', vs);
        //return false;//
    },

    onPageReady: function () {
        this.updatePermission({
            submitauditproject: true,
            cancelproject: true,
            selectlayout: true,
            markdraw: true,
            downdraw: true,
            loadparam: true,
            loadblock: true,
        });
    },

    loadparam: function (form, projectId, code) {
        var dialog = Ext.create('sef.core.components.window.EditorGridDialog', {
            rowEditable: true,//true则表示可编辑
            quickSearch: ['ParamDefine.Name', 'ParamDefine.Code'],
            autoSave: true,//默认为true，在行编辑取消后自动保存到数据库
            title: '查看梯号' + code + '参数(不包括界面参数)',
            width: '70%',
            height: '65%',
            store: {
                type: 'sef-store',
                url: '/ProjectParam',
                autoLoad: true,
                model: 'sef.app.liftnext.design.DesignParamModel',
                include: ['ParamDefine', 'ProjectItem'],
                additionFilterFn: function () {
                    return [{ FieldName: 'ProjectID', Values: [projectId], Rel: "And" }, { FieldName: "ParamFrom", Values: [0], Rel: "And", Operator: 9 }, { FieldName: "ProjectItem.Code", Values: [code], Rel: "And", Operator: 5 }, { FieldName: "ProjectItem.IsCurrentVer", Values: [1], Rel: "And", Operator: 5 }];
                }
            },
            columns: [{
                index: 0,
                name: 'Code',
                renderer: function (v, f, p) {
                    if (!p.data.ProjectItem) return "";
                    return p.data.ProjectItem.Code
                },
                width: 70,
                text: '梯号'
            }, {
                index: 1,
                dataIndex: 'ParamName',
                renderer: function (v, f, p) {
                    if (!p.data.ParamDefine) return "";
                    return p.data.ParamDefine.Name
                },
                width: 150,
                text: '参数名称'
            }, {
                index: 2,
                dataIndex: 'ParamCode',
                renderer: function (v, f, p) {
                    if (!p.data.ParamDefine) return "";
                    return p.data.ParamDefine.Code
                },
                text: '参数编号',
                width: 120
            }, {
                index: 4,
                name: 'ParamValue',
                text: '参数值',
                width: 150
            }, {
                index: 5,
                name: 'OldValue',
                text: '历史值',
                width: 150
            }, {
                index: 6,
                name: 'ChangeDesc',
                text: '更改描述',
                width: 180
            }, {
                index: 7,
                name: 'IsLock',
                text: '锁定',
                width: 80,
                renderer: function (v, f, p) {
                    if (p.data.IsLock) return "锁定";
                    return ""
                },
            }],
            colConfig: [{
                name: 'ParamValue',
                editor: {
                    xtype: 'textfield',
                    allowBlank: false
                }
            }, {
                name: 'IsLock',
                editor: {
                    xtype: 'checkbox',
                    allowBlank: false,
                    inputValue: 1,
                    uncheckedValue: 0
                }
            }, {
                name: 'ParamForm',
                hidden: true
            }, {
                name: 'ParamDefine',
                hidden: true
            }]
        });
        dialog.on('dialogclose', function (state, result) {
            //console.log('export dialog will close#', state, result);
            //debugger
            form.applyParamChangeResult(form, dialog.rowEditResult);
            //form.loadProjectParams();
            this.updateLayout();
        }, this);
        dialog.show();
    },

    loadblock: function (form, projectId, code) {
        var dialog = Ext.create('sef.core.components.window.EditorGridDialog', {
            rowEditable: false,//true则表示可编辑
            quickSearch: ['BlockName', 'BlockCode'],
            autoSave: false,//默认为true，在行编辑取消后自动保存到数据库
            title: '查看梯号' + code + '块',
            width: '70%',
            height: '65%',
            store: {
                type: 'sef-store',
                url: '/ProjectBlock',
                autoLoad: true,
                include: ['ProjectItem'],
                model: 'sef.app.liftnext.design.DesignBlockModel',
                additionFilterFn: function () {
                    return [{ FieldName: 'ProjectID', Values: [projectId], Rel: "And" }, { FieldName: "ProjectItem.Code", Values: [code], Rel: "And", Operator: 5 }];
                }
            },
            colConfig: [{
                index: 0,
                name: 'Code',
                renderer: function (v, f, p) {
                    if (!p.data.ProjectItem) return "";
                    return p.data.ProjectItem.Code
                },
                width: 80,
                text: '梯号'
            }, {
                name: 'BlockGroup',
                width: 180
            }, {
                name: 'BlockName',
                width: 180
            }, {
                name: 'BlockCode',
                width: 160
            }, {
                name: 'InsertPointX',
                width: 160,
                renderer: function (v, f, g) {
                    if (!g.data) return "N/A";
                    return g.data.InsertPointX + ',' + g.data.InsertPointY;
                }
            }, {
                name: 'ExInsertPointX',
                width: 160,
                renderer: function (v, f, g) {
                    if (!g.data) return "N/A";
                    if (!g.data.ExInsertPointX || !g.data.ExInsertPointY) return "N/A";
                    return g.data.ExInsertPointX + ',' + g.data.ExInsertPointY;
                }
            }]
        });
        dialog.show();
    },

    markdraw: function (form, projectId, code, formValues) {
        form.setLoading("Loading...");
        sef.utils.ajax({
            url: 'Design/CreateCadDrawingTask',
            method: 'POST',
            paramAsJson: true,
            jsonData: {
                projectId: projectId,
                code: code,
                values: formValues
            },
            scope: form,
            success: function (result) {
                if (result && result.length > 0) {
                    sef.dialog.error({
                        list: result
                    });
                } else {
                    sef.message.success("已成功加入任务队列,请停留在当前界面等待图纸生成完成", 3000);
                    form.getDrawResult(form, projectId, code);
                }
                form.setLoading(false);
            },
            failure: function (err, resp) {
                sef.dialog.error(err.message);
                form.setLoading(false);
                console.log('error', err);
            }
        });
    },

    downdraw: function (form, projectId, code) {
        form.setLoading("Loading...");
        sef.utils.ajax({
            url: 'Design/DownloadDrawingFile',
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

    uploaddraw: function (form, projectId, code) {
        var dialog = Ext.create('sef.core.components.uploader.UploadDialog', {
            dialogTitle : '请上传[dwg]格式文件',
            uploadParams: {
                projectId: projectId,
                code:code
            },
            uploadUrl: '/Design/UploadDrawingFile'
        });
        dialog.on('uploadcomplete', function (up, mgr, uploadedItems, err, errMsg) {
            if (errMsg) {
                sef.dialog.error(errMsg);
            } else {
                sef.message.success("已成功加入任务队列,请停留在当前界面等待图纸上传完成", 3000);
                form.getDrawResult(form, projectId, code);
            }
            dialog.close();
        });
        dialog.show();
    },

    getDrawResult: function (form, projectId, code) {
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
                    form.timeout = setTimeout(function () { return form.getDrawResult(form, projectId, code); }, "2000")
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

    applyParamChangeResult: function (form, result) {
        if (result && result.Values) {
            //form.getForm().setValues(result.Values);
            result.Params.forEach(function (f) {
                var field = form.getForm().findField(f);
                if (field) {
                    //console.log(field.name, 'before', field._oldValue, field.getValue());
                    var val = result.Values[f];
                    field.setValue(val);
                    //console.log(field._oldValue, field.getValue())
                    if (field._oldValue != field.getValue()) {
                        field.setFieldStyle("color:#000;font-weight:bold");
                    } else {
                        field.setFieldStyle("color:rgba(0, 0, 0, 0.7);font-weight:400");
                    }
                    field._oldValue = val;
                    //console.log(field.name, 'after', field._oldValue, field.getValue());
                }
            });
        }
        if (result && result.Msgs && result.Msgs.length > 0) {
            sef.dialog.info({
                list: result.Msgs
            });
        }
    },

    items: [{
            xtype: 'sef-complexprojectform',
            itemId: 'pform',
            columnWidth: 1,
            margin: 0,
            bodyPadding: 5,
            apiController: 'Design',
            enableContextMenu: true,
            contextMenuType: 'design',
            onTreeNodeClick: function (me, rec, code) {
                var form = this.up('sef-designform');
                projectId = form.recID;
                if (projectId > 0) {
                    form.getDrawResult(form, projectId, code);
                };
            },
            onLoadParam: function (me, id, code) {
                var form = me.up('sef-designform');
                var projectId = form.recID;

                form.loadparam(form, projectId, code);
            },
            onLoadBlock: function (me, id, code) {
                var form = me.up('sef-designform');
                var projectId = form.recID;

                form.loadblock(form, projectId, code);
            },
            onCalcParam: function (me, id, code) {
                var form = me.up('sef-designform');
                var projectId = form.recID;

                form.setLoading("Loading...");
                sef.utils.ajax({
                    url: 'Design/CalcDesignParams',
                    method: 'POST',
                    paramAsJson: true,
                    jsonData: {
                        projectId: projectId,
                        code: code
                    },
                    scope: form,
                    success: function (result) {
                        //console.log(result);
                        if (result && result.length > 0) {
                            sef.dialog.error({
                                list: result
                            });
                        } else {
                            sef.message.success("计算成功", 3000);
                        }
                        form.setLoading(false);
                        form.loadRecordById(form.recID);
                    },
                    failure: function (err, resp) {
                        sef.dialog.error(err.message);
                        form.setLoading(false);
                        console.log('error', err);
                    }
                });
            },
            onNonstdParam: function (me, id, code) {
                var form = me.up('sef-designform');
                var projectId = form.recID;

                form.setLoading("Loading...");
                sef.utils.ajax({
                    url: 'Design/CalcParamNonstds',
                    method: 'POST',
                    paramAsJson: true,
                    jsonData: {
                        projectId: projectId,
                        code: code
                    },
                    scope: form,
                    success: function (result) {
                        //console.log(result)
                        var msg = [];
                        if (result.ErrorMsg && result.ErrorMsg.length > 0) {
                            msg.push("【错误信息】:");
                            result.ErrorMsg.forEach(function (f) {
                                msg.push(f);
                            });
                        }
                        if (result.NonstdMsg && result.NonstdMsg.length > 0) {
                            msg.push("【参数非标】:");
                            result.NonstdMsg.forEach(function (f) {
                                msg.push(f);
                            });
                        }
                        else {
                            msg.push("无非标内容");
                        }
                        sef.dialog.info({
                            list: msg
                        });
                        form.setLoading(false);
                    },
                    failure: function (err, resp) {
                        sef.dialog.error(err.message);
                        console.log('error', err);
                        form.setLoading(false);
                    }
                });
            },
            onValidParam: function (me, id, code) {
                var form = me.up('sef-designform');
                var projectId = form.recID;

                form.setLoading("Loading...");
                sef.utils.ajax({
                    url: 'Design/CalcParamValids',
                    method: 'POST',
                    paramAsJson: true,
                    jsonData: {
                        projectId: projectId,
                        code: code
                    },
                    scope: form,
                    success: function (result) {
                        var msg = [];
                        if (result.ErrorMsg && result.ErrorMsg.length > 0) {
                            msg.push("【错误信息】:");
                            result.ErrorMsg.forEach(function (f) {
                                msg.push(f);
                            });
                        }

                        if (result.ValidMsg && result.ValidMsg.length > 0) {
                            msg.push("【参数校验】:");
                            result.ValidMsg.forEach(function (f) {
                                msg.push(f);
                            });
                        }
                        else {
                            msg.push("无校验内容");
                        }
                        sef.dialog.info({
                            list: msg
                        });
                        form.setLoading(false);
                    },
                    failure: function (err, resp) {
                        sef.dialog.error(err.message);
                        console.log('error', err);
                        form.setLoading(false);
                    }
                });
            },
            onMarkDraw: function (me, id, code) {
                var form = me.up('sef-designform');
                var projectId = form.recID;

                var compform = form.down('sef-complexprojectform');
                var card = compform.down('#card_' + code);

                var formValues = card.getValues();
                form.markdraw(form, projectId, code, formValues);
            },
            onDownDraw: function (me, id, code) {
                var form = me.up('sef-designform');
                var projectId = form.recID;

                form.downdraw(form, projectId, code);
            },
            onUploadDraw: function (me, id, code) {
                var form = me.up('sef-designform');
                var projectId = form.recID;

                form.uploaddraw(form, projectId, code);
            },
            onReDesign: function (me, id, code) {
                var form = me.up('sef-designform');
                var projectId = form.recID;

                if (!code) {
                    var dialog = Ext.create('sef.core.components.window.EditorGridDialog', {
                        rowEditable: false,//true则表示可编辑
                        quickSearch: ['Code'],
                        autoSave: false,//默认为true，在行编辑取消后自动保存到数据库
                        width: '60%',
                        height: '65%',
                        singleSelection: false,
                        store: {
                            type: 'sef-store',
                            url: '/ProjectItem',
                            autoLoad: true,
                            include: ['Project'],
                            model: 'sef.app.liftnext.design.DesignItemModel',
                            additionFilterFn: function () {
                                return [{ FieldName: 'ProjectID', Values: [form.recID], Rel: "And" }];
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
                        }]
                    });
                    dialog.on('dialogclose', function (state, result) {
                        if (result.Result && result.Result.length > 0) {
                            var codes = [];
                            result.Result.forEach(function (f) {
                                codes.push(f.get('Code'));
                            })
                            me.redesign(me, form, projectId, codes);
                        }
                        this.updateLayout();
                    }, this);
                    dialog.show();
                }
                else
                {
                    me.redesign(me, form, projectId, [code]);
                }
            },
            redesign: function (me, form, projectId, codes) {
                form.setLoading("Loading...");
                sef.utils.ajax({
                    url: 'Design/ReDesignProject',
                    method: 'POST',
                    paramAsJson: true,
                    jsonData: {
                        projectId: projectId,
                        codes: codes
                    },
                    scope: form,
                    success: function (result) {
                        sef.dialog.success("土建图重新设计成功.");
                        form.down('#pform').loadData(result, true);
                        form.setLoading(false);
                        dialog.close();
                    },
                    failure: function (err, resp) {
                        sef.dialog.error(err.message);
                        form.setLoading(false);
                        console.log('error', err);
                    }
                });
            },
            onHistory: function (me, id, code) {
                var form = me.up('sef-designform');
                var dialog = Ext.create('sef.core.components.window.EditorGridDialog', {
                    rowEditable: false,//true则表示可编辑
                    quickSearch: ['Code'],
                    autoSave: false,//默认为true，在行编辑取消后自动保存到数据库
                    width: '70%',
                    height: '70%',
                    singleSelection: true,
                    okText: '查看参数',
                    title : '历史版本查看(请先选择版本号数据再查看参数)',
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
                var pform = form.up('sef-designform');
                var projectId = pform.recID;
                sef.utils.ajax({
                    url: 'Design/CalcRelationParam',
                    method: 'POST',
                    paramAsJson: true,
                    jsonData: {
                        projectId: projectId,
                        code: code,
                        param: me.name,
                        value: me.getValue(),
                        oldvalue: me._oldValue,
                        formValues: form.getForm().getValues(),
                        onlySaveSelf : false
                    },
                    scope: form,
                    success: function (result) {
                        pform.setStamp(null);
                        pform.applyParamChangeResult(form, result);
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
        }
    ]
});