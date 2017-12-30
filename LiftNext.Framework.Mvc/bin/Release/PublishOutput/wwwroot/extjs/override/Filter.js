

Ext.util.Filter.override({
    getState: function () {
        //debugger;
        var result = {};
        var v = this.getValue();
        if (!Ext.isArray(v)) {
            v = [v];
        }
        result['FieldName'] = this.config['property'];
        result['Values'] = v;
        result['FType'] = this.config.ftype;
        result['Rel'] = this.config.rel;//===true?'And':'Or';
        result['Operator'] = this.config.operator;
        result['GroupID'] = this.config.groupId;
        //debugger;
        return result;
    }

});

