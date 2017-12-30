Ext.define('sef.core.view.VerticalDropZone', {
    extend: 'Ext.view.DropZone',

    xgap:5,
    //indicatorHtml: '|',


    getIndicator: function() {
        var me = this;

        if (!me.indicator) {
            me.indicator = new Ext.Component({
                ariaRole: 'presentation',
                html: '<div class="sef-drop-zone-indicator"></div>',
                //cls: me.indicatorCls,
                ownerCt: me.view,
                floating: true,
                alignOnScroll: false,
                shadow: false
            });
        }
        //console.log(me.indicator);
        return me.indicator;
    },


    positionIndicator: function(node, data, e) {
        var me = this,
            view = me.view,
            pos = me.getPosition(e, node),
            overRecord = view.getRecord(node),
            draggingRecords = data.records,
            indicatorY,indicatorX;

        if (!Ext.Array.contains(draggingRecords, overRecord) && (
                pos === 'before' && !me.containsRecordAtOffset(draggingRecords, overRecord, -1) ||
                pos === 'after' && !me.containsRecordAtOffset(draggingRecords, overRecord, 1)
            )) {
            me.valid = true;

            if (me.overRecord !== overRecord || me.currentPosition !== pos) {
                //debugger;
                //console.log('indicator.node#',node,Ext.fly(node).getHeight(),me.getIndicator());
                indicatorY = Ext.fly(node).getY() - view.el.getY() -1;
                indicatorX=Ext.fly(node).getX()-view.el.getX()-1;
                if (pos === 'after') {
                    //indicatorY += Ext.fly(node).getHeight();
                    indicatorX+=Ext.fly(node).getWidth()+me.xgap;
                }
                

                me.getIndicator().setHeight(Ext.fly(node).getHeight()).showAt(indicatorX, indicatorY);

                // Cache the overRecord and the 'before' or 'after' indicator. 
                me.overRecord = overRecord;
                me.currentPosition = pos;
            }
        } else {
            me.invalidateDrop();
        }
    },

    onNodeDrop: function(targetNode, dragZone, e, data) {
        console.log('nodeDrop#',targetNode,dragZone,e,data);
        return this.callParent(arguments);
    }       
        
});