//JsonWriter.js

Ext.define('sef.core.data.JsonWriter', {
    extend: 'Ext.data.writer.Json',
    alias: 'writer.sef-jsonwriter',

    rootProperty: 'Entity',


    dateFormat:'Y-m-d',
    writeRecords: function (request, data) {
        //debugger;
        //data=this._transform(data,request);
        if (data) {
            data.forEach(function (item) {
                if (item.ID && !Ext.isNumber(item.ID))
                    item.ID = 0;
            });
        }
        var req = this.callParent(arguments);
        var json = req.getJsonData() || {};
        var recs = request.getRecords();
        if (recs) {
            var mo = recs[0].modified;
            var ms = [];
            for (var m in mo) {
                ms.push(m);
            }

            json['Modified'] = ms;//recs[0].modified;
        }
        req.setJsonData(json);
        return req;
    }
});