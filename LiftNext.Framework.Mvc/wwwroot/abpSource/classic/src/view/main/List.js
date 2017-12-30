/**
 * This view is an example list of people.
 */
/**
 * This view is an example list of people.
 */
Ext.define('abp.view.main.List', {
    extend: 'abp.component.page.ListPage',
    xtype: 'mainlist',

    requires: [
        'abp.store.Personnel',
        'abp.component.list.GridList'
    ],

    tree:{
        region: 'west',
        width: 200,
        split: {
            width: '3px'
        },
        layout: 'fit',
        items: {
            xtype: 'treepanel',
            rootVisible: false,
            lines: false,
            useArrows: true,
            root: {
                text: '菜单',
                children: [{
                    text: '合同管理',
                }, {
                    text: '配方管理',
                }]
            },
            dockedItems: [{
                xtype: 'textfield',
                border: false,
                reference: 'navtreeFilter',
                dock: 'top',
                emptyText: 'Search',

                triggers: {
                    clear: {
                        cls: 'x-form-clear-trigger',
                        handler: 'onNavFilterClearTriggerClick',
                        hidden: true,
                        scope: 'controller'
                    },
                    search: {
                        cls: 'x-form-search-trigger',
                        weight: 1,
                        handler: 'onNavFilterSearchTriggerClick',
                        scope: 'controller',
                        border: false
                    }
                },

                listeners: {
                    change: 'onNavFilterFieldChange',
                    buffer: 300
                }
            }]
        }
    },

    list: {
        xtype: 'gridlist',
        store: {
            type: 'personnel'
        },
        columns: [{
                text: 'Name',
                dataIndex: 'name'
            },
            {
                text: 'Email',
                dataIndex: 'email',
                flex: 1
            },
            {
                text: 'Phone',
                dataIndex: 'phone',
                flex: 1
            }
        ],
        tbar: [{
            text: '创建',
            xtype: 'button',
            shadow: false,
            action:'create',
        }, {
            text: '编辑',

        }],
    }
});