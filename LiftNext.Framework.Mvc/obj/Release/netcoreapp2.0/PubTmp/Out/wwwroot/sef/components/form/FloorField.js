
/*

    调用示例
        {
        xtype: 'sef-floorfield',
        columnWidth: 1,
        itemId: 'floor',
        count: 30,//表示共有30层，为线性楼层
        floorData: [{//楼层数据
            Floor: 1,
            Value: 2800,
            Door: [1, 2]
        }, {
            Floor: 5,
            Value: 2810,
            Door: [2]
        }]
    }

    this.down('#floor').makeFloors({
            floors:[1,3,4,5,6,7,8,9,12],
            floorData:[{
                Floor:1,
                Value:2800,
                Door:[1,2]
            }]
        });

    返回值格式
    [
        {
            Code:原楼层号,
            NewCode:新楼层号//如果未改变楼层号，则两个值一致,
            Value:fvalue//层间距
            Door:door//开门方式，1为前开，2为后开
        }
    ]
*/
Ext.define('sef.core.components.form.FloorField', {
    extend: 'Ext.container.Container',
    xtype: 'sef-floorfield',
    mixins: ['sef.core.interfaces.IFieldDisplayModeChange'],
    cls: 'sef-floorfield',
    config: {
        fieldLabel:_('详细楼层'),
        updateButtonText:_('更新'),
        floorCount: 0,//总楼层数
        floorStart:-1,//起始楼层
        floorHeight: 3000,
        floorDoor : '',
        floors:null,//一个数组，用于处理非连续性楼层的问题，如[1,3,4,5,6]表示没有第二层
        floorData: [],
        colSize: 3//每列显示的层数
    },

    privates:{
        _editMode: null,
    },

    changeDisplayMode: function(newMode) {
        this._editMode = newMode;
        //console.log('will change to new mode#',newMode,this);
        this.updateEditMode();
    },

    updateEditMode: function() {
        //if(this._formLoaded!==true)return;
        if(this._editMode===null || this._editMode===undefined)return;
        var me = this,
            forms = me.query('sef-formpanel');

        //todo;

    },

    makeSigleFloor: function(opt) {

        var cls='single-floor ';
        var colSize=opt.colSize||2;
        var no = opt.no || opt.index;
        var index = opt.index;

        if(opt.index%colSize!==0){
            cls+='inner-cell ';
        }
        
        if(opt.index<colSize){
            cls+='first-row ';
        }


        //if(opt.index>0 && opt.index%opt.colSize)
        var sf = {
            xtype: 'fieldcontainer',
            itemId:'floor_fc_'+no,
            floorNo:no,
            cls:cls,//'single-floor',
            layout: 'hbox',
            columnWidth:1/colSize,
            items: [ {
                xtype: 'textfield',
                cls:'floor',
                //decimalPrecision:0,
                hideTrigger:true,
                value: no,
                width:40,
                itemId: 'floor_' + no,
                name: 'NF' + index
            },{
                xtype:'box',
                cls:'floor-text',
                html:'F'
            },{
                xtype: 'numberfield',
                cls:'floor-value',
                hideTrigger:true,
                width:60,
                value:2700,
                itemId: 'floorvalue_' + no,
                name: 'DBFLR' + index
            },{
                xtype:'box',
                cls:'floor-text',
                html:'mm'
            },{
                xtype: 'checkboxgroup',
                cls:'floor-option',
                itemId: 'flooroption_' + no,
                //name: 'floor_' + index,
                items: [{
                    boxLabel: '前门',
                    name: 'FRD' + index,
                    inputValue: '前门有',
                    getSubmitValue: function () {
                        if (this.checked) {
                            return "前门有";
                        } else {
                            return '前门无';
                        }
                    }
                }, {
                    boxLabel: '后门',
                    name: 'FRD' + index,
                    inputValue: '后门有',
                    getSubmitValue: function () {
                        if (this.checked) {
                            return "后门有";
                        } else {
                            return '后门无';
                        }
                    }
                }],
                _flex: 1
            }]
        };
        return sf;
    },


    makeFloors: function (opt) {
        opt = opt || {}; 
        var me = this;
        var floors = opt.floors || this.floors;
        var data = opt.floorData || this.floorData;
        var count = opt.floorCount || this.floorCount;
        var height = opt.floorHeight || this.floorHeight;
        var door = opt.floorDoor || this.floorDoor;
        var start = opt.floorStart || this.floorStart;
        var colSize = opt.colSize || this.colSize;
        //if (!data) 
        
        if(!floors){
            floors = [];
            data = [];
            var index = 0;
            for (var i = 0; i < count; i++) {
                if (start + i === 0) {
                    count++;
                    continue;
                }
                floors.push(start + i);
                data.push({
                    Index: index++,
                    Floor: start + i,
                    Value: height,
                    Door: door
                });
            }
        }
        
        var me=this,items=[];
        floors.forEach(function(f,index){
            var opt={
                index:index,
                count:floors.length,
                no:f,
                colSize:colSize
            }
            items.push(me.makeSigleFloor(opt));
        });
        this.suspendLayout=true;
        var fc=this.query('fieldcontainer');
        
        //var values=[];
        fc.forEach(function(f){
            if(f.floorNo){
                f.destroy();
                f=null;
                delete f;
            }
        });
        this.add(items);
        this.setValue(data);
        this.suspendLayout=false;
        this.updateLayout();
    },

    getFloorValue:function(fc){
        var code=fc.floorNo;
        var newCode=fc.down('#floor_'+code).getValue();
        var fvalue=fc.down('#floorvalue_'+code).getValue();
        var fopt=fc.down('#flooroption_'+code).getValue();

        var door=fopt.Door||null;
        if(!Ext.isArray(door)){
            door=[door];
        }
        var doorValue = "";
        if (door.length == 2) {
            doorValue = "前门有后门有";
        } else if (door.length == 0) {
            doorValue = "前门无后门无";
        } else if (door.length == 1) {
            if (door[0] == 1) {
                doorValue = "前门有后门无";
            } else {
                doorValue = "前门无后门有";
            }
        }
        //fopt=fopt.Door;
        return {
            Code:code,
            NewCode:newCode,
            Value:fvalue,
            Door: doorValue
        };
    },

    getValue: function () {
        var me=this,fc=this.query('fieldcontainer');
        var values=[];
        fc.forEach(function(f){
            if(f.floorNo){
                values.push(me.getFloorValue(f));
            }
        });
        //console.log('floorfield getvaue',values);
        return values;
    },

    setValue: function (v) {
        this.reset();
        if(!v){
           
            return;
        }

        if(!Ext.isArray(v))v=[v];
        var me=this;
        /*
        {
            Floor: 5,
            Value: 2810,
            Door: [2]
        }*/

        v.forEach(function(fv){
            //var code=fv.
            me.setFloorValue(fv);
        });

    },

    setFloorValue:function(v){
        var code=v.Floor;
        var value=v.Value;
        var door = v.Door;
        var index = v.Index;

        //var fc=this.down('#floor_fc_'+code);
        var f=this.down('#floor_'+code);
        var fvalue=this.down('#floorvalue_'+code);//.getValue();
        var fopt=this.down('#flooroption_'+code);//.getValue();

        var ds = [];
        if (door == "前门有后门无"){
            ds.push('前门有');
        } else if (door == "前门无后门有") {
            ds.push('后门有');
        } else if (door == "前门有后门有") {
            ds.push('前门有');
            ds.push('后门有');
        } 

        f.setValue(code);
        fvalue.setValue(value);
        
        var str = "{FRD" + index + ":[]}";
        var v = Ext.JSON.decode(str);
        v['FRD' + index] = ds;
        fopt.setValue(v);
        //console.log('formCode:'+fopt.up('sef-formpanel').formCode, 'floorIndex:' + fopt.name, 'floorSetValue:' , v, 'floorGetChecked:', fopt.getChecked(), 'floorGetValue:',fopt.getValue());
    },

    reset:function(){
        var me=this,fc=this.query('fieldcontainer');
        var values=[];
        fc.forEach(function(f){
            if(!f.floorNo){
                return;
                //values.push(me.getFloorValue(f));
            }
            var code=f.floorNo;
            var fvalue=me.down('#floorvalue_'+code);
            var fopt=me.down('#flooroption_'+code);
            fvalue.reset();
            fopt.reset();
        });
    },

    makeHeader:function(){
        return {
            xtype:'container',
            columnWidth:1,
            //margin:'0 0 10px 0',
            layout:{
                type:'hbox',
                align:'stretch',
                pack:'start'
            },
            items:[{
                xtype:'box',
                cls:'sef-fieldlabel',
                html:this.fieldLabel
            },{
                xtype:'box',
                flex:1
            },{
                limit:false,
                actionName:'updatefloor',
                xtype:'sef-actionbutton',
                text:this.updateButtonText
            }]
        }
    },

    initComponent: function() {
        
        Ext.apply(this, {
            //html:'here is floor building'
            padding:'10 0 0 0',
            layout:'column',
            items:[this.makeHeader()]
        });
        this.callParent(arguments);
        //this.makeHeader();
        this.makeFloors();

        //this.getValue();
    }
});