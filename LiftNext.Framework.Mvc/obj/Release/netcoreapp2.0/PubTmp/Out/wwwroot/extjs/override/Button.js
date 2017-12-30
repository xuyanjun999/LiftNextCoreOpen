Ext.button.Button.override({
    
    inLoading:false,
    btnType:'',//default|primary|loading|secondary|link
    _lastIconCls:'',

    setLoading:function(load){
        //console.log('will set loading#',load);
        if(load===true){
            this._lastIconCls=this.iconCls;
            this.setIconCls('x-fa fa-spinner fa-spin');
        }else{
            if(this._lastIconCls){
                this.setIconCls(this._lastIconCls);
            }else{
                this.setIconCls('');
            }
        }
        this.setDisabled(load);
        
    },

    

    initComponent:function(){
        if(!Ext.isEmpty(this.btnType)){
            var ui='sefu-btn-'+this.btnType;
            //console.log('will set btn ui:',ui);
            Ext.apply(this,{
                ui:ui
            });
        }
        return this.callParent(arguments);
    }
});