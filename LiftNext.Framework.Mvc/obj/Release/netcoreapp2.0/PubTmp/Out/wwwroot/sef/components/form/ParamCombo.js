//BoolComob.js

Ext.define('sef.core.components.form.ParamCombo', {
    extend: 'Ext.form.field.ComboBox',
    xtype: 'sef-paramcombo',
    editable:true,
    //tpl: '<tpl for="."><div class="" title="{Text}" ext:qtitle="title" ext:qtip="{Text} tip" >{Text}<img src="/assets/images/block-demo.png/"></div></tpl>',
    config: {
        url: '/GetParamOption',
        modelName: 'sef.app.liftnext.design.ParamModel',
        modelCode : null
    },

    listeners: {
        'expand': function (me) {
            var form = me.up('sef-formpanel');
            var ctl = form.down('#ELEN');
            if (ctl) {
                var id = form.recId;
                var model = ctl.getValue(); 
                if (!this.modelCode) this.modelCode = model;

                this.store.jsonData = {
                    ProjectItemID: id,
                    ModelCode: model,
                    ParamCode: me.name
                };
                var values = form.getForm().getValues();
                for (v in values) {
                    if (Ext.isArray(values[v])) {
                        values[v] = values[v].join('');
                    }
                }
                this.store.jsonData = Ext.merge(this.store.jsonData, values);
                this.store.reload();
                this.modelCode = model;
            }
        }
    },

    initComponent: function() {
        var me = this;
        Ext.apply(this, {
            displayField: 'Text',
            valueField: 'Text',
            store: {
                type: 'sef-store',
                autoLoad: false,
                url: me.url,
                model: me.modelName
            }
        });
        this.callParent(arguments);
    }
});