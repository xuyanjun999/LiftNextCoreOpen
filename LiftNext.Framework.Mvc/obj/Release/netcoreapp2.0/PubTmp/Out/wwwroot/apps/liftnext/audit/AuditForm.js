//UserForm

Ext.define('sef.app.liftnext.audit.AuditForm', {
    extend: 'sef.core.components.page.FormPage',
    xtype: 'sef-auditform',
    layout: 'fit',
    focusModifingField: 'AutoModifyFiled',
    bars: [
         {
            text: '查看参数',
            xtype: 'sef-actionbutton',
            actionName:'loadcalcparam'
        }, {
            text: '查看块',
            xtype: 'sef-actionbutton',
            actionName: 'loadcalcblock'
         }, {
             text: '查看非标',
            xtype: 'sef-actionbutton',
            actionName: 'loadnonstd'
         }, {
             text: '查看校验',
             xtype: 'sef-actionbutton',
             actionName: 'loadvalid'
         },{
            text:'下载图纸',
            xtype:'sef-actionbutton',
            actionName:'downdraw'
        },
        {
            text: '审核通过',
            xtype: 'sef-actionbutton',
            actionName: 'auditproject'
        },
        {
            text: '审核驳回',
            xtype: 'sef-actionbutton',
            actionName: 'rejectproject'
        },
        {
            text: '撤销审核',
            xtype: 'sef-actionbutton',
            actionName: 'cancelproject'
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

    showInputDialog: function (title, action) {
        var dialog = Ext.create('sef.core.components.window.BaseDialog', {
            width: '500px',
            height: '250px',
            title: '请输入' + title + '(不可为空)',
            xtype: 'sef-formpanel',
            //layout: 'fit',
            layout:'column',
            defatuls: {
                margin: '0 0px 0px 0px',
                xtype: 'textfield',
                labelAlign: 'right',
                labelSeparator: ''
            },
            items: [ {
                xtype: 'textarea',
                itemId: 'InputValue',
                columnWidth: 1,
                height:120
            }, {
                xtype: 'checkbox',
                itemId: 'IsDeptReview',
                fieldLabel: '是否跨部门评审',
                columnWidth:1
            }]
        });
        dialog.on('willclosedialog', function (state, result) {
            var review = dialog.down('#InputValue').getValue();
            if (review === "") {
                sef.dialog.error("请输入" + title);
                return false;
            }
            var isDeptReview = dialog.down('#IsDeptReview').getValue();
            action(review, isDeptReview);
            return true;
            this.updateLayout();
        }, this);
        dialog.show();
    },

    auditproject__execute: function (btn) {
        var form = this;

        var filters = [{ FieldName: 'ProjectID', Values: [form.recID], Rel: "And", SearchGroupID: 10 }, { FieldName: "IsCurrentVer", Values: [1], Rel: "And", Operator: 5, SearchGroupID: 10 }, { FieldName: 'ProjectStatus', Values: [20], Rel: "And", SearchGroupID: 11 }, { FieldName: 'ReviewStatus', Values: [20], Rel: "Or", SearchGroupID: 11 }];
        form.showProjectItemDialog(form, filters, function (projectId, codes) {
            form.showInputDialog('评审意见', function (review, isDeptReview) {
                form.setLoading("Loading...");
                sef.utils.ajax({
                    url: 'Audit/PassAuditProject',
                    method: 'POST',
                    paramAsJson: true,
                    jsonData: {
                        projectId: projectId,
                        codes: codes,
                        review: review,
                        isdeptreview: isDeptReview
                    },
                    scope: form,
                    success: function (result) {
                        sef.dialog.success("图纸审核通过", 3000);
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
        var filters = [{ FieldName: 'ProjectID', Values: [form.recID], Rel: "And" }, { FieldName: 'ProjectStatus', Values: [90], Rel: "And" }, { FieldName: "IsCurrentVer", Values: [1], Rel: "And", Operator: 5 }];
        form.showProjectItemDialog(form, filters, function (projectId, codes) {
            sef.utils.showInputDialog('撤销意见', function (review) {
                form.setLoading("Loading...");
                sef.utils.ajax({
                    url: 'Audit/CancelPassAuditProject',
                    method: 'POST',
                    paramAsJson: true,
                    jsonData: {
                        projectId: projectId,
                        codes: codes,
                        review: review
                    },
                    scope: form,
                    success: function (result) {
                        sef.dialog.success("撤销图纸审核成功", 3000);
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

    rejectproject__execute: function (btn) {
        var form = this;
        var filters = [{ FieldName: 'ProjectID', Values: [form.recID], Rel: "And", SearchGroupID: 10 }, { FieldName: "IsCurrentVer", Values: [1], Rel: "And", Operator: 5, SearchGroupID: 10 }, { FieldName: 'ProjectStatus', Values: [20], Rel: "And", SearchGroupID: 11 }, { FieldName: 'ReviewStatus', Values: [20], Rel: "Or", SearchGroupID: 11 }];
        form.showProjectItemDialog(form, filters, function (projectId, codes) {
            sef.utils.showInputDialog('驳回意见', function (review) {
                form.setLoading("Loading...");
                sef.utils.ajax({
                    url: 'Audit/RejectAuditProject',
                    method: 'POST',
                    paramAsJson: true,
                    jsonData: {
                        projectId: projectId,
                        codes: codes,
                        review: review
                    },
                    scope: form,
                    success: function (result) {
                        sef.dialog.success("驳回图纸审核成功");
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

    loadcalcparam__execute: function (btn) {
        var me = this;
        var compform = me.down('sef-complexprojectform');
        var code = compform.selectCode;
        var dialog = Ext.create('sef.core.components.window.EditorGridDialog', {
            rowEditable: false,//true则表示可编辑
            quickSearch: ['ParamDefine.Name', 'ParamDefine.Code'],
            autoSave: true,//默认为true，在行编辑取消后自动保存到数据库
            width: '60%',
            height : '65%',
            store: {
                type: 'sef-store',
                url: '/ProjectParam',
                autoLoad: true,
                model: 'sef.app.liftnext.design.DesignParamModel',
                include: ['ParamDefine', 'ProjectItem'],
                additionFilterFn: function () {
                    return [{ FieldName: 'ProjectID', Values: [me.recID], Rel: "And" }, { FieldName: "ParamFrom", Values: [0], Rel: "And", Operator: 9 }, { FieldName: "ProjectItem.Code", Values: [code], Rel: "And", Operator: 5 }, { FieldName: "ProjectItem.IsCurrentVer", Values: [1], Rel: "And", Operator: 5 }];
                }
            },
            columns: [{
                index: 0,
                name: 'Code',
                renderer: function (v, f, p) {
                    if (!p.data.ProjectItem) return "";
                    return p.data.ProjectItem.Code
                },
                width: 80,
                text: '梯号'
            }, {
                index: 1,
                dataIndex: 'ParamName',
                renderer: function (v, f, p) {
                    if (!p.data.ParamDefine) return "";
                    return p.data.ParamDefine.Name
                },
                width: 180,
                text: '参数名称'
            }, {
                index: 2,
                dataIndex: 'ParamCode',
                renderer: function (v, f, p) {
                    if (!p.data.ParamDefine) return "";
                    return p.data.ParamDefine.Code
                },
                text: '参数编号',
                width: 180
            }, {
                index: 3,
                name: 'ParamValue',
                text: '参数值',
                width: 200
            }, {
                index: 4,
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
                        uncheckedValue : 0
                    }
            }, {
                name: 'ParamForm',
                hidden:true
            }, {
                name: 'ParamDefine',
                hidden: true
            }]
        });
        dialog.show();
    },

    loadcalcblock__execute: function (btn) {
        var me = this;
        var compform = me.down('sef-complexprojectform');
        var code = compform.selectCode;
        var dialog = Ext.create('sef.core.components.window.EditorGridDialog', {
            rowEditable: false,//true则表示可编辑
            quickSearch: ['BlockName', 'BlockCode'],
            autoSave: false,//默认为true，在行编辑取消后自动保存到数据库
            width: '60%',
            height: '65%',
            store: {
                type: 'sef-store',
                url: '/ProjectBlock',
                autoLoad: true,
                include: ['ProjectItem'],
                model: 'sef.app.liftnext.design.DesignBlockModel',
                additionFilterFn: function () {
                    return [{ FieldName: 'ProjectID', Values: [me.recID], Rel: "And" }, { FieldName: "ProjectItem.Code", Values: [code], Rel: "And", Operator: 5 }];
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
            },{
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
            }]
        });
        dialog.show();
    },

    loadnonstd__execute: function (btn) {
        var form = this;
        var compform = form.down('sef-complexprojectform');
        var code = compform.selectCode;
        sef.utils.ajax({
            url: 'Audit/GetProjectItemNonstdMsg',
            method: 'POST',
            paramAsJson: true,
            jsonData: {
                projectId: form.recID,
                code: code
            },
            scope: form,
            success: function (result) {
                var msg = [];
                if (result && result.length > 0) {
                    msg = result;
                }
                else {
                    msg.push("无非标内容");
                }
                sef.dialog.info({
                    list: msg
                });
            },
            failure: function (err, resp) {
                sef.dialog.error(err.message);
                console.log('error', err);
            }
        });
    },

    loadvalid__execute: function (btn) {
        var form = this;
        var compform = form.down('sef-complexprojectform');
        var code = compform.selectCode;
        sef.utils.ajax({
            url: 'Audit/GetProjectItemValidMsg',
            method: 'POST',
            paramAsJson: true,
            jsonData: {
                projectId: form.recID,
                code: code
            },
            scope: form,
            success: function (result) {
                var msg = [];
                if (result && result.length > 0) {
                    msg = result;
                }
                else {
                    msg.push("无校验内容");
                }
                sef.dialog.info({
                    list: msg
                });
            },
            failure: function (err, resp) {
                sef.dialog.error(err.message);
                console.log('error', err);
            }
        });
    },

    downdraw__execute: function (btn) {
        var form = this;
        var compform = form.down('sef-complexprojectform');
        var code = compform.selectCode;
        sef.dialog.confirm(_('确认要下载图纸?'), '', function () {
            form.setLoading("Loading...");
            sef.utils.ajax({
                url: 'Design/DownloadDrawingFile',
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

    onPageReady: function() {
        //console.log('formpage will on ready');
        //此方法用于更新权限信息
        //roles为子表名称，若不加则为主表的行为
        this.updatePermission({
            loadcalcparam: true,
            loadcalcblock: true,
            downdraw: true,
            auditproject: true,
            rejectproject: true,
            cancelproject:true,
            loadnonstd: true,
            loadvalid: true,
            submitnonstad:true
        });
    },

    onRecordChange: function (rec) {
        var me = this;
        if (rec != null) {
            var form = this;
            form.mask();
            sef.utils.ajax({
                url: 'Audit/LoadProjectParams',
                method: 'POST',
                paramAsJson: true,
                jsonData: {
                    projectId: form.recID
                },
                scope: form,
                success: function (result) {
                    form.down('#pform').loadData(result, true);
                    var nonstdForms = form.query('sef-nonstdtform');
                    nonstdForms.forEach(function (f) {
                        f.disabledStepCtl([0, 0, 1]);
                    });
                    form.unmask();
                },
                failure: function (err, resp) {
                    sef.dialog.error(err.message);
                    form.unmask();
                    console.log('error', err);
                }
            });
        }
    },

    onBeforeSave: function(data) {
        
    },

    items: [{
            xtype: 'sef-complexprojectform',
            itemId: 'pform',
            columnWidth: 1,
            margin: '10px 0 0 0',
            apiController : 'Audit',
            enableContextMenu:false,
            onTreeNodeClick: function (me, rec, code) {
                var form = this.up('sef-auditform');
                var projectId = form.recID;
                if (projectId > 0) {
                    this.getDrawResult(this, form, projectId, code);
                }
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
                        }else {
                            form.setStampMessage(null);
                            form.setStamp('');
                        }
                    },
                    failure: function (err, resp) {
                        sef.dialog.error(err.message);
                        console.log('error', err);
                    }
                });
            }
        }
    ]
});