Ext.form.field.ComboBox.override({
    simpleModelValue:false,

    setValue: function(value) {
        //debugger;
        
        return this.callParent(arguments);
    },

    doSetValue: function(value /* private for use by addValue */, add){
        //debugger;
        if(value && this.simpleModelValue ===true && !(value.isModel)){
            this.value=value[this.valueField];
            this.setHiddenValue(value[this.valueField]);
            this.setRawValue(value[this.displayField]);
            //console.log('doSet@#',this.value,this.getRawValue());
            return this;
        }
        return this.callParent(arguments);
    },

    getValue:function(){
        var v=this.value,rv=this.getRawValue();

        var newV= this.callParent(arguments);
        if(this.simpleModelValue===true){
            if(newV===rv)return v;
        }
        return newV;
    }
});