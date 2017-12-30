//Searchbar.js

Ext.define('sef.core.components.bar.SearchBar', {
    extend: 'Ext.container.Container',
    xtype: 'sef-searchbar',
    cls: 'sef-searchbar',
    layout: {
        type: 'vbox',
        align: 'stretch'
    },
    model: null,
    searchItems: null,
    //layout:'column',
    columnWidth: 0, //.33333,
    labelWidth: 80,
    padding: '5 10 5 10',

    viewModel: {
        data: {
            simple_search: true
        }
    },

    makeAdvSearchItemCfg: function(field, mf) {
        var type = '';
        if (mf) {
            type = mf.type.toLowerCase();
        }
        //var fc = { xtype: 'textfield' };
        //var cfg = { type: type };
        var fc = { type: type, name: field.name };

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
                fc['ops'] = ['==', '!=', '>', '>=', '<', '<=', 'like'];
                break;
        }



        //console.log(field, fc);
        return fc;

        //Ext.apply(field, fc);
    },

    makeOpData:function(data){
        //var me=this;
        return Ext.Array.map(data,function(d){
            return {display:d,value:sef.runningCfg.searchOperator[d]};
        });
    },

    makeSearchItemOps: function(field, fc) {
        var combo = {
            xtype: 'combo',
            width: 80,
            name: field.name + '__op',
            displayField:'display',
            valueField:'value',
            editable:false,
            listeners:{
                'afterrender':function(c){
                    //console.log('will do select');
                    c.select(c.getStore().getAt(0));
                }
            }
        };
        var ops = field.ops || fc.ops;
        delete fc.ops; //remove
        Ext.apply(combo, {
            store: Ext.create('Ext.data.Store', {
                fields:['display','value'], 
                data:this.makeOpData(ops)
             })
        });
        //console.log(combo, ops);
        return combo;
    },

    makeSearchItemField:function(field,fc){
        var f={flex:1,xtype:'textfield'};//,margin:'0 10 0 0'};
        Ext.apply(f,field.xtype?field:fc);
        return f;
    },

    makeAdvSearchItem: function(field, mf) {
        var text = field.fieldLabel;
        field.fieldLabel = '';
        var cfg = this.makeAdvSearchItemCfg(field, mf);
        var sitems = [];
        sitems.push({
            xtype: 'box',
            //cls:'',
            html: '<div class="sef-advsearch-label">'+text+'</div>',
            //align:'right',
            width: 80
        });
        sitems.push(this.makeSearchItemOps(field, cfg));

        sitems.push({
            xtype: 'box',
            width: 5
        });
        sitems.push(this.makeSearchItemField(field,cfg));
        //sitems.push(field);
        return {
            xtype: 'fieldcontainer',
            layout: {
                type: 'hbox',
                align: 'stretch'
            },
            //margin:'0 10 0 0',
            items: sitems
        }
    },

    makeAdvSearchItems: function() {
        var me = this,
            items = [];

        if (!this.searchItems) this.searchItems = [];
        var modelMeta = sef.utils.getModelMeta(this.model);
        //var fmtItems=[];
        this.searchItems.forEach(function(f) {
            var field = null,
                mf = null;
            if (Ext.isString(f)) {
                mf = Ext.Array.findBy(modelMeta, function(mm) {
                    return mm.name === f;
                });
                if (mf) {
                    field = {
                        //xtype:'textfield',
                        fieldLabel: mf.text
                    };
                }else{
                    field={
                        name:f
                    };
                }
            } else {
                mf = Ext.Array.findBy(modelMeta, function(mm) {
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

            //console.log(field);
            items.push(me.makeAdvSearchItem(field, mf));
        });



        items.push({
            columnWidth: 1,
            xtype: 'container',
            layout: {
                type: 'hbox',
                align: 'middle',
                pack: 'end'
            },
            items: [{
                xtype: 'button',
                btnType: 'primary',
                text: _('搜  索'),
                handler: function() {
                    me.onAdvSearch();
                }
            }, {
                xtype: 'button',
                text: _('清  空'),
                btnType: 'default',
                margin: '0 0 0 5px',
                handler: function() {
                    me.onClearSearch();
                }
            }, {
                margin: '0 0 0 5px',
                xtype: 'button',
                btnType: 'link',
                text: _('简易搜索'),
                handler: function() {
                    me.switchSearchMode(true);
                }
            }]
        });

        //console.log(items);

        return items;


    },

    switchSearchMode: function(forSimple) {
        this.getViewModel().setData({
            simple_search: forSimple
        });
    },

    makeSimpleSearch: function() {
        var me = this;
        return {
            xtype: 'container',
            hidden: true,
            bind: {
                hidden: '{!simple_search}'
            },
            layout: {
                type: 'hbox',
                align: 'middle',
                pack: 'end'
            },
            items: [{
                xtype: 'sef-searchfield',
                emptyText: _('快速查询'),
                minWidth: 250,
                listeners: {
                    scope: me,
                    'quicksearch': me.onQuickSearch
                }
            }, {
                xtype: 'button',
                btnType: 'link',
                margin: '0 0 0 5px',
                text: _('高级查询'),
                hidden: !me.searchItems,
                handler: function() {
                    me.switchSearchMode(false);
                }
            }]
        }
    },

    makeAdvSearch: function() {
        var r= {
            xtype: 'form',
            itemId: 'search_form',
            layout: 'column',
            hidden: true,
            bind: {
                hidden: '{simple_search}'
            },
            margin: '10 0 0 0',
            defaults: {
                columnWidth: this.columnWidth,
                margin: '0 10px 10px 0',
                labelSeparator: '  ',
                labelAlign: 'right',
                labelWidth: this.labelWidth
            },
            items: this.makeAdvSearchItems()

        };

        //console.log(Ext.merge({},r));
        return r;
    },

    makeItems: function() {
        var items = [this.makeSimpleSearch(), this.makeAdvSearch()];
        return items;
    },

    onQuickSearch: function(v) {
        //console.log('will be quicksearch#',v,this);
        this.fireEvent('search', v);
    },

    onClearSearch: function() {
        var form = this.down('#search_form');
        form.reset();
        var combs=this.query('combo');
        if(combs){
            combs.forEach(function(c){
                c.select(c.getStore().getAt(0));
            });
        }
        //var combo=this.down('')
    },

    onAdvSearch: function() {
        //console.log('will do adv search#');
        var form = this.down('#search_form').getForm();
        //console.log('advSearch#',form.getFieldValues());//getValues());
        var searchValues = form.getFieldValues();
        //debugger;
        var vvs={};
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
                if(!vvs[sv]){
                    vvs[sv]={
                        FieldName:sv,
                        Rel:'And'
                    };
                }
                var v=searchValues[sv];
                if(v){
                    vvs[name]['Values']=[v];
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
        //console.log('searching###',result,result.length);
        this.fireEvent('search', result.length>0 ? result : null,true);
    },


    initComponent: function() {
        if (this.searchItems && this.columnWidth <= 0) {
            if (this.searchItems.length < 6) {
                this.columnWidth = .5;
            } else {
                this.columnWidth = 1 / 3;
            }
        }
        //console.log('cw#',this.columnWidth);
        Ext.apply(this, {
            items: this.makeItems()
        });
        this.callParent(arguments);
    }
});