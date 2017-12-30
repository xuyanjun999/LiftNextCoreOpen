//ExportDialog

Ext.define('sef.core.components.window.EditorGridDialog', {
    extend: 'sef.core.components.window.BaseDialog',
    
    xtype: 'sef-editorgriddialog',
    //ui:'sefu-lockingwindow',

    //title: _('数据编辑'),
    closable:false,
    width:600,
    height:400,
    iconCls:'x-fa fa-filter',
    bodyPadding:0,

    config: {
        singleSelection:true,
        quickSearch:null,
        columns:null,
        //model:null,
        store:null,
        rowEditable:false,
        autoSave: true,
        rowEditResult: null
    },

    initComponent: function() {
        
        var title=this.title;
        if(!title){
            title=this.rowEditable===true?_('数据编辑'):_('数据查看');
        }
        if(this.rowEditable===true){
            title+='<small>(双击可以修改数据)</small>';
        }
        //debugger;
        Ext.apply(this, {
            title:title,
            items: {
                xtype:'sef-editordatagrid',
                autoSave:this.autoSave,
                store:this.store,
                model:this.model,
                columns:this.columns,
                colConfig:this.colConfig,
                quickSearchInPaging:!!this.quickSearch,
                quickSearchFields:this.quickSearch,
                showCheckbox:!this.singleSelection,
                rowEditable:this.rowEditable
            }

        });


        this.callParent(arguments);
        //this.initDialog();
    }
});