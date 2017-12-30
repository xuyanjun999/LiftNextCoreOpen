//UserForm

Ext.define('sef.app.liftnext.kbmreview.ReviewForm', {
    extend: 'sef.core.components.page.FormPage',
    xtype: 'sef-kbmreviewform',
    layout: 'fit',
    bars: [{
        text: '下载图纸',
        xtype: 'sef-actionbutton',
        actionName: 'downdraw'
    },{
            text: '通过评审',
            xtype: 'sef-actionbutton',
            actionName: 'submitreview'
        }, {
            text: '驳回评审',
            xtype: 'sef-actionbutton',
            actionName: 'rejectreview'
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

    submitreview__execute: function (btn) {
        var form = this;
        var filters = [{ FieldName: 'ProjectID', Values: [form.recID], Rel: "And" }, { FieldName: 'ReviewStatus', Values: [90], Rel: "And" }, { FieldName: "IsCurrentVer", Values: [1], Rel: "And", Operator: 5 }];
        form.showProjectItemDialog(form, filters, function (projectId, codes) {
            sef.utils.showInputDialog('评审意见', function (review) {
                form.setLoading("Loading...");
                sef.utils.ajax({
                    url: 'KbmReview/SubmitKbmReview',
                    method: 'POST',
                    paramAsJson: true,
                    jsonData: {
                        projectId: form.recID,
                        codes: codes,
                        review: review
                    },
                    scope: form,
                    success: function (result) {
                        sef.dialog.success("评审通过");
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
    rejectreview__execute: function (btn) {
        var form = this;
        var filters = [{ FieldName: 'ProjectID', Values: [form.recID], Rel: "And" }, { FieldName: 'ReviewStatus', Values: [90], Rel: "And" }, { FieldName: "IsCurrentVer", Values: [1], Rel: "And", Operator: 5 }];
        form.showProjectItemDialog(form, filters, function (projectId, codes) {
            sef.utils.showInputDialog('驳回意见', function (review) {
                form.setLoading("Loading...");
                sef.utils.ajax({
                    url: 'KbmReview/RejectKbmReview',
                    method: 'POST',
                    paramAsJson: true,
                    jsonData: {
                        projectId: form.recID,
                        codes: codes,
                        review: review
                    },
                    scope: form,
                    success: function (result) {
                        sef.dialog.success("评审通过");
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
    onPageReady: function () {
        this.updatePermission({
            submitreview: true,
            rejectreview: true,
            downdraw:true
        });
    },

    onRecordChange: function (rec) {
        var form = this;
        //console.log('form.recID', form.recID, rec);
        sef.utils.ajax({
            url: 'KbmReview/LoadProjectParams',
            method: 'POST',
            paramAsJson: true,
            jsonData: {
                projectId: form.recID
            },
            scope: form,
            success: function (result) {
                //console.log('...result', result);
                form.down('#pform').loadData(result, true);
                var nonstdForms = form.query('sef-nonstdtform');
                nonstdForms.forEach(function (f) {
                    f.disabledStepCtl([0, 0, 0, 1]);
                });
            },
            failure: function (err, resp) {
                sef.dialog.error(err.message);
                form.setLoading(false);
                console.log('error', err);
            }
        });
    },

    items: [{
        xtype: 'sef-complexprojectform',
        navTreeCommonNodeText: '项目信息',
        itemId: 'pform',
        columnWidth: 1,
        navTreeUrl: '',
        margin: 0,
        enableContextMenu: false,
        commonFormCollapsed: true,
        apiController: 'KbmReview',
        bodyPadding: '10px 10px 0 0'
    }]
});