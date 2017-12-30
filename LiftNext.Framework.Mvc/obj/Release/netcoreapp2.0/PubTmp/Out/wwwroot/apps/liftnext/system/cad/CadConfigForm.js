//UserForm

Ext.define('sef.app.liftnext.system.cad.CadConfigForm', {
    extend: 'sef.core.components.page.FormPage',
    xtype: 'sef-cadconfigform',



    bars: [sef.runningCfg.BUTTONS.SAVE,
        sef.runningCfg.BUTTONS.EDIT_INFORM
    ],

    activate__execute: function(btn) {
        //console.log('here is activate click#', btn, this);
    },

    onPageReady: function() {

        //console.log('formpage will on ready');
        //此方法用于更新权限信息
        //roles为子表名称，若不加则为主表的行为
        this.updatePermission({
        });
        var me = this;
        sef.utils.ajax({
            url: 'CadConfig/GetCadConfig',
            method: 'POST',
            paramAsJson: true,
            scope: me,
            success: function (result) {
                if (result) {
                    me.getForm().setValues(result);
                }
                me.setLoading(false);
            },
            failure: function (err, resp) {
                sef.dialog.error(err.message);
                me.setLoading(false);
                console.log('error', err);
            }
        });
    },

    save__execute: function () {
        var vf = this.hasInvalidField();
        if (vf) {
            sef.message.error(_('当前页面的输入项有错误，请检查'));
            return false;
        }
        var me = this;
        var params = me.getValues();

        //me.setLoading("Loading...");
        sef.utils.ajax({
            url: 'CadConfig/UpdateCadConfig',
            method: 'POST',
            paramAsJson: true,
            jsonData: {
                formValues: params
            },
            scope: me,
            success: function (result) {
                sef.message.success("保存服务配置成功", 3000);
                me.setLoading(false);
            },
            failure: function (err, resp) {
                sef.dialog.error(err.message);
                me.setLoading(false);
                console.log('error', err);
            }
        });
        return false;
    },


    items: [{
        xtype: 'textarea',
        name: 'CADWebAddress',
        itemId: 'CADWebAddress',
        fieldLabel: _('LiftNext服务地址(不填自动取当前地址,如http://xxxx.com)'),
        columnWidth: 1,
        height : 60,
        allowBlank: true
    }, {
        xtype: 'textarea',
        name: 'CADSaveAsFileType',
        itemId: 'CADSaveAsFileType',
        fieldLabel: _('保存图纸文件类型(可选dwg,png,pdf,多个以逗号分割)'),
        columnWidth: 1,
        allowBlank: false,
        value : 'dwg'
        }, {
            xtype: 'textarea',
            name: 'CADSaveAsDwgFileType',
            itemId: 'CADSaveAsDwgFileType',
            fieldLabel: _('保存Dwg版本格式(可选2013,2010,2007,2004,2000)'),
            columnWidth: 1,
            allowBlank: false,
            value : '2013'
    }, {
        xtype: 'textarea',
        name: 'CADSaveAsPdfLayout',
        itemId: 'CADSaveAsPdfLayout',
        fieldLabel: _('保存Pdf布局名称(当保存图纸文件类型包含pdf时必填,多个以逗号分割)'),
        columnWidth: 1,
        allowBlank: true,
        value: ''
        }, {
            xtype: 'textarea',
            name: 'CADSaveAsPngLayout',
            itemId: 'CADSaveAsPngLayout',
            fieldLabel: _('保存Png布局名称(当保存图纸文件类型包含png时必填,多个以逗号分割)'),
            columnWidth: 1,
            allowBlank: true,
            value: ''
        }]
});