Ext.data.proxy.Server.override({
    applyEncoding:function(v){
        //debugger;
        if(Ext.isObject(v))return v;

        return v;
    }
});