//UserList
Ext.define('sef.app.liftnext.design.DesignList', {
    extend: 'sef.core.components.page.ListPage',
    xtype: 'sef-designlist',
    colConfig: [{
        name: 'DrawingNo',
        width: 140,
        renderer: function (v, f, g) {
            if (v.indexOf('A') < 0) {
                return "<span class='fa fa-exclamation-circle' title='New Version'>&nbsp;" + v + "</span>";
            }
            return v;
        }
    }, {
        name: 'ProjectName',
        width: 150
    }, {
        name: 'Company',
        renderer: sef.utils.relRenderer('Name'),
        width: 120
    }, {
        name: 'DesignUser',
        renderer: sef.utils.relRenderer('Name'),
        width: 90
    }, {
        name: 'CustomerName',
        width: 150
    }, {
        name: 'ContractNo',
        hidden: true
    }, {
        name: 'AutoModifyFiled',
        hidden: true
    }, {
        name: 'ProjectParams',
        hidden: true
    }],
    //columns:['code'],
    searchConfig: {
        quickSearch: ['DrawingNo', 'ProjectName'],
        advSearch: ['DrawingNo', 'ProjectName']
    },
    bars: [
        sef.runningCfg.BUTTONS.EDIT,
        {
            text: '指派',
            xtype: 'sef-actionbutton',
            dataAction:true,
            actionName: 'assign'
        },
        sef.runningCfg.BUTTONS.EXPORT
    ],

    onPageReady: function () {
        //console.log('formpage will on ready');
        //此方法用于更新权限信息
        //roles为子表名称，若不加则为主表的行为
        this.updatePermission({
            assign: true
        });
    },

    assign__execute: function (btn) {
        var me = this;
        var selected = me.getSelection();
        var companyId = null;
        selected.forEach(function (f) {
            var cId = f.get('CompanyID');
            if (companyId && companyId != cId) {
                sef.dialog.error("请选择相同所属公司的数据进行指派操作.");
                companyId = null;
                return;
            }
            companyId = cId;
        });

        if (!companyId) return;
        var projectIds = me.getSelectionIDs();

        var dialog = Ext.create('sef.core.components.window.EditorGridDialog', {
            rowEditable: false,//true则表示可编辑
            quickSearch: ['Code', 'Name'],
            autoSave: true,//默认为true，在行编辑取消后自动保存到数据库
            width: '60%',
            height: '65%',
            store: {
                type: 'sef-store',
                url: '/User',
                autoLoad: true,
                model: 'sef.app.liftnext.system.user.UserModel',
                additionFilterFn: function () {
                    return [{ FieldName: 'CompanyID', Values: [companyId], Rel: "And" }];
                }
            },
            columns: [{
                index: 0,
                name: 'Code',
                width: 80,
                text: '编号'
            }, {
                index: 1,
                name: 'Name',
                width: 180,
                text: '名称'
            }, {
                index: 2,
                name: 'Dept',
                text: '部门',
                width: 150
            }, {
                index: 3,
                name: 'Email',
                text: '邮箱',
                width: 100
            }, {
                index: 4,
                name: 'Phone',
                text: '电话',
                width: 100
            } ],
            colConfig: [{
                name: 'ParamForm',
                hidden: true
            }, {
                name: 'ParamDefine',
                hidden: true
            }]
        });
        dialog.on('dialogclose', function (state, result) {
            if (result.Result && result.Result.length > 0) {
                var userId = result.Result[0].get('ID');

                sef.utils.ajax({
                    url: 'Design/AssignUser',
                    method: 'POST',
                    paramAsJson: true,
                    jsonData: {
                        projectIds: projectIds,
                        userId: userId
                    },
                    scope: me,
                    success: function (result) {
                        dialog.close();
                        me.getStore().reload();
                        sef.message.success("指派成功.", 3000);
                    },
                    failure: function (err, resp) {
                        sef.dialog.error(err.message);
                        me.setLoading(false);
                        console.log('error', err);
                    }
                });
            }
            this.updateLayout();
        }, this);
        dialog.show();
    }
});