//ListPageCtrl

Ext.define('sef.core.components.page.PageCtrl', {
    extend: 'Ext.app.ViewController',

    alias: 'controller.sefc-pagectrl',

    control: {
        '#': {
            'afterrender': 'onPageAfterRender',
            'beforedestroy': 'onPageBeforeDestroy'
        },
        '*': {
            'childcommand': 'onChildCommand'
        },
        'sef-actionbutton': {
            'click': 'onActionButtonClick'
        }
        //'childcommand':'onChildCommand',

    },

    makeStamp: function() {
        if(!this.view.stampCls){
            this.clearStamp();
            return;
        }
        if(this._stamplEl)return;
        var el = this.view.getEl();
        this._stamplEl = new Ext.dom.Element(document.createElement('div'));
        this._stamplEl.setCls(this.view.stampCls);
        //this._stamplEl.setStyle('backgroundImage', "url("+this.view.stampUrl+")");
        this._stamplEl.appendTo(el);
        //console.log(this._stamplEl);
    },

    setStampMessage:function(v){
        if(!v){
            //clear
            if(this._stampMsgEl){
                this._stampMsgEl.destroy();
                this._stampMsgEl=null;
                delete this._stampMsgEl;
            }
            return;
        }

        //add stamp
        if(!this._stampMsgEl){
            var el = this.view.getEl();
            this._stampMsgEl = new Ext.dom.Element(document.createElement('div'));
            
            this._stampMsgEl.appendTo(el);
        }
        var cls='sef-page-stamper ';
        if(v.type){
            cls +=v.type;
        }else{
            cls+=' error';
        }
        this._stampMsgEl.setCls(cls);
        var html='<strong>'+(v.title||_('错误提示'))+'</strong><br />'+v.text;
        this._stampMsgEl.setHtml(html);
        var t=v.top||0;
        var s={};
        if(t>0){
            s['top']=t+'px';
            //this._stampMsgEl.setStyle("top",t+'px');
        }
        var r=v.right|0;
        if(r>0){
            s['right']=r+'px';
            //this._stampMsgEl.setRight(t);
        }
        this._stampMsgEl.setStyle(s);
        //console.log(s,this._stampMsgEl);
    },

    makeRadialMenu:function(items,x,y){
        if(items===null){
            //may be remove
            if(this._radialMenu){
                this._radialMenu.destroy();
                this._radialMenu=null;
                delete this._radialMenu;
            }
            return;
        }
        if(!this._radialMenu){
            //create
            this._radialMenuId=Ext.id(null,'sef-radia');
            var html=sef.utils.makeRadialMenu(this._radialMenuId,items,x,y);
            var el = this.view.getEl();
            this._radialMenu = new Ext.dom.Element(document.createElement('div'));
            this._radialMenu.setHtml(html);
            this._radialMenu.appendTo(el);
            var me=this;
            this._radialMenu.on('click',function(e,t){
                //console.log('e#',e,'t#',t,'e.c#',e.child,'t.c#',t.child);
                //var menu=e.child('.sef-radial-menu');
                //console.log(menu);
                var menu=Ext.fly(me._radialMenuId);
                menu.toggleCls('active');
            });

        }

        //console.log(this._radialMenu);
    },

    clearStamp:function(){
        if(this._stamplEl){
            this._stamplEl.destroy();
            this._stamplEl=null;
            delete this._stamplEl;
        }

    },

    onPageAfterRender: function() {
        this.makeStamp();
        if(Ext.isFunction(this.view.onPageUIReady)){
            this.view.onPageUIReady(this.view);
        }
        //console.log('page will be render#',this.view,this.view.getEl());
    },

    onPageBeforeDestroy: function() {
        this.clearStamp();
        this.setStampMessage(null);
        this.makeRadialMenu(null);
        //console.log('page will be destroy', this.view);
    },

    onChildCommand: function(child, cmd, btn) {
        //console.log('will catch a child command',cmd,btn);

        return this.onExecuteCommand(cmd, btn);
    },




    onActionButtonClick: function(btn) {
        //console.log('ab.click#',btn);
        if (btn.isChild === true) return false;
        var command = btn.command || btn.actionName;
        this.onExecuteCommand(command, btn);
        //console.log('will click an action button#',command, btn);
    },

    onExecuteCommand: function(command, btn) {
        //console.log('here catching....',command);
        //debugger;
        var cmdHandlerName = command.toLowerCase() + '__execute';
        var fn = this.view[cmdHandlerName];
        if (Ext.isFunction(fn)) {
            if (fn.call(this.view, btn) === false) return false;
        }
        fn = this[cmdHandlerName];
        if (Ext.isFunction(fn)) {
            if (fn.call(this, btn) === false) return false;
        }

        console.log('not found#', cmdHandlerName);
    },

    switchToPage: function(q) {
        var newHash = sef.utils.encodeHash(this.view._routes, q);
        //this.fireViewEvent('pageroutechange',newHash);
        //debugger;
        this.redirectTo(newHash);
    }


});