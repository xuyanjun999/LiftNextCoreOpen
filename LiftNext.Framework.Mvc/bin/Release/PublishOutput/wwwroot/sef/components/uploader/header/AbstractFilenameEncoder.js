/**
 * Abstract filename encoder.
 */
Ext.define('sef.core.components.uploader.header.AbstractFilenameEncoder', {

    config : {},

    type : 'generic',

    encode : function(filename) {},

    getType : function() {
        return this.type;
    }
});