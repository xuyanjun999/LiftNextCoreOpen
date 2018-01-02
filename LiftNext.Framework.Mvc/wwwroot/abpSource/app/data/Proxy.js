Ext.define("abp.data.Proxy", {
    extend: 'Ext.data.proxy.Ajax',
    alias: 'proxy.abpproxy',
    config: {
        paramsAsJson: true,
        actionMethods: {
            create: 'POST',
            read: 'POST',
            update: 'POST',
            destroy: 'POST'
        },
        api: {
            create: 'create',
            read: 'read',
            update: 'update',
            destroy: 'delete'
        },
        filterParam: 'Filter',
        limitParam: 'Limit',
        pageParam: 'Page',
        startParam: 'Start',
        sortParam: 'Sort',
        directionParam: 'SortDir',
        simpleSortMode: true,
        reader: {
            type: 'json',
            rootProperty: 'Entitys',
            successProperty: 'Success',
            totalProperty: 'Count'
        }
        
    },
    encodeFilters: function (filters) {
        return this.callParent([filters]);
    }
})