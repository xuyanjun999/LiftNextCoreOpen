//Avatar.js


Ext.define('sef.core.components.uploader.Avatar', {
    extend: 'Ext.Button',
    xtype: 'sef-avatar',
    ui: 'sefu-btn-avatar',
    requires:['sef.core.components.uploader.UploadDialog'],
    config: {
        src: '',
        uploadUrl: '',
        uploadParams: {}
    },
    width: 120,
    height: 120,
    maxWidth: 120,
    minWidth: 120,
    minHeight: 120,
    iconCls: 'x-fa fa-plus',

    applySrc: function(v) {
        //console.log
        //console.log('will apply src to #', v, this.getEl());
        var el = this.getEl();
        if (el) {
            var span = el.down('.x-btn-button-sefu-btn-avatar-small');
            //console.log('el#',el,'span#',span);
            span.setStyle({
                background: 'url(' + v + ') no-repeat',
                backgroundSize: '100% 100%'
            });

            if (v) {
                //set background anc clear icon
                this.setIconCls('');
                //span.setStyle()
            } else {
                //clear background ans set icon
                this.setIconCls('x-fa fa-plus');
            }

        }

        this.src = v;
    },

    doUpload: function () {

        if (Ext.isFunction(this.onGetUploadParams)) {
            console.log('onGetUploadParams')
            this.uploadParams = this.onGetUploadParams.call(this, this);
        }
        
        var dialog = Ext.create('sef.core.components.uploader.UploadDialog', {
            //dialogTitle: 'My Upload Widget',
            uploadUrl: this.uploadUrl,
            uploadParams: this.uploadParams
        });

        if (Ext.isFunction(this.onLoadParam)) {
            this.onLoadParam.call(this, this, this._id, code);
        }
        var me = this;
        //this.fireEvent('uploadcomplete', this, manager, queue.getUploadedItems(), errorCount);
        dialog.on('uploadcomplete',function(up,mgr,uploadedItems,err){
            //todo.
            if (Ext.isFunction(me.onUploadComplete)) {
                me.onUploadComplete.call(me, me);
            }
        });

        dialog.show();
    },

    initComponent: function() {

        this.callParent(arguments);
        //console.log('will for avagtar init');
        //this.applySrc(this.src);
        this.on('click', this.doUpload, this);

    },



    afterRender: function() {
        //console.log('will do render now');
        this.callParent(arguments);
        this.applySrc(this.src);
    }
});