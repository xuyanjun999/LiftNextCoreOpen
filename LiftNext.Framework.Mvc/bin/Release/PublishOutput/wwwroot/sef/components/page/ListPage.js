//ListPage.js

Ext.define('sef.core.components.page.ListPage', {
    extend: 'sef.core.components.grid.DataGrid',
    mixins: ['sef.core.interfaces.IAppPage'],
    xtype: 'sef-listpage',
    controller: 'sefc-listpagectrl',
    viewModel: {
        data: {
            action_data_exist: false
                /*
                action_can_read: true,
                action_can_edit: true,
                action_can_delete: true,
                action_can_refresh: true,
                action_can_create: true,
                action_can_export:true
                */
        }
    },

    config: {
        //vname:'list',
        bars: null,
        enableRefresh: true,
        editPageName: 'form',
        dbClickToEdit: true,
        onShowingToReload:true,
        searchConfig: {
            flex:.5,
            quickSearch: null,
            advSearch: null
        }
    },

    makeTreeBar: function() {
        if (!this.tree) return null;
        var tree = Ext.merge({}, this.tree);
        Ext.applyIf(tree, {
            itemId: 'listTree',
            collapsible: false
        });
        Ext.apply(tree,{
            title:null,
            iconCls:null
        });
        return tree;

    },

    makeActionBars: function() {
        var me=this,bars = null;
        if (this.bars) {
            bars = this.bars.map(function(btn) {
                if (btn === '-') return btn;
                var b = Ext.merge({}, btn);
                return b;
            });
        }
        if (bars) {
            if (this.enableRefresh) {
                bars.push(sef.runningCfg.BUTTONS.REFRESH);
            }
            if(this.searchConfig){
                bars.push('->');
                bars.push({
                    xtype:'sef-searchfield',
                    flex:this.searchConfig.flex||.5,
                    model:this.searchConfig.model||this.store.getModel(),
                    advSearch:this.searchConfig.advSearch,
                    quickSearch:this.searchConfig.quickSearch,
                    allowCustomSearch:this.searchConfig.allowCustomSearch,
                    listeners: {
                        'search': me.onSearch,
                        scope: me
                    }
                });
            }
            bars.forEach(function(b) {
                b.text = _(b.text);
            });
            //console.log(Ext.getBody().getViewSize());
        }

        return {
            xtype: 'toolbar',
            items: bars
        }
    },

    makeSearchBar: function() {
        return null;
        var me = this;
        if (!this.searchConfig) return null;
        if (this.searchConfig.quickSearch || this.searchConfig.advSearch) {
            return {
                xtype: 'sef-searchbar',
                searchItems: me.searchConfig.advSearch,
                model: me.model || me.store.getModel(),
                columnWidth: me.searchConfig.columnWidth || 0,
                listeners: {
                    'search': me.onSearch,
                    scope: me
                }
            };
        }

        return null;

    },

    makeTBar: function() {
        var bar = {
            xtype: 'container',
            layout: {
                type: 'vbox',
                align: 'stretch'
            },
            items: [this.makeActionBars(), this.makeSearchBar()]
        };

        return bar;
    },

    onSearch: function(v,isAdvSearch) {
        //console.log('will process search#', v, this);
        //debugger;
        if (!v) {
            var fReload=this.store.getFilters().length<1;
            this.store.clearFilter();
            if(fReload)this.store.reload();
            //this.store.reload();
        } else {
            var isOr = false;
            if (Ext.isString(v)) {
                if (this.searchConfig.quickSearch) {
                    //var vv={__QUICK:true};
                    var vv = {};
                    var qf = this.searchConfig.quickSearch;
                    if (Ext.isString(this.searchConfig.quickSearch)) {
                        qf = [this.searchConfig.quickSearch];
                    }
                    qf.forEach(function(q) {
                        vv[q] = v;
                    });
                    isOr = true;
                    v = vv;
                } else {
                    console.error('没有定义快速搜索项');
                    throw "Not define QuickSearch Config";
                }
                this.store.makeQuery(v, isOr);
                //vv[]
            }
            
            if(isAdvSearch===true){
                this.store.makeQuerys(v);
            }

        }
    },


    onRouteChange:function(){
        //this.callParent(arguments);
        var isLoaded=this.getStore().isLoaded();
        if(this.onShowingToReload===true && isLoaded)this.getStore().reload();
    },

    initComponent: function() {
        this.beforeReady();
        //console.log('befre list#',this._pid);
        Ext.apply(this, {
            lbar: this.makeTreeBar()
        });
        this.callParent(arguments);



        this.updatePermission({
            //action_can_data_exist: false,
            read: true,
            edit: true,
            delete: true,
            refresh: true,
            create: true,
            export: true
        });

        if (Ext.isFunction(this.onPageReady)) {
            this.onPageReady.call(this);
        }

        var tree=this.down('#listTree');
        if(tree){
            tree.on('itemclick',function(tv,rec){
                if(Ext.isFunction(this.onTreeItemClick)){
                    this.onTreeItemClick.call(this,tree,rec);
                }
            },this);
        }
        //console.log('after list#');
    }
});