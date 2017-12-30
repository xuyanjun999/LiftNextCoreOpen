//FormPage.js

Ext.define('sef.app.liftnext.lift.LiftView', {
    extend: 'Ext.container.Container',
    vname: 'view',
    //requires:['sef.core.interfaces.IAppPage'],
    mixins: ['sef.core.interfaces.IAppPage'],
    xtype: 'sef-liftview',
    controller: 'sefc-pagectrl',
    scrollable:'y',


    initComponent: function() {
        this.beforeReady();
        this.store.load();
        //console.log('will loaded..........................', this.store);
        Ext.apply(this, {
            items: {
                store:this.store,
                xtype: 'dataview',
                itemSelector: 'div.block-view',
                cls:'block-view-container',
                tpl: new Ext.XTemplate(
                    '<tpl for=".">',
                    '<div class="block-view">',
                    '<div class="thumb">',
                    '<tpl if="Thumbnail">',
                    '<img src="{Thumbnail}" />',
                    '<tpl else>',
                    '<img src="/assets/images/lift-demo.jpg" />',
                    '</tpl>',
                    '</div>',
                    '<div class="desc">',
                    '<ul>',
                    '<li><span class="key">名　　称</span><span class="value">{Name}</span>',
                    '<li><span class="key">代　　码</span><span class="value">{Code}</span>',
                    '<li><span class="key">发布日期</span><span class="value">{[this.getDate(values)]}</span>',
                    '<li><span class="key">引用次数</span><span class="value">0</span>',
                    '<li><span class="key">描　　述</span><span class="value">{Desc}</span>',
                    '</ul>',
                    '</div>',
                    '</div>',
                    '</tpl>'
                ,
                    {
                        disableFormats:true,
                        getDate: function (values) {
                            var d = values['CreateDate'];
                            return Ext.util.Format.date(d, 'm/d/Y');
                        }
                    })
            }
        });

        this.callParent(arguments);
        //console.log('store',this.store);

    }

});