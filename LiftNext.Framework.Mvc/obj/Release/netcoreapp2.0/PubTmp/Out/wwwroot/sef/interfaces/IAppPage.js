//IAppPage

Ext.define('sef.core.interfaces.IAppPage', {
    _routes:null,
    _customcmd:null,

    onPageReady:Ext.emptyFn,

    beforeReady: function() {
        var me = this;
        if (!this.store) {
            this.store = Ext.getStore(me._pid + '_store');
            //console.log('will get a store',this.store);
        }
    },

    afterReady: function() {

    },

    setStamp:function(v){
        this.stampCls=v;
        //debugger;
        if(!this.controller)return;
        if(this.stampCls){
            this.controller.makeStamp();
        }else{
            this.controller.clearStamp();
        }
    },

    setStampMessage:function(v){
        this.controller && this.controller.setStampMessage(v);
    },

    makeRadialMenu:function(items,x,y){
        this.controller && this.controller.makeRadialMenu(items,x,y);
    },

    updateRoute: function(routeObj) {
        var isChange=false;
        if(this._routes != routeObj){
            isChange=true;
        }else{
            if(this._routes && routeObj){
                isChange=this._routes.str !== routeObj.str;
            }
        }
        this._routes=routeObj;
        if(isChange){
            //if(this._routes.qObj['cust'])
            var customCmd=this._routes.qObj['customcmd'];
            var flag=true;
            if(customCmd !== this._customcmd){
                this._customcmd=customCmd;
                flag=this.onCustomCommandChange(this._customcmd,this._routes);
            }
            flag!==false && this.onRouteChange(this._routes);
            //console.log(this._routes);
        }
        //console.log('will update page.route#', routeObj, this.itemId, this.id, this._pid);
    },

    //设置权限信息
    updatePermission:function(p){
        if(!p)return;
        var vm=this.getViewModel();
        if(!vm)return;

        var newP={};
        for(var pp in p){
            var newPP='action_can_'+pp;
            newP[newPP]=p[pp];
        }
        vm.setData(newP);
        newP=null;
        delete newP;
        //console.log('updateper####',vm);
        //if(this.getViewModel())
    },

    onRouteChange:function(route){
        //console.log('route will change#',this._routes);
    },

    onCustomCommandChange:function(cmd,routeObj){
        return true;
    }
});