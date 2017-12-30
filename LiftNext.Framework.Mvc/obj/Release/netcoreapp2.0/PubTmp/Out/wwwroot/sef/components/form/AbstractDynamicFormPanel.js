//AbstractDynamicFormPanel

Ext.define('sef.core.components.form.AbstractDynamicFormPanel',{
    extend: 'Ext.form.Panel',
    //xtype: 'sef-formpanel',
    scrollable: 'y',
    bodyPadding: '0 10px 20px 10px',

    config:{

    },

    initComponent:function(){
        return this.callParent(arguments);
    }
    //cls: 'sef-formpanel',
});