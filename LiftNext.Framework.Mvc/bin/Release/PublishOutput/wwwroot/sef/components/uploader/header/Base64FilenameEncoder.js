Ext.define('sef.core.components.uploader.header.Base64FilenameEncoder', {
    extend: 'sef.core.components.uploader.header.AbstractFilenameEncoder',

    config: {},

    type: 'base64',

    encode: function (filename) {
        return window.btoa(unescape(encodeURIComponent(filename)));
    }
});