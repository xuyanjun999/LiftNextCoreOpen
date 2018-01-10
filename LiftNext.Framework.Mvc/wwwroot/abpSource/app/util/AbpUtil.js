Ext.define('abp.util.AbpUtil', {
    ajax: function (opt) {
        var _success = opt.success;
        var _failure = opt.failure
        delete opt.success;
        delete opt.failure;
<<<<<<< HEAD
        opt.url=Ext.String.format("http://localhost:5000"+opt.url);
=======
        opt.url = "http://localhost:5000" + opt.url;
>>>>>>> 40118efc8b0728767e5259ad4f4af7b6a1199a39
        Ext.apply(opt, {
            success: function (response, opts) {
                var obj = Ext.decode(response.responseText);
                if (_success) _success(obj, response, opts);
            },
            failure: function (response, opts) {
                if (_failure) _failure(response, opts);
            }
        });
        Ext.Ajax.request(opt);
    },

<<<<<<< HEAD
},function(cls){
    if(!abp.utils)abp.utils=new cls();
=======
}, function (cls) {
    if (!abp.util) abp.util = new cls();
>>>>>>> 40118efc8b0728767e5259ad4f4af7b6a1199a39
});