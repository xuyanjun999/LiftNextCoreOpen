//UserList
Ext.define('sef.app.liftnext.projectitem.ProjectItemList', {
    extend: 'sef.core.components.page.ListPage',
    xtype: 'sef-projectitemlist',
    columns: [{
        index: 0,
        name: 'Code',
        width: 80,
        text:'梯号'
    }, {
        index :1,
        name: 'DrawingNo',
        width: 140,
        text:'图纸编号'
    }, {
        index:2,
        dataIndex: 'ProjectName',
        renderer: function (v, f, p) {
            if (!p.data.Project) return "N/A";
            return p.data.Project.ProjectName
        },
        text:'项目名称',
        width: 180
    }, {
        index:3,
        dataIndex: 'Company',
        renderer: function (v, f, p) {
            if (!p.data.Project) return "N/A";
            return p.data.Project.Company.Name
        },
        text: '公司名称',
        width: 150
    }, {
        index:4,
        dataIndex: 'CustomerName',
        renderer: function (v, f, p) {
            if (!p.data.Project) return "N/A";
            return p.data.Project.CustomerName
        },
        text:'客户名称',
        width: 150
    },{
        index: 7,
        dataIndex: 'ProjectStatus',
        renderer: function (v, f, p) {
            if (!p.data.Project) return "N/A";

            var enumName = 'SEF.Core.Common.ProjectStatusEnum';
            enumName = enumName.replace(/\./g, '_');

            var data = window.sef_static_data[enumName];
            var tv = '';

            //console.log('#####>',enumType,v);
            data.forEach(function (dv) {
                if (dv.Value === p.data.Project.ProjectStatus) {
                    tv = dv.Text;
                    return false;
                }
            });
            return tv;
        },
        text: '任务状态',
        width: 100
    }, {
        index:10,
        name: 'Model',
        width: 120,
        text: '梯型'
    }, {
        index: 11,
        name: 'VerUser',
        text: '创建用户'
    }, {
        index: 12,
        name: 'VerDate',
        text: _('创建日期'),
        type: 'date',
        renderer: sef.utils.dateRenderer,
        width: 120
    }, {
        index: 13,
        name: 'VerNo',
        text: _('版本号')
    }, {
        index: 14,
        dataIndex: 'Output',
        renderer: function (v, f, p) {
            if (!p.data.Output) return "N/A";
            return p.data.Output
        },
        text: _('图纸文件')
    }],
    searchConfig: {
        quickSearch: ['DrawingNo']
    },
    bars: [
        sef.runningCfg.BUTTONS.EXPORT,
        {
            text: '下载图纸',
            xtype: 'sef-actionbutton',
            dataAction:true,
            actionName: 'downdraw'
        }
    ],

    onPageReady: function () {
        this.updatePermission({
            downdraw: true
        });
    },


    tree: {
        //此属性用于控制是否显示checkhbox
        //enableCheck:true,
        xtype: 'sef-pagetree',

        title: '土建图项目',
        //用于加载树的url
        url: '/ProjectItem/GetTree'
    },

    onTreeItemClick: function (tree, record) {
        var level = record.get('Level');
        var query = {};
        if (level == 1) {
            var date = new Date(record.get('Data'));
            var start = Ext.util.Format.date(date, 'Y/m/d')
            query = {
                FieldName: 'Project.CreateDate', Values: [start], Operator: '==', Rel: 'And'
            };
        } else if (level == 2) {
            var id = record.get('PID');
            query = {
                FieldName: 'ProjectID', Values: [id], Operator: '==', Rel: 'And'
            };
        } else if (level == 3) {
            var id = record.get('ID');
            query = {
                FieldName: 'ID', Values: [id], Operator: '==', Rel: 'And'
            };
        } else if (level == 4) {
            var id = record.get('ID');
            query = {
                FieldName: 'ID', Values: [id], Operator: '==', Rel: 'And'
            };
        }
        tree.up('sef-projectitem').down('sef-projectitemlist').getStore().makeQuerys(query);
    },

    downdraw__execute: function (btn) {
        var me = this;
        var selected = this.getSelection();
        if (selected && selected.length > 1) {
            sef.dialog.error("请选择一个图纸进行下载操作.");
            return;
        }
        var projectId = selected[0].get('ProjectID');
        var code = selected[0].get('Code');
        sef.dialog.confirm(_('确认要下载图纸?'), '', function () {
            //form.setLoading("Loading...");
            sef.utils.ajax({
                url: 'ProjectItem/DownloadDrawingFile',
                method: 'POST',
                paramAsJson: true,
                jsonData: {
                    projectId: projectId,
                    code: code
                },
                scope: me,
                success: function (result) {
                    if (result.Output) {
                        window.open('Download/DownloadFile?url=' + result.Output);
                    } else {

                    }
                },
                failure: function (err, resp) {
                    sef.dialog.error(err.message);
                    console.log('error', err);
                }
            });
        });
    }
});