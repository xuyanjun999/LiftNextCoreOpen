//Login Form
Ext.define('sef.core.view.security.LoginForm', {
    extend: 'Ext.container.Container',
    xtype: 'sef-loginform',
    layout: {
        type: 'vbox',
        align: 'stretch'
    },
    minWidth: 400,
    padding: '30px 30px 60px 30px',
    defaultFocus: 'textfield:focusable:not([hidden]):not([disabled]):not([value])',
    cls: 'sef-loginform-container',
    _loginLogoEl:null,

    makeRememberMe: function() {
        return {
            xtype: 'container',
            layout: {
                type: 'hbox',
                align: 'stretch'
            },
            margin: '0 0 12px 0',
            items: [{
                xtype: 'checkbox',
                boxLabel: _('Login with AD'),
                flex: 1,
                reference:'withAD',
                bind:{
                    hidden:'{!EnableAd}'
                }
            },{
                xtype: 'checkbox',
                reference:'rememberMe',
                boxLabel: _('Remember me')
            }]
        }
    },

    makeLoginForm: function() {
        var items = [{
            xtype: 'box',
            minHeight:90,
            cls:'welcome-title',
            bind:{
                html:'{Greeting}'
            }
        }, {
            xtype: 'textfield',
            ui: 'sefu-login-field',
            emptyText: _('用户名'),
            reference:'loginName',
            margin: '0 0 20px 0',
            bind:{
                value:'{LastLoginName}'
            },
            enableKeyEvents:true,
            minLength:6,
            listeners:{
                keydown:'onFieldKeyDown'
            }
        }, {
            xtype: 'textfield',
            ui: 'sefu-login-field',
            inputType: 'password',
            reference:'loginPwd',
            emptyText: _('密码'),
            margin: '0 0 20px 0',
            enableKeyEvents:true,
            value:'',
            minLength:5,
            listeners:{
                keydown:'onFieldKeyDown'
            }
        }, this.makeRememberMe(), {
            reference:'btnLogin',
            xtype: 'button',
            scale: 'medium',
            text: 'Login',
            handler: 'onLogin'
        }];

        return items;
    },

    afterRender:function(){
        this.callParent(arguments);
        //_loginLogoEl
        if(!this._loginLogoEl){
            var el = this.getEl();
            //console.log(el.getStyle('left'));
            this._loginLogoEl = new Ext.dom.Element(document.createElement('div'));
            this._loginLogoEl.setCls('sef-login-window-logo');
            this._loginLogoEl.appendTo(el);
            //console.log(this._loginLogoEl);
        }
    },

    afterLayout:function(){
        var el=this.getEl();
        var w=el.getWidth();
        if(this._loginLogoEl){
            //144
            var xy=el.getXY();
            var style={};
            style['left']=xy[0]+(w-144)/2+'px';
            style['top']=xy[1]-144/2+'px';
            style['display']='block';
            this._loginLogoEl.setStyle(style);
        }
        //console.log(el.getXY());
    },

    onDestroy:function(){
        if(this._loginLogoEl){
            this._loginLogoEl.destroy();
            delete this._loginLogoEl;
            this._loginLogoEl=null;
        }

        this.callParent(arguments);
    },

    initComponent: function() {
        Ext.apply(this, {
            items: this.makeLoginForm() //[this.makeBrandBox(), this.makeLoginFormBox()]
        });
        return this.callParent(arguments);
    }
});