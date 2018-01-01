Ext.define('abp.component.list.GridList', {
    extend: 'Ext.grid.Panel',
    xtype: 'gridlist',
    requires: [
        'abp.component.list.GridListCtl',
        'Ext.grid.Panel'
    ],
    controller: 'gridlistctl',
    config: {
        listPage: null,
        enableRowEdit: false,
        enableColumnFilter: true,
        showCheckbox: true,
        showRowNumber: true
    },

    makePagingBar: function () {
        return {
            xtype: 'pagingtoolbar',
            style: 'padding:3px 0',
            displayInfo: true,
            items: [{
                xtype: 'combo',
                store: {
                    fields: ['pageText', 'pageSize'],
                    data: [
                        { pageText: '10/page', pageSize: 10 },
                        { pageText: '20/page', pageSize: 20 },
                        { pageText: '50/page', pageSize: 50 },
                        { pageText: '100/page', pageSize: 100 },
                    ]
                },
                displayField: 'pageText',
                valueField: 'pageSize',
                value: 10,
                editable: false,
                style: 'width:100px;margin-left:10px;',
            }]
        };
    },

    makePlugins: function () {
        var me = this;
        var plugins = me.plugins || [];
        if (this.enableRowEdit === true) {
            plugins.push({
                ptype: 'enableRowEdit',
                clicksToEdit: 2,
                listeners: {
                    scope: me,
                    'edit': me.onRowEditDone
                }
            });
        }
        if (this.enableColumnFilter === true) {
            plugins.push({
                ptype: 'gridfilters',
            });
        }

        return plugins;
    },

    makeTBar: function () {

        var me = this;
        return me.tbar;
        if (!me.tbar) me.tbar = [];
        me.tbar = me.tbar.map(function (item) {
            var r = item;
            if (Ext.isString(item)) {
                // r = xf.utils.getActionButton(item);
            }
            return r;
        });
        me.tbar.push("->");
        me.tbar.push({
            xtype: 'textfield',
            itemId: 'gridsearchtext',
            emptyText: '输入条件进行快捷搜索',
            //triggers: {
            //    search: {
            //        cls: 'x-form-search-trigger',
            //        handler: function () {
            //            me.fireEvent("quicksearch");
            //        }
            //    },
            //    clear: {
            //        cls: 'x-form-clear-trigger',
            //        handler: function () {
            //            me.getStore().clearFilter();
            //        }
            //    }
            //},
            keyMap: {
                ENTER: {
                    handler: function () {
                        me.fireEvent("quicksearch");
                    },
                    scope: 'this',
                }
            }
        });

        //me.tbar.push(xf.utils.getActionButton("search"));

        //me.tbar.push(xf.utils.getActionButton("refresh"));

        return me.tbar;
    },

    makeGrid: function () {
        var gridConfig = {

            //pageSize:4,
            //viewType: 'sef-datagrid-view',
            viewConfig: {
                stripeRows: true,
                enableTextSelection: true,
                emptyText: "没有匹配的数据" //,//'没有数据' //SEF.G.Consts.TABLE_EMPTY_TEXT
            },
            plugins: this.makePlugins(),
            tbar: this.makeTBar(),
            bbar: this.makePagingBar(),
            columns: this.makeColumns()
        };


        //gridConfig['features'] = this.makeFeatures();
        if (this.showCheckbox) {
            gridConfig['selModel'] = {
                type: 'checkboxmodel'
            };
        }


        return gridConfig;
    },

    makeColumns: function () {
        var me = this;
        var columns = me.columns;
        
        var model = null;

        if (me.model) model = me.model;
        else if (me.getStore()) {
            console.log(me.getStore());
            model = me.getStore().model;
        }

        if (!model)
            console.log('grid或store必须定义model');

        var modelInstance = Ext.create(model);
        console.log(modelInstance);

        var fields = modelInstance.getFields();

        if (!columns) {

             columns = fields.map(function (item) {
                return {
                    dataIndex: item.name,
                    text: item.text||item.name,
                    hidden: item.name === "ID",
                    formatter: item.formatter,
                    renderer: item.renderer,
                    width: item.width || 150,
                    filter: {
                        type: 'string'
                    }
                }
            });
            if (me.showRowNumber)
                columns.unshift({
                    xtype: 'rownumberer',
                    text: '行号',
                    width: 50,
                    align: 'center'
                });
            return columns;
        }
        return me.columns;
    },

    beforeload: function (store, operation, eOpts) {
    },

    //onRowDblClick: function (grid, record) {
    //    console.log("grid rowdblclick");
    //},

    //onQuickSearch: function () {
    //    alert("快搜索啦");
    //},

    initComponent: function () {

        var me = this;

        if (!me.store) {
            me.store = {
                type: 'xf-store',
                model: me.model,
                api: me.api,
                defaultFilter: me.defaultFilter
            }
        }

        Ext.apply(this, this.makeGrid());

        this.callParent(arguments);

        /*
        var store = me.getStore();

        if (store) {
            store.on("beforeload", me.beforeload, me);
        }

        var controller = me.getController();

        me.on('rowdblclick', controller.onRowDblClick, controller);

        me.on('refresh', controller.onRefresh, controller);

        //this.on("quicksearch", controller.onQuickSearch, controller);
        */
    }

});