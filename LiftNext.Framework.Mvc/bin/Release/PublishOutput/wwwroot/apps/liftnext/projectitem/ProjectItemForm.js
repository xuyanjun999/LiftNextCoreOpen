//UserForm

Ext.define('sef.app.liftnext.projectitem.ProjectItemForm', {
    extend: 'sef.core.components.page.FormPage',
    xtype: 'sef-projectitemform',
    layout: 'fit',
    focusModifingField: 'AutoModifyFiled',
    editMode: false,
    bars: [],

    onPageReady: function() {
        this.updatePermission({
        });
    },

    onRecordChange: function (rec) {
        var form = this;
        //console.log('form.recID', form.recID, rec);
        sef.utils.ajax({
            url: 'ProjectItem/LoadProjectParams',
            method: 'POST',
            paramAsJson: true,
            jsonData: {
                projectItemId: rec.get('ID'),
            },
            scope: form,
            success: function (result) {
                form.down('#pform').loadData(result, true);
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
        itemId: 'pform',
        columnWidth: 1,
        margin: '10px 0 0 0',
        contextMenuType: 'default',
        enableContextMenu: false,
        onTreeNodeClick: function (me, rec, code) {
            var form = this.up('sef-projectitemform');
            var projectId = rec.get('Node').ProjectID;
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
        }
    }]
});