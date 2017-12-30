Ext.button.Button.override({
    initComponent: function () {
        var me = this;
        me.style = me.style || "";
        me.style = me.style+';-webkit-box-shadow: none;box-shadow: none;';
        this.callParent();
    }
});