Ext.data.field.Field.override({
    stype: 'string',
    stypefullname: 'System',
    index: 0, //列表中的显示顺序

    getSType: function() {
        var type = this.getType();
        var ctype = this.stype;
        if (this.name === 'Id') return 'BigInt';
        if (type === 'date') return 'DateTime';
        if (type === 'bool') return 'bool';

        if (type === 'int') {
            //if(this.ctype==='')
            if (Ext.isEmpty(ctype) || ctype === 'string') {
                return 'int';
            } else {
                return ctype;
            }
        }
        if (type === 'number') {
            //if(this.ctype==='')
            if (Ext.isEmpty(ctype) || ctype === 'string') {
                return 'float';
            } else {
                return ctype;
            }
        }
        if (type === 'string') {
            //maybe enum
            if (Ext.isEmpty(ctype)) {
                return 'string';
            }
            return ctype;
        }

        if (type === 'auto') {
            return ctype;
        }

        return 'auto';
    },

    constructor: function (config){
        //console.log(config);
        if(config.ref && config.stype==='asso'){
            if(!config.convert){
                var ref=config.ref;
                config.convert=function(v,rec){
                    
                    var newV= rec.get(ref);
                    //console.log('convert====>',newV,ref,rec);
                    return newV;
                }
            }
        }
        this.callParent([config]);
    }
});