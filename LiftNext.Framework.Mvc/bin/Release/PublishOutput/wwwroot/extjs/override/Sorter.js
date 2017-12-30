Ext.util.Sorter.override({
    serialize: function () {
        return {
            FieldName: this.getProperty(),
            Asc: this.getDirection()==='ASC'
        };
    }
});