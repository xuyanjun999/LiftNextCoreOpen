//Store
Ext.define('sef.core.data.Store', {
    extend: 'Ext.data.Store',
    alias: 'store.sef-store',

    autoDestroy: true,
    autoLoad: false,
    remoteFilter: true,
    remoteSort: true,
    pageSize: window.SEF_LIB_CFG.pageSize||50,
    config:{
        additionFilterFn: null,
        include: null,
        jsonData : null
    },
    
    //include: null,

    getExData: function() {
        return this.getProxy().getReader().exData;
    },

    


    makeQuerys:function(qs,forAdd,forReload){
        /*
        { FieldName: 'IsBlockParam', Values: [true], Rel : 'Or', Operator : 6 };
        */

        if(!Ext.isArray(qs)){
            qs=[qs];
        }

        var filters=[];
        qs.forEach(function(q){
            var property=q['FieldName'];
            var value=q['Values'];
            var rel=q['Rel']||'Or';
            var operator=q['Operator']||6;
            filters.push({
                property:property,
                value:value,
                rel:rel,
                operator:operator
            })
        });

        if (forAdd === true) {
            this.addFilter(filters, forReload);
        } else {
            this.clearFilter(false);
            this.addFilter(filters, !(forReload!==false));
            //this.setFilters(filters);
        }

    },

    makeQuery: function(qObj, isOr, forAdd, forReload) {
        if (!qObj) {
            this.clearFilter();
            return;
        }

        var filters = [];
        for (var q in qObj) {
            var qv = qObj[q];
            if (!qv) continue;
            filters.push({
                property: q,
                value: qv,
                rel: isOr === true ? 'Or' : 'And',
                operator:6
            });
        }



        if (forAdd === true) {
            this.addFilter(filters, forReload);
        } else {
            this.clearFilter(false);
            this.addFilter(filters, !(forReload!==false));
            //this.setFilters(filters);
        }

    },

    

    


    constructor: function(config) {
        //debugger;
        if (!config.url) {
            var mname = config.model;
            if (mname) {
                var ma = mname = mname.split('.');
                var name = ma[ma.length - 1];
                name = name.replace(/Model$/, ''); //.toLowerCase();
                config.url = '/api/' + name;
            }

        }
        if (!config.proxy) {
            config.proxy = {
                type: 'sef-apiproxy',
                url: config.url
            };
        }
        this.callParent([config]);
        var me = this;
        this.on('beforeload', function(store, oper) {
            //console.log(store,store.storeId);
            //debugger;
            oper.setParams({
                Include: me.include,
                JsonData : me.jsonData
            });
            if (Ext.isFunction(this.additionFilterFn)) {
                //debugger;
                var r = this.additionFilterFn();
                
                //console.log('will before load'); //Ext.merge({},oper));
                if (r) {
                    //console.log('will add aditionfilter#',r);
                    oper.bootFilters=r;
                }
            }
            //debugger;

            //console.log('will before load#',this);
        });
    }

});