//BoolComob.js

Ext.define('sef.core.components.form.FixedCombo', {
    extend: 'Ext.form.field.ComboBox',
    xtype: 'sef-fixedcombo',
    editable:false,

    config: {
        values:[""]
    },

    initComponent: function() {
        //this.debug(arguments);
        //window.sef_static_data.SEF_Core_Common_TestEnum
        var data = [];
        this.values.forEach(function (f) {
            data.push({
                Text: f,
                Value: f
            });
        });
        Ext.apply(this, {
            displayField: 'Text',
            valueField: 'Value',
            store: Ext.create('Ext.data.Store', {
                fields: ['Text', 'Value'],
                data: data
            })
        });

        this.callParent(arguments);
    }
});