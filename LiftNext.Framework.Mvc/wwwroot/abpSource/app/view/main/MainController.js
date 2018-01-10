/**
 * This class is the controller for the main view for the application. It is specified as
 * the "controller" of the Main view class.
 *
 * TODO - Replace this content of this view to suite the needs of your application.
 */
Ext.define('abp.view.main.MainController', {
    extend: 'Ext.app.ViewController',

    alias: 'controller.main',

    listen: {
        controller: {
            '#': {
                unmatchedroute: 'onUnmatchedRoute'
            }
        }
    },

    onUnmatchedRoute: function(hash) {
<<<<<<< HEAD
        console.log('Unmatched', hash);
=======
        var me=this;
        var view=me.getView();
        var hashObj=Ext.Object.fromQueryString(hash);
        console.log('Unmatched', hashObj);
        
        if(hashObj.app){
            var appView=Ext.create(hashObj.app,{
                hashObj:hashObj
            });
           var maintab= me.lookup('maintab')
            //view.suspendLayout();
            maintab.add(appView).show();
            //view.updateLayout();
        }
>>>>>>> 40118efc8b0728767e5259ad4f4af7b6a1199a39
        // Do something...
    },

    onItemSelected: function (sender, record) {
        Ext.Msg.confirm('Confirm', 'Are you sure?', 'onConfirm', this);
    },

    onConfirm: function (choice) {
        if (choice === 'yes') {
            //
        }
    }
});
