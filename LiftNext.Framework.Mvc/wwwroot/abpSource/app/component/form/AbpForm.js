Ext.define('abp.component.form.AbpForm', {
    extend: 'Ext.form.Panel',
    xtype:'abpform',
    config: {
        formPage:null,
        needBackBtn: true
    },
    requires: [
        'abp.component.form.AbpFormCtl'
    ],
    controller:'abpformctl',

    makeTbar: function () {
        var me = this;
        var tbar = me.tbar || [];
        if (me.needBackBtn) {
            tbar.push({
                text: '返回',
                action: 'back'
            });
        }
        return tbar;
    },

    makeForm: function () {
        var me=this;
        var cfg={};
        Ext.apply(cfg,{
            tbar:me.makeTbar()
        });
        return cfg;
    },

    initComponent: function () {
        var me = this;
        Ext.apply(me, me.makeForm());
        me.callParent();

    }
})