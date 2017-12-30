Ext.define('sef.core.components.flowchart.DrawerContainer', {
    extend: 'Ext.container.Container',
    xtype: 'sef-flowcontainer',
    _layout:{
        type:'vbox',
        align:'stretch'
    },
    scrollable:'y',
    //layout: 'fit',
    config: {
        
        verticalLayout: true,
        url:'',
        flowData:null,
        
        drawerCfg: {
            height:600,
            width:100,
            //chartLayout: 'maxUpOrDownLayerLayout'
            chartDir: '',
            chartMargin: 10,
            layerSpacing: 30,
            diagramWidth: 60,
            diagramHeight: 30,
            diagramBorderColor: '#108ee9',
            labelFontSize: '12px',
            dummyNodeColor: '#108ee9',
            edgeColor: '#108ee9'

        }
    },
    _isLayouted:false,

    applyFlowData:function(d){
        //console.log('will applying data#',d);
        //debugger;
        if(d && d.Steps && d.Connections){
            var data={nodes:{},edges:d.Connections};
            d.Steps.forEach(function(ds){
                var type=ds.Type||'default';
                data['nodes'][ds.DataID]={
                    label:ds.Text,
                    dataId:ds.DataID,
                    nodeType:type.toLowerCase()
                };
            });
            this.flowData=data;
            if(this._drawer){
                console.log('will update drawer now');
                this._drawer.updateFlowData(this.getFlowData());//flowData);
            }

            //console.log('real data is #',data);
        }
        


    },

    makeBar:function(){
        return {
            xtype:'box',
            html:'here',
            height:30
        }
    },

    initComponent:function(){
        Ext.apply(this,{
            _items:[this.makeBar()]
        }),
        this.callParent(arguments);
        var me=this;
        if(this.url){
            //load data
            sef.utils.ajax({
                url: this.url,
                method: 'GET',
                
                success: function (result, resp) {
                    me.setFlowData(result);
                },
                failure: function (err, resp) {
                    
                    console.log('failure#', err, cb);
                }
            });
        }

        this.on('resize',function(s,w,h,ow,oh){
            //console.log('catch resize');
            var draw=me.getDrawer();
            
            draw && draw.setSize(w,h) && draw.redraw(w,h);
        });
        //this.on('afterlayout',)
    },

    afterLayout:function(){
        
        this.callParent(arguments);
        if(this._isLayouted===false){
            this._isLayouted=true;
            this.mask('loading...');
            this.makeDrawer();
            
            
        }
        //this.mask('loading...');
        //console.log('afterlayout',this.getSize());
    },

    getDrawer:function(){
        return this._drawer;
    },

    makeDrawer:function(){
        //return;
        var size=this.getSize();
        var barHeight=0;
        var h=this.drawerCfg.height;
        if((size.height-barHeight)>h)h=size.height()-barHeight;
        var w=this.drawerCfg.width;
        if(size.width>w)w=size.width;
        //else h=size.height-30;

        var _drawer={
            xtype: 'sef-flowdrawer',
            chartLayout: 'maxUpOrDownLayerLayout',
            
            autoSize: true,
            dag: this.getFlowData()//flowData
        };
        Ext.apply(_drawer,this.drawerCfg||{});
        Ext.apply(_drawer,{
            width:w,
            height:h
        });

        this.suspendLayout=false;
        this.unmask();
        this._drawer=this.add(_drawer);
        this.suspendLayout=true;
        this.updateLayout();
        this.relayEvents(this._drawer, [
            'flownodeclick'
        ]);
    }
});