//GridPagingToolbar.js

Ext.define('sef.core.components.bar.GridPagingToolbar', {
    extend: 'Ext.toolbar.Paging',
    xtype: 'sef-gridpagingbar',
    ui: 'sefu-gridpagingbar',
    inputItemWidth: 40,

    //DEFAULT_STATUS_TIP:[{text:'default'}]
    config: {
        gridTip: null,
        statusTip: [],
        showPageSizeSwitcher: true,
        quickSearchInPaging: true,
        quickSearchFields: null,
        keepFilterForRefresh:false,
        quickSearchFlex:1
    },

    initComponent: function() {
        this.displayInfo = false;
        //debugger;
        this.callParent(arguments);
        this.displayInfo = true;
    },

    doRefresh:function(){
        if(this.keepFilterForRefresh!==true){
            this.getStore().clearFilter(true);
        }

        this.callParent(arguments);
    },
    makePageSizeOption: function() {
        var me=this;
        var sizeData = [{
            name: '50',
            value: 50
        }, {
            name: '100',
            value: 100
        }];
        return {
            xtype: 'combo',
            ui: 'sefu-textfield-paging',
            editable: false,
            queryMode: 'local',
            displayField: 'name',
            valueField: 'value',
            width: 80,
            //emptyText: _('PageSize'),
            store: Ext.create('Ext.data.Store', {
                data: sizeData
            }),
            listeners:{
                scope:me,
                change:me.onPageSizeChange,
                afterrender:function(cb){
                    //cb.select(cb.getStore().getAt(0));
                }
            }
        };

    },

    onPageSizeChange:function(cb,newPageSize){
        //console.log(newPageSize);
        var me=this,store=me.store;
        //debugger;
        if(store.getPageSize()!=newPageSize){
            store.setPageSize(newPageSize);
            store.currentPage=1;//(0);
            store.loadPage(store.currentPage);
            return true;
        }
        return false;
    },

    makeGridTip: function() {
        if (this.gridTip) {
            return this.gridTip;
        }
        if (this.statusTip) {
            //todo.
        }



        return null;
    },

    makeQuickSearch: function() {
        if (this.quickSearchInPaging === true) {
            var me = this;
            return {
                xtype: 'sef-searchfield',
                flex: me.quickSearchFlex,
                listeners: {
                    quicksearch: function(v) {
                        if (me.quickSearchFields) {
                            var q = {};
                            me.quickSearchFields.forEach(function(qf) {
                                q[qf] = v;
                            });
                            me.getStore().makeQuery(q, true);
                        }

                    }
                }

            };
        }
        return null;
    },

    getPagingItems: function() {
        var items = this.callParent(arguments);

        if (this.showPageSizeSwitcher === true) {
            items = Ext.Array.insert(items, 7, [this.makePageSizeOption(), '-']);
        }

        var newItems = [];
        var it = this.makeGridTip();
        if (it) newItems.push(it);
        it = this.makeQuickSearch();
        if (it) newItems.push(it);
        else {
            newItems.push('->');
        }


        newItems = newItems.concat(items);
        newItems.forEach(function(item) {
            //if(!item)return ;
            if (!item) return;
            if (item.itemId === 'first' ||
                item.itemId === 'prev' ||
                item.itemId === 'next' ||
                item.itemId === 'last' || item.itemId === 'refresh') {
                //item.ui = 'sefu-btn-paging';
            }
            if (item.itemId === 'afterTextItem') {
                //item.html=Ext.String.format('of {0}/{1}',)
            }

            if (item.itemId === 'inputItem') {
                item.ui = 'sefu-textfield-paging';
            }
        });
        newItems = Ext.Array.insert(newItems, newItems.length-1, [{
            xtype: 'tbtext',
            itemId: 'displayItem'
        }, '-']);

        
        //console.log(newItems);
        return newItems;
    }
});