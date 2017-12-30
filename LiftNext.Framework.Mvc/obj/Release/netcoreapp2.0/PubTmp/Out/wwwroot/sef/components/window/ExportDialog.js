//ExportDialog

Ext.define('sef.core.components.window.ExportDialog', {
    extend: 'sef.core.components.window.BaseDialog',
    
    xtype: 'sef-exportdialog',
    //ui:'sefu-lockingwindow',

    title: _('数据导出'),
    closable:false,
    width:400,
    height:400,
    iconCls:'x-fa fa-download',
    
    config: {
        url: '',
        store:null,
        fileTypes:0,// sef.runningCfg.FILE_TYPES.CSV|sef.runningCfg.FILE_TYPES.EXCEL|sef.runningCfg.FILE_TYPES.PDF,
        prefix:'export',
        defaultFileName: '',
        columns: [],
        include:[]
    },

    initComponent: function () {
        
        if(this.fileTypes<1){
            this.fileTypes=sef.runningCfg.FILE_TYPES.CSV|sef.runningCfg.FILE_TYPES.EXCEL|sef.runningCfg.FILE_TYPES.PDF;
        }
        if(Ext.isEmpty(this.defaultFileName)){
            this.defaultFileName=this.prefix+'_'+Ext.Date.format(new Date(),'Ymdhisu');
        }

        if (!this.columns || this.columns.length == 0)
        {
            //TODO:重新考虑
            var me = this;
            var fields = this.getStore().model.getFields();
            fields.forEach(function (f) {
                if (f.name && f.stype != 'asso' && f.name != "ID") {
                    me.columns.push(f.name);
                }
            });
        }
        Ext.apply(this, {
            items: {
                xtype: 'sef-exportpanel',
                store:this.store,
                url:this.url,
                fileTypes: this.fileTypes,
                columns: this.columns,
                include: this.include,
                defaultFileName: this.defaultFileName,
                scrollable: 'y'
            }

        });

        this.callParent(arguments);
        //this.initDialog();
    }
});