//CatelogTree.js

Ext.define('sef.core.components.tree.Timeline', {
    extend: 'Ext.view.View',
    xtype: 'sef-timeline',
    cls: 'sef-timelinetree',

    tpl: [
        '<ul class="sef-timeline">',
            '<tpl for=".">',
                //'<li class="{[xindex===xcount?"timeline-item  timeline-item-last":"timeline-item"]}">',
                '<li class="{itemCls}">',
                    '<div class="timeline-item-tail"></div>',
                    '<div class="timeline-item-head timeline-item-head-gray timeline-item-head-{color}"></div>',
                    '<div class="timeline-item-content">{text}</div>',
                '</li>',
            '</tpl>',
        '</ul>'        
    ],
    store:Ext.create('Ext.data.Store',{
        fields:['index','text','color','lastColor','itemCls'],
        data:[]
    }),

    itemSelector: 'li',

    fillData:function(data){
        if(Ext.isArray(data)){
            var c=data.length;
            data.forEach(function(item,index){
                item.color=item.color?item.color:'gray';
                item.itemCls=index<c-1?'timeline-item':'timeline-item timeline-item-last'
            });
        }
        this.getStore().loadData(data,false);
    },

    initComponent: function() {
        

        this.callParent(arguments);
        
    }
});