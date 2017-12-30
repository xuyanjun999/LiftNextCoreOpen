//UserList
Ext.define('sef.app.liftnext.system.block.BlockList', {
    extend: 'sef.core.components.page.ListPage',
    xtype: 'sef-blocklist',
    colConfig: [{
            name:'Thumbnail',
            hidden:true
        },  {
            name: 'BlockParams',
            hidden: true
        }],
    //columns: [],
    searchConfig: {
        quickSearch: ['Code', 'Name'],
        advSearch: ['Code', 'Name','CreateDate'],
    },
    bars: [sef.runningCfg.BUTTONS.CREATE,
        sef.runningCfg.BUTTONS.EDIT,
        sef.runningCfg.BUTTONS.DELETE,
        sef.runningCfg.BUTTONS.EXPORT, {
            text: _('上传块'),
            xtype: 'sef-actionbutton',
            actionName: 'uploadblock',
            //btnType: 'default',
            dataAction: false
        }, {
            text: _('获取块文件'),
            xtype: 'sef-actionbutton',
            actionName: 'downloadblock',
            //btnType: 'default',
            dataAction: false
        },{
            text: _('上传布局'),
            xtype: 'sef-actionbutton',
            actionName: 'uploadlayout',
            //btnType: 'default',
            dataAction: false
        }, {
            text: _('获取布局文件'),
            xtype: 'sef-actionbutton',
            actionName: 'downloadlayout',
            //btnType: 'default',
            dataAction: false
        }
    ],

    onPageReady: function () {

        //console.log('formpage will on ready');
        //此方法用于更新权限信息
        //roles为子表名称，若不加则为主表的行为
        this.updatePermission({
            uploadblock: true,
            uploadlayout: true,
            downloadblock: true,
            downloadlayout: true
            //makedraw: true,
            //downdraw: true
        });


    },

    uploadblock__execute: function (btn) {
        var dialog = Ext.create('sef.core.components.uploader.UploadDialog', {
            //dialogTitle: 'My Upload Widget',
            uploadParams: {
                projectId: 0,
                code:1
            },
            uploadUrl: '/Block/UploadBlockDwgFile'
        });
        //this.fireEvent('uploadcomplete', this, manager, queue.getUploadedItems(), errorCount);
        dialog.on('uploadcomplete', function (up, mgr, uploadedItems, err) {
            sef.message.success("已成功加入任务队列", 3000);
            dialog.close();
        });
        dialog.show();
    },

    uploadlayout__execute: function (btn) {
        var dialog = Ext.create('sef.core.components.uploader.UploadDialog', {
            //dialogTitle: 'My Upload Widget',
            uploadUrl: '/Block/UploadLayoutDwgFile'
        });
        //this.fireEvent('uploadcomplete', this, manager, queue.getUploadedItems(), errorCount);
        dialog.on('uploadcomplete', function (up, mgr, uploadedItems, err) {
            sef.message.success("已成功加入任务队列", 3000);
            dialog.close();
        });
        dialog.show();
    },

    downloadblock__execute: function (btn) {
        var me = this;
        var ids = me.getSelectionIDs();
        if (ids.length != 1) {
            sef.dialog.info("请选择一条数据");
            return;
        }
        var id = ids[0];
        me.setLoading("Loading...");
        sef.utils.ajax({
            url: 'Block/DownloadBlock',
            method: 'POST',
            paramAsJson: true,
            jsonData: {
                blockId: id
            },
            scope: me,
            success: function (result) {
                sef.message.success("已成功加入任务队列", 3000);
                me.setLoading(false);
            },
            failure: function (err, resp) {
                sef.dialog.error(err.message);
                me.setLoading(false);
                console.log('error', err);
            }
        });
    },

    downloadlayout__execute: function (btn) {
        var me = this;
        me.setLoading("Loading...");
        sef.utils.ajax({
            url: 'Block/DownloadLayout',
            method: 'POST',
            paramAsJson: true,
            scope: me,
            success: function (result) {
                sef.message.success("已成功加入任务队列", 3000);
                me.setLoading(false);
            },
            failure: function (err, resp) {
                sef.dialog.error(err.message);
                me.setLoading(false);
                console.log('error', err);
            }
        });
    },

    refresh__execute: function () {
        this.down('sef-pagetree').reload();
    },

    //加上此节点用于显示标准树
    tree: {
        //此属性用于控制是否显示checkhbox
        //enableCheck:true,
        xtype: 'sef-pagetree',

        title: '块的分类',
        //用于加载树的url
        url: '/Block/GetTree'
    },

    onTreeItemClick: function (tree, record) {
        tree.up('sef-block').down('sef-blocklist').getStore().makeQuerys({
            FieldName: 'BlockGroup', Values: [record.data.Data]
        });
    }
});