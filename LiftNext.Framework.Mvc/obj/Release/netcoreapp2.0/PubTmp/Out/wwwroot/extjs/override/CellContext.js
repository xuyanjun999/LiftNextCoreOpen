Ext.grid.CellContext.override({
    setRow: function(row){
        if(row===null)return;
        this.callParent(arguments);
    }
});