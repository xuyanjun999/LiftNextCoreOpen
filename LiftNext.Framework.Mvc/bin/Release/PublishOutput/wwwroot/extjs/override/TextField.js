Ext.form.field.Text.override({
    initComponent:function(){
        if(this.allowBlank===false){
            Ext.apply(this,{
                cls:'sef-required-field'
            });
        }

        this.callParent(arguments);
    }
});