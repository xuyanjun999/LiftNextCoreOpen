Ext.define("abp.data.Store", {
    extend: 'Ext.data.Store',
    alias: 'store.abpstore',
    config: {
        autoLoad: true,
        remoteFilter: true,
        remoteSort: true,
        //外键集合
        include: null,
        //默认过滤
        defaultFilter: null,
        //临时过滤
        customFilter: null,

        api: null,

        pageSize:100
    },

    beforeload: function (store, operation, eOpts) {
        
        console.log("123");
        /*
        var filters = [];
        var operationFilters = operation._filters;
        //
        if (!Ext.isEmpty(operationFilters)) {
            operationFiltersStr = store.getProxy().encodeFilters(operationFilters);
            var operationFiltersJson = Ext.decode(operationFiltersStr);
            operationFiltersJson = xf.utils.encodeFilters(operationFiltersJson);
            filters = Ext.Array.merge(filters, operationFiltersJson);
        }

        if (!Ext.isEmpty(this.defaultFilter)) {
            var dFilter = xf.utils.encodeFilters(this.defaultFilter);
            filters = Ext.Array.merge(filters, dFilter);
        }

        if (!Ext.isEmpty(this.customFilter)) {
            var cFilter = xf.utils.encodeFilters(this.customFilter);
            filters = Ext.Array.merge(filters, cFilter);
        }

        operation.setParams({
            include: this.include,
            filter: filters
        });

        delete operation._filters;
        */
        //加过滤

    },

    constructor: function (config) {
        var me = this;
        
        if (!config.proxy) {
            config.proxy = {
                type: 'abpproxy',
                api: {
                    read: 'http://localhost:5000'+config.api+"/read"
                }
            }
        }
        
        this.callParent([config]);

        this.on("beforeload", me.beforeload, me);
    }
});