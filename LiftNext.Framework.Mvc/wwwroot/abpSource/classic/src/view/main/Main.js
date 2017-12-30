/**
 * This class is the main view for the application. It is specified in app.js as the
 * "mainView" property. That setting automatically applies the "viewport"
 * plugin causing this view to become the body element (i.e., the viewport).
 *
 * TODO - Replace this content of this view to suite the needs of your application.
 */

Ext.define('abp.view.main.Main', {
    extend: 'Ext.container.Viewport',
    xtype: 'app-main',

    requires: [
        'abp.view.main.MainController',
        'abp.view.main.MainModel',
        'abp.view.main.List',
        'abp.view.main.Form',
        'abp.component.page.AppPage',
     
    ],

    controller: 'main',
    viewModel: 'main',
    layout: 'border',



    items: [{
            region: 'north',

            items: [{
                xtype: 'toolbar',
                style: 'background-color:#86BC40;',
                items: [{
                    xtype: 'tbtext',
                    style: 'color:white;font-weight:bold;font-size:18px;',
                    html: 'EAP-电梯行业高级管理平台'
                }, '->', {
                    xtype: 'button',
                    text: 'xuyanjun',
                    menu: [{
                        text: '许艳君',
                    }, {
                        text: '退出'
                    }]
                }]
            }],
            //margin: '3px 0px',
        }, {
            region: 'center',
            xtype: 'tabpanel',
            items: [{
                xtype: 'apppage',
                title:'heihei',
                items: [{
                    xtype: 'mainlist'
                }, {
                    xtype: 'mainform1'

                }]
            }]
        },
        {
            region: 'west',
            title: '左边树',
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
        }
    ]
});