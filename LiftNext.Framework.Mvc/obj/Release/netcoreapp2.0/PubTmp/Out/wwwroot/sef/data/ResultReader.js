//ResultReader.js

Ext.define('sef.core.data.ResultReader', {
    extend: 'Ext.data.reader.Json',
    alias: 'reader.sef-jsonreader',
    totalProperty: window.SEF_LIB_CFG.totalProperty || 'Total',
    successProperty: window.SEF_LIB_CFG.successProperty || 'Success',
    rootProperty: window.SEF_LIB_CFG.rootProperty || 'ResultList',
    messageProperty: window.SEF_LIB_CFG.messageProperty || 'Message',
    exDataProperty: '',
    readRecordsOnFailure: false,

    exData: null,
    exResult: null,


    _read: function (resp, readOptions) {
        var data = this.callParent(arguments);
        //console.log('reader.read====>',data);
        return data;
    },

    getResponseData: function (response) {
        var d = this.callParent(arguments);
        if (!Ext.isEmpty(this.exDataProperty)) {
            if (d && d['__$isError'] !== true) {
                this.exData = d[this.exDataProperty];
            }
        }
        if (d) {
            this.exResult = d['Result'];
        }
        return d;
    }
});