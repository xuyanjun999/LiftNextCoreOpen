//ExportDialog

Ext.define('sef.core.components.window.AdvSearchDialog', {
    extend: 'sef.core.components.window.BaseDialog',

    xtype: 'sef-advsearchdialog',
    //ui:'sefu-lockingwindow',

    title: _('高级搜索'),
    closable: false,
    width: 600,
    height: 400,
    iconCls: 'x-fa fa-filter',
    bodyPadding: 20,
    layout: {
        type: 'vbox',
        align: 'stretch'
    },
    scrollable: 'y',

    config: {
        model: null,
        advSearch: null,
        allowCustomSearch: true,
        labelWidth: 80
    },

    okText: _('搜索'),
    cancelText: _('关闭'),
    _modelMeta: null,
    _searchingFields: [],
    _customSearchingFieldMeta: [],


    makeSearchFieldInfo: function(f) {
        var field = {},
            mf = null;
        if (Ext.isString(f)) {
            mf = Ext.Array.findBy(this._modelMeta, function(mm) {
                return mm.name === f;
            });
            if (mf) {
                field = {
                    //xtype:'textfield',
                    fieldLabel: mf.text
                };
            } else {
                field = {
                    name: f
                };
            }
        } else {
            Ext.apply(field, f || {});
            mf = Ext.Array.findBy(this._modelMeta, function(mm) {
                return mm.name === f.name;
            });

            field = Ext.merge({}, f);

            Ext.applyIf(field, {
                fieldLabel: mf && mf.text
            });
        }

        if (mf) {
            Ext.applyIf(field, {
                name: mf.name
            });
        }
        this._searchingFields.push(field.name);
        return { field: field, meta: mf };

    },

    makeSearchItemFieldConfig: function(field, mf) {
        var type = '';
        if (mf) {
            type = mf.type.toLowerCase();
        }
        //var fc = { xtype: 'textfield' };
        //var cfg = { type: type };
        var fc = { type: type, name: field.name };
        //console.log(field.name,type);
        switch (type) {
            case 'bool':
            case 'boolean':
                fc['xtype'] = 'sef-boolcombo';
                fc['ops'] = ['==', '!='];
                break;
            case 'int':
            case 'bigint':
                fc['xtype'] = 'sef-rangefield';
                fc['rtype'] = 'numberfield';
                fc['rname']='rangefield',
                fc['ops'] = ['==', '!=', '>', '>=', '<', '<='];
                fc['fieldDefaults'] = {
                    allowDecimals: false
                };
                break;
            case 'float':
            case 'double':
            case 'decimal':
                fc['xtype'] = 'sef-rangefield';
                fc['rtype'] = 'numberfield';
                fc['rname']='rangefield',
                fc['ops'] = ['==', '!=', '>', '>=', '<', '<='];
                break;
            case 'datetime':
            case 'date':
            case 'time':
                fc['ops'] = ['==', '!=', '>', '>=', '<', '<='];
                fc['xtype'] = 'datefield';
                break;
            case 'enum':
                fc['ops'] = ['==', '!='];
                fc['xtype'] = 'sef-enumcombo';
                fc['enumType'] = mf.sassb;
                break;
            default:
                fc['ops'] = ['==', '!=', 'like'];
                break;
        }



        //console.log(field, fc);
        return fc;
    },

    getSearchItemOperator: function(field, fc, notForCfg) {
        var combo = {
            xtype: 'combo',
            width: 80,
            name: field.name + '__op',
            displayField: 'display',
            valueField: 'value',
            editable: false,
            listeners: {
                'afterrender': function(c) {
                    //console.log('will do select');
                    c.select(c.getStore().getAt(0));
                }
            }
        };
        var ops = field.ops || fc.ops;
        delete fc.ops; //remove
        if (notForCfg !== false) {
            Ext.apply(combo, {
                store: Ext.create('Ext.data.Store', {
                    fields: ['display', 'value'],
                    data: this.getOperatorData(ops)
                })
            });
        } else {
            Ext.apply(combo, {
                store: {
                    fields: ['display', 'value'],
                    data: this.getOperatorData(ops)
                }
            });
        }

        //console.log(combo, ops);
        return combo;
    },

    getOperatorData: function(data) {
        //var me=this;
        return Ext.Array.map(data, function(d) {
            return { display: d, value: sef.runningCfg.searchOperator[d] };
        });
    },



    makeSearchItemField: function(f) {
        var info = this.makeSearchFieldInfo(f);
        var field = info.field;
        var mf = info.meta;
        var text = field.fieldLabel;
        field.fieldLabel = '';

        var cfg = this.makeSearchItemFieldConfig(field, mf);
        var items = [];
        items.push({
            xtype: 'box',
            //cls:'',
            html: '<div class="sef-advsearch-label">' + text + '</div>',
            //align:'right',
            width: this.labelWidth
        });

        items.push(this.getSearchItemOperator(field, cfg));

        items.push({
            xtype: 'box',
            width: 5
        });

        var ff = { flex: 1, xtype: 'textfield' }; //,margin:'0 10 0 0'};
        Ext.apply(ff, field.xtype ? field : cfg);
        //return f;
        if(ff['rname']){
            ff['rname']=field.name+'__range';
        }
        items.push(ff);

        return {
            xtype: 'fieldcontainer',
            layout: {
                type: 'hbox',
                align: 'stretch'
            },
            //margin:'0 10 0 0',
            items: items
        }


    },

    makeItems: function() {
        var me = this,
            items = [];
        this.advSearch.forEach(function(f) {
            items.push(me.makeSearchItemField(f));
        });
        if (me.allowCustomSearch !== false) {
            //add operator
            items.push({
                xtype: 'container',
                layout: {
                    type: 'hbox',
                    align: 'stretch'
                },
                items: [{
                    xtype: 'box',
                    flex: 1
                }, {
                    margin: '0 0 0 5px',
                    xtype: 'button',
                    btnType: 'link',
                    text: _('添加自定义搜索'),
                    handler: function() {
                        me.addCustomSearchItems();
                    }
                }]
            });
        }
        return items;
        //console.log(items);
    },

    initCustomFilterFieldData: function() {
        var me = this; //,validFields=[];
        if (this._customSearchingFieldMeta.length < 1) {
            this._modelMeta.forEach(function(mf) {
                if (mf.invisible === true) return;
                var searchingField = Ext.Array.findBy(me._searchingFields, function(mm) {
                    return mm === mf.name;
                });
                if (!searchingField) {
                    //validFields.push(mf)
                    //console.log('will be searching#',mf.name,mf);
                    //var info = this.makeSearchFieldInfo(mf.name);
                    var field = {
                        name: mf.name,
                        text: mf.text
                    };
                    var cfg = me.makeSearchItemFieldConfig(field, mf);
                    field.operator = me.getSearchItemOperator(field, cfg, false);
                    var ff = { flex: 1, xtype: 'textfield' }; //,margin:'0 10 0 0'};
                    Ext.apply(ff, field.xtype ? field : cfg);
                    field.field = ff;
                    me._customSearchingFieldMeta.push(field);

                }
            });
        }


        //console.log(this._customSearchingFieldMeta);

    },

    onCustomSearchFieldChange: function(itemId, fieldName) {

        var cbOP = this.down('#' + itemId + '__op');
        cbOP.reset();
        var meta = Ext.Array.findBy(this._customSearchingFieldMeta, function(mf) {
            return mf.name === fieldName;
        });
        //console.log(meta);
        var data = meta.operator.store.data;
        var store = cbOP.getStore();
        store.loadData(data);
        //store.reload();
        cbOP.select(store.getAt(0));

        var fc = this.down('#' + itemId);
        var field = fc.down('#' + itemId + '__value');
        //console.log(fc,field);
        fc.suspendLayout = true;
        //debugger;
        fc.remove(field, true);
        delete field;
        //return;

        field = Ext.merge({}, meta.field);
        Ext.apply(field, {
            name: itemId + '__value',
            itemId: itemId + '__value'
        });
        if(field['rname']){
            field['rname']=itemId+'__range';
        }
        fc.add(field);
        fc.suspendLayout = false;
        fc.updateLayout();
        //fc.add(meta.field)
        //change key field
    },

    addCustomSearchItems: function() {
        this.initCustomFilterFieldData();
        //search_form
        var me = this,
            itemId = Ext.id(null, 'customer_search_item');
        var fieldData = Ext.Array.map(me._customSearchingFieldMeta, function(f) {
            return {
                display: f.text,
                value: f.name
            };
        });
        //console.log(fieldData);
        var items = [{
            xtype: 'button',
            btnType: 'link',
            text: _('移除'),
            handler: function() {
                var form = me.down('#search_form');
                var fc = form.down('#' + itemId);
                form.suspendLayout = true;
                //debugger;
                form.remove(fc, true);
                delete fc;
                fc = null;
                form.suspendLayout = false;
                form.updateLayout();
                //me.removeCustomSearch(itemId);
            }
        }, {
            xtype: 'box',
            width: 5
        }, {
            xtype: 'combo',
            emptyText: _('字段'),
            width: this.labelWidth+50,
            displayField: 'display',
            valueField: 'value',
            editable: false,
            name: itemId + '__field',
            itemId:itemId+'__field',
            store: Ext.create('Ext.data.Store', {
                fields: ['display', 'value'],
                data: fieldData
            }),
            listeners: {
                'afterrender': function(c) {
                    //console.log('will do select');
                    //c.select(c.getStore().getAt(0));
                },
                'change': function(cb, newValue) {
                    //console.log('field will be changing#', newValue);
                    me.onCustomSearchFieldChange(itemId, newValue);

                }

            }
        }, {
            xtype: 'box',
            width: 5
        }, {
            xtype: 'combo',
            emptyText: _('操作'),
            width: 80,
            displayField: 'display',
            valueField: 'value',
            editable: false,
            name: itemId + '__op',
            itemId: itemId + '__op',
            store: Ext.create('Ext.data.Store', {
                fields: ['display', 'value'],
                proxy: {
                    type: 'memory'
                },
                data: []
            }),
            listeners: {
                'afterrender': function(c) {
                    //console.log('will do select');
                    //c.select(c.getStore().getAt(0));
                },
                'change': function(cb, newValue) {
                    //console.log('op will be changing#', newValue);
                }

            }
        }, {
            xtype: 'box',
            width: 5
        }, {
            xtype: 'textfield',
            name: itemId + '__value',
            itemId: itemId + '__value',
            flex: 1
        }];

        var form = this.down('#search_form');
        form.suspendLayout = true;
        form.add({
            xtype: 'fieldcontainer',
            itemId: itemId,
            layout: {
                type: 'hbox',
                align: 'stretch'
            },
            items: items,
            listeners: {
                afterrender: function() {
                    var cbField = me.down('#' + itemId + '__field');
                    cbField.select(cbField.getStore().getAt(0));

                }
            }
        });
        form.suspendLayout = false;
        form.updateLayout();
    },



    initComponent: function() {
        this._modelMeta = sef.utils.getModelMeta(this.model);
        if (!Ext.isArray(this._modelMeta)) {
            this._modelMeta = [];
        }
        this.makeItems();
        //debugger;
        Ext.apply(this, {
            //items: this.makeSearchItems()
            items: {
                xtype: 'form',
                itemId: 'search_form',
                layout: 'column',
                margin: '10 0 0 0',
                defaults: {
                    columnWidth: 1, //this.columnWidth,
                    margin: '0 10px 10px 0',
                    labelSeparator: '  ',
                    labelAlign: 'right',
                    labelWidth: this.labelWidth
                },
                items: this.makeItems()
            }
        });

        this.callParent(arguments);
        //console.log('adv.filter#',this.model);
        //this.initDialog();
    },

    onBeforeCloseDialog:function(){
        var form = this.down('#search_form').getForm();
        //console.log('advSearch#',form.getFieldValues());//getValues());
        var searchValues = form.getFieldValues();
        //debugger;
        var vvs={};
        //console.log(searchValues);

        //pre process custom search
        var customSearch={};
        //debugger;
        for(var sv in searchValues){
            if(/^customer_search_item/.test(sv)){
                var prefix=/^customer_search_item.*?__/.exec(sv)[0];
                customSearch[prefix]={};
            }
        }
        //debugger;
        for(sv in customSearch){
            var op=searchValues[sv+'op'];
            var field=searchValues[sv+'field'];
            var value=searchValues[sv+'value'];
            searchValues[field]=value;
            searchValues[field+'__op']=op;
            if(searchValues.hasOwnProperty(sv+'range_r1')){
                var r1=searchValues[sv+'range_r1'];
                var r2=searchValues[sv+'range_r2'];
                searchValues[field+'_r1']=r1;
                
                searchValues[field+'_r2']=r2;
                delete searchValues[sv+'range_r1'];
                delete searchValues[field];//r1和r2出现时，原生的value必须被清除
                delete searchValues[sv+'range_r2'];
                //delete searchValues[field];
            }
            
            delete searchValues[sv+'op'];
            delete searchValues[sv+'field'];
            delete searchValues[sv+'value'];
        }
        //debugger;
        for (var sv in searchValues) {
            if(/__op$/.test(sv)){
                var name=sv.replace('__op','');
                if(!vvs[name]){
                    vvs[name]={
                        FieldName:name,
                        Rel:'And'
                    };
                }
                vvs[name]['Operator']=searchValues[sv];
            }else{
                var newSv=sv;
                if(/_r\d$/.test(sv)){
                    //process
                    newSv=sv.replace(/_r\d$/,"");
                    //isRange=true;
                }
                if(!vvs[newSv]){
                    vvs[newSv]={
                        FieldName:newSv,
                        Rel:'And'
                    };
                }
                var v=searchValues[sv];
                if(v){
                    //if(vvs[name])
                    if(!vvs[newSv]['Values']){
                        vvs[newSv]['Values']=[];
                    }
                    vvs[newSv]['Values'].push(v);
                }
                //searchValues[sv];
            }
            /*
            if (searchValues[sv]) {
                hasValue = true;
                break;
            }*/
        }

        

        var result=[];
        for(var s in vvs){
            if(vvs[s].Values){
                result.push(vvs[s]);
            }
        }
        this._dialogResult=result;
        //console.log(searchValues,vvs,result);
        return true;
    }
});