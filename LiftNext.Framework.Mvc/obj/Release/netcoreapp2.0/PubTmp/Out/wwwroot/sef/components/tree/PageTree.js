//PageTree.js

Ext.define('sef.core.components.tree.PageTree', {
    extend: 'Ext.tree.Panel',
    xtype: 'sef-pagetree',
    ui: 'sefu-pagetree',
    title: _('系统菜单'),
    iconCls: 'x-fa fa-bars',
    minWidth: 200,
    width: 250,
    collapsible: true,
    useArrows: true,
    border: true,
    rootVisible: false,
    titleCollapse: false,
    autoLoad: true,

    viewConfig: {
        makeDirty: false,
        emptyText: _('没有数据'),
        deferEmptyText: false
    },

    config: {
        rootText: 'All',
        url: '',
        enableCheck: false,
        enableDateSearch:false,
        enableKeySearch:false,
        autoSearch:true
    },

    privates:{
        _lastFilter:null
    },

    makeBar: function() {
        var me = this;
        if (this.enableDateSearch || this.enableKeySearch){
            return {
                xtype: 'sef-treesearchbar',
                enableDateSearch:this.enableDateSearch,
                enableKeySearch:this.enableKeySearch,
                keyName:this.keyName,
                dateName:this.dateName,
                listeners:{
                    scope:me,
                    treesearch:me.onTreeSearch
                }
            }
        }
        return null;
        
    },

    onTreeSearch:function(filter){
        //console.log('tree.searching#',filter,this);
        if(this.autoSearch===true){
            this._lastFilter=filter;
            //console.log('will for reload...');
            //debugger;
            this.reload();
        }
    },

    reload: function(withRoot) {
        var root = this.getRootNode();
        if (root) {
            root.removeAll(false);
            if (this.getStore().isLoaded() === true) {
                this.getStore().reload();
            } else {
                root.expand();
            }

        }
        /*
        root && root.removeAll(false);
        //console.log()
        this.getStore().reload();
        */

    },

    initComponent: function() {
        var me = this,
            _autoLoad = this.autoLoad; // === true;
        this.autoLoad = false;
        if (!this.store) {
            this.store = Ext.create('Ext.data.TreeStore', {
                //url:this.url,
                autoLoad: false,
                proxy: {
                    type: 'ajax',
                    url: this.url,
                    paramsAsJson: true,
                    actionMethods: {
                        create: 'POST',
                        read: 'POST',
                        update: 'POST',
                        destroy: 'POST'
                    },

                    reader: {
                        type: 'sef-jsonreader',
                        rootProperty: window.SEF_LIB_CFG.pageTreeRootProperty || 'Result.Children'
                            //rootProperty: 'Result.Children'
                    }
                },
                model: this.enableCheck === true ?
                    'sef.core.model.CheckboxTreeModel' : 'sef.core.model.TreeModel'


            });

            //var me=this;

            this.store.on('beforeload', function(s, oper) {
                var id = oper.getId();
                //console.log('bind_store_data',id,store);
                var _params = Ext.merge({}, oper.getParams()); // || {};

                if (id === 'root') {
                    _params['TreeNode'] = { DataID: 0 };
                } else {
                    var rec = s.getById(id);
                    //debugger;
                    var data = Ext.merge({}, rec.data);
                    var ds = {};
                    for (var d in data) {
                        if (/^[A-Z]/.test(d)) {
                            //console.log(d);
                            if (d !== 'Children') {
                                ds[d] = data[d];
                            }

                        }
                    }
                    _params['TreeNode'] = ds;
                }

                if (Ext.isFunction(me.onTreeWillLoad)) {
                    var exParam = me.onTreeWillLoad.call(me, me, me.getStore(), oper);
                    if (exParam) {
                        _params = Ext.merge(_params['TreeNode'], exParam);
                    }
                }

                //add filter
                //{FieldName: "Name", Values: ["dd"], Rel: "Or", Operator: 6}
                if(me._lastFilter){
                    if(!_params.Filter)_params.Filter=[];
                    for(var lf in me._lastFilter){
                        var filter={FieldName:lf,Rel:'Or'};
                        var v=me._lastFilter[lf];
                        if(Ext.isArray(v)){
                            filter['Operator']=7;
                            filter['Values']=v;
                        }else{
                            filter['Operator']=6;
                            filter['Values']=[v];
                        }
                        _params.Filter.push(filter);

                    }

                }
                
                

                oper.setParams(_params);


            });

            if (_autoLoad) this.store.load();

        }

        Ext.apply(this, {
            tbar: this.makeBar()
        });


        this.callParent(arguments);

    },

    afterRender: function() {
        this.callParent(arguments);
        //this.mask();
        //this.store.load();
    }


});