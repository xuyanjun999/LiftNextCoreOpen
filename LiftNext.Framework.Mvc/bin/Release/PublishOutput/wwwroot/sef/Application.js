/**
 * The main application class. An instance of this class is created by app.js when it
 * calls Ext.application(). This is the ideal place to handle application launch and
 * initialization details.
 */

//____DEBUG___=false;


//Ext.form.field.Checkbox.override({
//    getValue: function () {
//        if (this.name === 'IsLock') {
//            debugger;
//        }

//        return this.callParent(arguments);
//    }
//});

window.IS_IN_SENCHA_CMD = true;


//Ext.Loader.setPath('sef.app', '/apps');
        //disableCaching
Ext.Loader.setConfig({
    enable: true,
    //disableCaching:5677,
    //cacheParam:'_sg_',    
    paths: {
        "sef.app": "/apps"
       

    }
});


//Ext.Boot.config.cache=2211;

Ext.Ajax.on('beforerequest', function (conn, options, opt) {
    if (!options.headers) options.headers = {};
    var dftHeader = {
        'x-sef': 'true',
        'ID': sef.runningCfg.getUser().ID,
        'TOKEN': sef.runningCfg.getUser().Token
    };
    Ext.apply(options.headers, dftHeader);
    //options.headers['TEST']=990000;
    //console.log(conn,options);
    if (options.url.indexOf('.json') >= 0) {
        if (window.SEF_LIB_CFG.jsonWithPost === true) {
            options['method'] = 'POST';
        } else {
            options['method'] = 'GET';
        }

        //options['method']='GET';
    }

});

Ext.Ajax.on('requestcomplete', function (conn, opts) {
    //console.log('requestcomplete#', conn, opts);
    var reqText = opts.responseText;
    var result = Ext.isString(reqText) ? Ext.JSON.decode(reqText) : reqText;
    if (result && result.ErrorCode == 401) {
        Ext.GlobalEvents.fireEvent('userexpired');//, 'foo', 'bar');
        return;
    }
    if (reqText.indexOf('"ErrorCode":401') >= 0) {
        //alert('will logout');
        Ext.GlobalEvents.fireEvent('userexpired');//, 'foo', 'bar');
    }
});




Ext.define('sef.core.Application', {
    extend: 'Ext.app.Application',

    name: 'sef',

    listen: {
        global: {
            'userexpired': 'onUserExpired'
        }
    },

    onUserExpired: function () {
        //console.log('user will be relogin', this);
        sef.runningCfg.clearUser(true);
        //window.location.reload();
    },

    //requires:['Ext.ux.IFrame'],

    //mainView: 'sef.core.view.viewport.MDIViewport',

    launch: function () {
        

        var me = this;
        sef.runningCfg.initCfg(function (success, msg) {
            //console.log('initCfg done,ui mode is#',sef.runningCfg.getUIMode());
            if (success) {
                //debugger;
                //Ext.Loader.loadScript("abc.js");
                //console.log('ui mode is#', sef.runningCfg.getUIMode());
                var uiMode = sef.runningCfg.getUIMode();
                sef.utils.setDocTitle(sef.runningCfg.getTitle());
                //return;
                //debugger;
                var splashId = window.SEF_LIB_CFG.splashId;//||'sef_splash';
                if (splashId) {
                    Ext.get(splashId).destroy();
                }

                //me.setDefaultToken(sef.runningCfg.get('DefaultToken'));
                //console.log(me.getDefaultToken());
                if (uiMode === 'l-t') {
                    me.setMainView('sef.core.view.viewport.MDIViewport');
                } else {
                    me.setMainView('sef.core.view.viewport.TopMDIViewport');
                }

            } else {
                sef.dialog.error(msg.message, 'invalid profile');
            }
        });
        //window.document.title = sef.runningCfg.getTitle();

        //Ext.MessageBox.setUI('sefu-dialog');
        //Ext.MessageBox.setMinWidth(320);
        //Ext.MessageBox.setBodyPadding('10px 20px 20px 10px');
        // TODO - Launch the application
    }
});