Ext.window.MessageBox.override({
    minWidth: 320,
    ui: 'sefu-dialog',
    buttonIds: [
        'no', 'cancel', 'ok', 'yes'
    ],
    OK : 4,//1,
    YES :8,// 2,
    NO : 1,//4,
    CANCEL :2,// 8,
    SUCCESS: Ext.baseCSSPrefix + 'message-box-success',
    //:
    makeButton: function(btnIdx) {
        var btn = this.callParent(arguments);
        if (btnIdx<2) {
            btn.setUI('sefu-btn-default');

        }
        return btn;
    },

    reconfigure: function(cfg) {
        var c = this.callParent(arguments);
        this.defaultFocus = this.msgButtons[this.msgButtons.length - 1];
        //console.log(this.defaultFocus);
        return c;
    },

    initComponent: function() {
        Ext.apply(this, {


        });
        this.callParent(arguments);
        var layout = this.bottomTb.getLayout();
        //console.log(this.bottomTb,layout.getPack(),layout);
        layout.setPack('end');
        this.topContainer.padding = '10px 15px 20px 15px';
        this.bottomTb.setUI('sefu-dialog-toolbar');
    }
});