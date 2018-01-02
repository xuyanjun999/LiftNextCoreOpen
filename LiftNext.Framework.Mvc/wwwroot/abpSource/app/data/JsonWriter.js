Ext.define('abp.data.JsonWriter',{
    extend:'Ext.data.writer.Json',
    alias:'writer.abpjsonwriter',
    
    rootProperty:'Entity',
    dateFormat:'Y-m-d H:i:s',
    getRecordData: function (record, operation) {
        
        return this.callParent(arguments);
    },

    writeRecords: function(request, data){
      
        //data=this._transform(data,request);
        
        var req=  this.callParent(arguments);
        //debugger;
        var json=req.getJsonData()||{};
        var recs=request.getRecords();
        if(recs){
            var mo=recs[0].modified;
            var ms=[];
            for(var m in mo){
                ms.push(m);
            }

            json['Modified']=ms;//recs[0].modified;
        }
        req.setJsonData(json);
        return req;
    }
});