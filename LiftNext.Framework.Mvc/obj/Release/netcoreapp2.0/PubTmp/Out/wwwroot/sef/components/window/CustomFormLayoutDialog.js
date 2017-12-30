//ExportDialog

Ext.define('sef.core.components.window.CustomFormLayoutDialog', {
    extend: 'sef.core.components.window.BaseDialog',

    xtype: 'sef-customformlayout',
    //ui:'sefu-lockingwindow',

    title: _('自定义布局'),
    closable: true,
    width: 400,
    height: 400,
    iconCls: 'x-fa fa-list-alt',
    resizable: false,
    
    maximized: false,
    modal: true,

    //dynamicContent: true,
    showBar: false,
    layout: {
        type: 'vbox',
        align: 'stretch'
    },
    controller:'cfl-ctrl',

    config: {
        newLayout : false,
        //标记是否为
        layoutId: 0,
        //默认申请界面
        useType: -1,
        //选择布局
        selectLayout: false,

        companyId:0
    },
    
    makeTemplateBar: function() {
        var bar = {
            xtype: 'toolbar',
            items: [{
                xtype: 'combo',
                itemId:'layoutTemplate',
                reference:'layoutTemplate',
                editable: false,
                emptyText: '选择布局',
                displayField:'Text',
                valueField:'ID',
                queryMode: 'local',
                width: 150,
                store: Ext.create('Ext.data.Store', {
                    fields: ['Text', 'ID'],
                    proxy: {
                        type: 'memory'
                    },
                    data: []
                }),
                listeners:{
                    'change':'onLayoutTemplateChange'
                }
            }, '-', {
                xtype:'textfield',
                reference:'layoutName',
            }, {
                xtype: 'combo',
                itemId: 'layoutModule',
                reference: 'layoutModule',
                editable: false,
                emptyText: '模块',
                displayField: 'name',
                valueField: 'value',
                queryMode: 'local',
                width: 100,
                value: 0,
                store: Ext.create('Ext.data.Store', {
                    fields: ['name', 'value'],
                    proxy: {
                        type: 'memory'
                    },
                    data: [{
                        name: '申请',
                        value: 0
                    }, {
                        name: '设计',
                        value: 1
                        }, {
                            name: '审核',
                            value: 2
                        }]
                })
            }, {
                xtype: 'combo',
                itemId: 'layoutScope',
                reference: 'layoutScope',
                editable: false,
                emptyText: '适用',
                displayField: 'name',
                valueField: 'value',
                queryMode: 'local',
                width: 100,
                store: Ext.create('Ext.data.Store', {
                    fields: ['name', 'value'],
                    proxy: {
                        type: 'memory'
                    },
                    data: []
                })
            },'-', {
                text: '添加分组',
                btnType: 'link',
                handler: 'onAddGroup'
            }, {
                text: '删除分组',
                btnType: 'link',
                handler: 'onDeleteGroup'
            },{
                text: '保存布局',
                btnType: 'link',
                handler:'onSaveLayout'
            },{
                text: '设为默认',
                btnType: 'link',
                handler: 'onDefaultLayout'
            }, {
                text: '应用布局',
                btnType: 'link',
                handler: 'onApplyLayout'
            }]
        };

        return bar;
    },

    makeMainContext:function(){
        var c={
            xtype:'container',
            cls:'sef-cfl-container',
            itemId:'mainct',
            flex:1,
            layout:{
                type:'hbox',
                align:'stretch'
            },
            items:[{
                xtype:'dataview',
                scrollable: 'y',
                flex:.7,
                reference:'layoutview',
                itemId:'layoutview',
                deferEmptyText: false,
                emptyText: ['<ul class="tip">',
                '<li>先选择相应的布局模板</li>',
                '<li>从右侧的参数区将相关参数拖曳到左侧的布局区</li>',
                '<li>选择中左侧的布局区内的任意一个字段，按删除键可以删除</li>',
            '</ul>'].join(''),
                
                store:Ext.create('Ext.data.Store',{
                    fields:['Text','Code','Type','Group','Index','CW','CWP','Hold','Xtype','clsType'],
                    data:[]
                }),
                itemSelector: 'div.field-place',
                listeners:{
                    itemkeydown:'onViewItemKeyDown'
                },
                tpl:[
                    '<div class="sef-cfl-view">',
                        '<tpl for=".">',
                            '<tpl if="Type==0">',
                                '<div class="group-title">{GroupText}</div>',
                            '</tpl>',
                            '<div class="field-place" style="width:{CWP}%;{Hold}">',
                                '<tpl if="Hold==true">',
                                    '<div class="field"><i class="fa {clsType}"></i>&nbsp;占位符</div>',
                                '<tpl else>',
                                    '<div class="field"><i class="fa {clsType}"></i>&nbsp;{Text}[{Code}]</div>',
                                '</tpl>',
                            '</div>',
                           
                        '</tpl>',
                    '</div>'
            ]
            
            },{
                xtype:'container',
                flex:.3,
                //layout:'fit',
                layout: {
                    type: 'vbox',
                    align : 'stretch',
                    pack: 'start',
                },
                cls:'psview-ct',
                items: [{
                    xtype:'dataview',
                    flex: .3,
                    scrollable: 'y',
                    reference:'allpsview',
                    itemId:'allpsview',
                    emptyText:'没有参数',
                    deferEmptyText:false,
                    store:Ext.create('Ext.data.Store',{
                        fields: ['Text', 'Code', 'CW', 'Xtype', 'clsType'],
                        _data:[]
                    }),
                    tpl:[
                        '<tpl for=".">',
                            '<div class="param"><i class="fa {clsType}"></i>&nbsp;{Text}[{Code}]</div>',
                        '</tpl>'
                    ],
                    itemSelector: 'div.param'
                }]
            }]
        };

        return c;
    },

    makeItems: function() {
        var items = [];
        items.push(this.makeTemplateBar());
        items.push(this.makeMainContext());

        return items;

        this.suspendLayout = true;
        this.add(items);
        this.suspendLayout = false;
        this.updateLayout();
    },

    initComponent: function() {

        Ext.apply(this, {
            items: this.makeItems()
        });

        this.callParent(arguments);

        //this.down('#layoutpanel').setData(this._mockData);
        //this.initDialog();
    },

    

    afterRender: function() {
        this.callParent(arguments);

        var template = this.down('#layoutTemplate');
        //新增布局无需加载现有布局
        if (this.newLayout === true) {
            var result = [{
                Text: '默认布局',
                ID: 0
            }];
            var store = template.getStore();
            store.loadData(result, false);
            template.select(store.getAt(0));
            template.setDisabled(true);
        }
        else if (this.layoutId === 0 || this.selectLayout === true){
            sef.utils.ajax({
                url: '/MyLayout/GetMyLayouts',
                method: 'POST',
                paramAsJson: true,
                jsonData: {
                    layoutId: this.layoutId,
                    useType: this.useType
                },
                success: function (result) {
                    var store = template.getStore();
                    store.loadData(result, false);
                    template.select(store.getAt(0));
                },
                failure: function (err, resp) {
                    sef.dialog.error(err.message);
                    console.log('error', err);
                }
            });
        }
        else {
            sef.utils.ajax({
                url: '/MyLayout/GetMyLayout',
                method: 'POST',
                paramAsJson: true,
                jsonData: {
                    layoutId: this.layoutId
                },
                success: function (result) {
                    var store = template.getStore();
                    store.loadData([result], false);
                    template.select(store.getAt(0));
                    //template.setDisabled(true);
                },
                failure: function (err, resp) {
                    sef.dialog.error(err.message);
                    console.log('error', err);
                }
            });
        }

        var scope = this.down('#layoutScope');
        var result = [{
            name: '所有人',
            value: 0
        }, {
            name: '自己',
            value: 1
        }];
        var store = scope.getStore();
        store.loadData(result, false);
        scope.select(store.getAt(0));

        if (this.useType !== -1) {
            var module = this.down('#layoutModule');
            module.setDisabled(true);
        }
    }
});