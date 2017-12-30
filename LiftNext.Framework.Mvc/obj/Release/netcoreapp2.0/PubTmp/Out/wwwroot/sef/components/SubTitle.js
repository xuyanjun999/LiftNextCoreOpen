//SubTitle

Ext.define('sef.core.components.SubTitle', {
    extend: 'Ext.Component',
    xtype: 'sef-subtitle',
    config: {
        title: '',
        //icon: '',
        icon:'fa-th-large',
        scale:'normal'//large
    },
    padding:'10px 0',


    initComponent: function() {
        Ext.apply(this, {
            data: {
                title: this.title,
                icon:this.icon,
                scale:this.scale
            },
            tpl: [
                    '<div class="sef-subtitle {scale}">',
                        '<div class="text">{title}</div>',
                    '</div>'
                ]
                //html:'here is subline'
        });

        this.callParent(arguments);
    }
});