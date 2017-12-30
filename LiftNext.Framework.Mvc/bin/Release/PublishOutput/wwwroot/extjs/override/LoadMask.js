//
Ext.LoadMask.override({
    _renderTpl: [
        '<div id="{id}-msgWrapEl" data-ref="msgWrapEl" class="{[values.$comp.msgWrapCls]}" role="presentation">',
        '<div id="{id}-msgEl" data-ref="msgEl" class="{[values.$comp.msgCls]} ',
        Ext.baseCSSPrefix, 'mask-msg-inner {childElCls}" role="presentation">',
        '<div id="{id}-msgTextEl" data-ref="msgTextEl" class="',
        Ext.baseCSSPrefix, 'mask-msg-text',
        '{childElCls}" role="presentation"><div>loading</div>{msg}###</div>',
        '</div>',
        '</div>'
    ],
    initComponent: function() {
        //console.log('will override loadMask');
        //debugger;
        this.callParent(arguments);
    }
});