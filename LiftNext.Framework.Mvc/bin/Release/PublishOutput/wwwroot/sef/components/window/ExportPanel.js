//ExportPanel

Ext.define('sef.core.components.window.ExportPanel', {
    extend: 'Ext.form.Panel',
    xtype: 'sef-exportpanel',
    mixins: ['sef.core.interfaces.IDialogContent'],
    layout: {
        type: 'vbox',
        align: 'stretch'
    },
    defaults: {
        labelAlign: 'top'
    },

    config: {
        store: null,
        fileTypes: 0,
        defaultFileName: '',
        columns: [],
        include:[]
    },

    makeDialogResult: function() {
        var me = this,
            result = this.getForm().getFieldValues();

        result.Export = {};
        result.Export.Columns = this.columns;
        result.Include = this.include;
        if (result.DataRange === 1) {
            //with ids
            var selected = this.store.Selected;
            if (selected) {
                result.Export.Ids = selected.map(function(r) {
                    return r.get('ID');
                });
            } else {
                sef.dialog.error('请选择数据行');
                return;
            }
        } else {
            //with filters
            var fso = [];

            var fs = this.store.getFilters();
            //console.log(fs);
            if(fs){
                fs.each(function(f){
                    fso.push(f.serialize());
                });
            }

            if (Ext.isFunction(this.store.additionFilterFn)) {
                fs = this.store.additionFilterFn();
                //console.log(fs);
                if (fs) {
                    fs.forEach(function (f) {
                        fso.push(f);
                    });
                }
            }
            result.Filter = fso;
        }

        //console.log('dialog.result#',result);
        sef.utils.ajax({
            url: me.url,
            method: 'POST',
            jsonData: result,
            scope: me,
            success: function(result) {
                //me.view.store.reload();
                //console.log('export down');
                if (result.Url) {
                    window.open(result.Url, '_blank');
                }
                me.closeDialog(true, {
                    Url: result.Url
                });
            },
            failure: function(err, resp) {

                sef.dialog.error(err.message);
                me.setDialogLoading(false, false);
            }
        });

        return null;
    },

    initComponent: function() {
        var fileTypeItems = [];
        //debugger;
        var i = 0;
        for (var c in sef.runningCfg.FILE_TYPES) {
            var sc = sef.runningCfg.FILE_TYPES[c];
            if ((sc & this.fileTypes) === sc) {
                fileTypeItems.push({
                    boxLabel: c,
                    checked: i++ < 1,
                    name: 'FileType',
                    inputValue: sc
                });
            }
        };

        var items = [{
            xtype: 'radiogroup',
            fieldLabel: _('数据范围'),
            vertical: true,
            name: 'DataRange',
            items: [{
                boxLabel: _('当前选择的行'),
                checked: true,
                name: 'DataRange',
                inputValue: 1
            }, {
                boxLabel: _('当前查询条件'),
                name: 'DataRange',
                inputValue: 2
            }]
        }, {
            xtype: 'radiogroup',
            fieldLabel: _('文件类型'),
            vertical: true,
            name: 'FileType',
            items: fileTypeItems
        }, {
            xtype: 'textfield',
            name: 'FileName',
            value: this.defaultFileName,
            fieldLabel: _('文件名称')
        }];

        Ext.apply(this, {
            items: items
        });

        this.callParent(arguments);
        this.initDialog();
        //this.closeDialog();
    }
});