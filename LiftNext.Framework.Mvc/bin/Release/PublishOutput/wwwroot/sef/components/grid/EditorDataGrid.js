//LookupDataGrid

Ext.define('sef.core.components.grid.EditorDataGrid', {
    extend: 'sef.core.components.grid.DataGrid',
    mixins: ['sef.core.interfaces.IDialogContent'],
    xtype: 'sef-editordatagrid',
    layout: 'fit',
    showPageSizeSwitcher: false,
    displayMsg: false,
    //quickSearchInPaging:true,
    quickSearchFields: null,
    config: {
        autoReload:true,
        rowEditable: false //
    },
    //showCheckbox:true,

    onRowDblClick: function(selected, rec) {
        //console.log('row.dbl#',selected);
        if (this.rowEditable === true) {
            //show editor
        } else {

            this.closeDialog(true, { Result: [rec] });
        }

    },

    makeDialogResult: function() {
        var selected = this.getSelection();
        //this.closeDialog(true,selected);
        return { Result: selected };
    },

    onRowEditDone: function (editor, context, opts) {
        this.callParent(arguments);
        //debugger;
        if(this.autoSave!==true)return ;
        var me = this,
            rec = context.record;
        if (rec.dirty) {
            //update
            var me = this;
            this.store.sync({
                scope: me,
                success: function (batch) {
                    //记录保存后的返回值结果
                    //debugger
                    sef.message.success(_('保存成功'));
                    me.up('sef-editorgriddialog').rowEditResult = batch.proxy.getReader().exResult || {};

                    if (me.autoReload === true) {
                        //console.log('1')
                        me.getStore().reload();
                    }
                    return;
                    var exResult = batch.proxy.getReader().exResult || {};
                    var id = exResult['ID'];
                    if (Ext.isNumber(id)) {
                        this.view.setRecID(id); //recID = id;
                    }
                    //this.view.unmask();

                    //this.view.updateNavRecInfo();

                    sef.message.success(_('保存成功'));
                    this.fireViewEvent('formsuccess', this.view._rec, exResult);


                    //console.log('success#',batch.getProxy().getReader().exResult);
                },
                failure: function(batch) {
                    //this.view.unmask();
                    var err = sef.utils.formatError(batch);
                    sef.dialog.error(err.message);

                    //console.log('failure@',a,b,this);
                }
            });
        }
        //console.log('edit done#',editor,context);
    },

    initComponent: function() {
        if (this.rowEditable === true) {
            Ext.apply(this, {
                rowediting: true

            });
        }
        this.callParent(arguments);
        this.initDialog();


    }
});