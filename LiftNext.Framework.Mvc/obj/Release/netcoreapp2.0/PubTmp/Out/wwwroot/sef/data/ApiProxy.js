//ApiProxy.js

Ext.define('sef.core.data.ApiProxy', {
    extend: 'Ext.data.proxy.Rest',
    alias: 'proxy.sef-apiproxy',
    config: {
        actionMethods: {
            create: 'POST',
            read: 'POST',
            update: 'POST',
            destroy: 'POST'
        },
        paramsAsJson:true,
        filterParam: window.SEF_LIB_CFG.filterParam||'Filter',
        limitParam: window.SEF_LIB_CFG.limitParam||'Limit',
        pageParam: window.SEF_LIB_CFG.pageParam||'Page',
        startParam: window.SEF_LIB_CFG.startParam||'Start',
        sortParam: window.SEF_LIB_CFG.sortParam||'Sort',
        directionParam: window.SEF_LIB_CFG.directionParam||'SortDir'
    },
    reader: {
        type: 'sef-jsonreader'
    },
    writer: {
        type: 'sef-jsonwriter'
    },

    getParams:function(operation){
        var p=this.callParent(arguments);
        if(operation.bootFilters){
            if(!p[this.filterParam]){
                p[this.filterParam]=[];
            }
            if(!Ext.isArray(operation.bootFilters)){
                //debugger;
                p[this.filterParam]=Ext.Array.merge(p[this.filterParam],[operation.bootFilters]);
            }else{
                p[this.filterParam]=Ext.Array.merge(p[this.filterParam],operation.bootFilters);
            }
        }
        //{FieldName: "Name", Value: "cctv", Rel: "Or"}
        //debugger;
        return p;
    },


    buildUrl: function(request) {
        var me = this,
            operation = request.getOperation(),
            records = operation.getRecords(),
            //record    = records ? records[0] : null,
            format = me.getFormat(),
            url = me.getUrl(request),
            id, params;



        //console.log('url#',operation);
        var action = operation.action;
        if (/\.json$/.test(url)) {
            //hack
            url = url.replace(".json", "."+action + ".json");
        } else {
            if (!url.match(me.slashRe)) {
                url += '/';
            }
            url += action;
        }




        if (format) {
            if (!url.match(me.periodRe)) {
                url += '.';
            }

            url += format;
        }

        request.setUrl(url);
        return url;
        //return me.callParent([request]);

    },

    getReadSingleUrl:function(id){
        var me=this,url=this.getUrl();

        var action = "single";
        if (/\.json$/.test(url)) {
            //hack
            url = url.replace(".json", "."+action +"."+id+ ".json");
        } else {
            if (!url.match(me.slashRe)) {
                url += '/';
            }
            url += action+"/"+id;
        }

        
        return url;

    }


});