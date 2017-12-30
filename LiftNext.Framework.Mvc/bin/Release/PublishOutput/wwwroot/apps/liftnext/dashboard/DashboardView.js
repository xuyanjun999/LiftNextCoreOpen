//FormPage.js

Ext.define('sef.app.liftnext.dashboard.DashboardView', {
    extend: 'Ext.container.Container',
    cls:'sef-defaultdashboard',
    vname: 'view',
    //requires:['sef.core.interfaces.IAppPage'],
    mixins: ['sef.core.interfaces.IAppPage'],
    requires:[
        'sef.app.liftnext.dashboard.StatusTile',
        'sef.app.liftnext.dashboard.MainChart',
        'sef.app.liftnext.dashboard.MetaChart'

    ],
    xtype: 'sef-dashboardview',
    controller: 'sefc-pagectrl',
    scrollable:'y',
    layout:{
        type:'vbox',
        align:'stretch'
    },
    //html:'<h1>demo dashboard</h1>',
    afterRenderer: function () {
        var me = this;
        sef.utils.ajax({
            url: 'Dashboard/GetDashboardTitle',
            method: 'POST',
            paramAsJson: true,
            scope: me,
            success: function (result) {
                //console.log(result)
                var titleData = [{
                    text: result.ProjectCount,
                    desc: '项目'
                }, {
                        text: result.DrawingCount,
                    desc: '图纸'
                }, {
                        text: result.ModelCount,
                    desc: '梯型'
                }];
                //标题
                me.down('sef-statustile').setData(titleData);
                //项目信息
                me.down('sef-metachart').down('#projectCard').setData({
                    LastProjects: result.LastProjectCount,
                    TodayProject: result.TodayProjectCount,
                    MonthProjects: result.MonthProjectCount,
                    YearProjects: result.YearProjectCount,
                    TotalProjects: result.TotalProjectCount
                });
                //图纸信息
                me.down('sef-metachart').down('#drawingCard').setData({
                    LastProjects: result.LastDrawingCount,
                    TodayProject: result.TodayDrawingCount,
                    MonthProjects: result.MonthDrawingCount,
                    YearProjects: result.YearDrawingCount,
                    TotalProjects: result.TotalDrawingCount
                });
                //图表信息
                //console.log(me.down('sef-mainchart'))
                me.down('sef-mainchart').showChart({
                    Months: result.ChartMonths,
                    Projects: result.ChartProjects,
                    Drawings: result.ChartDrawings,
                    Operators: result.ChartOperators
                });
            },
            failure: function (err, resp) {
                sef.dialog.error(err.message);
                form.setLoading(false);
                console.log('error', err);
            }
        });


    },
    initComponent: function() {
        this.beforeReady();
        var me = this;
        Ext.apply(this,{
            items: [ {
                xtype: 'sef-statustile',
                //height:200,
                data:[{
                    text:'0',
                    desc:'项目'
                },{
                    text:'0',
                    desc:'图纸'
                },{
                    text:'0',
                    desc:'梯型'
                }]
            },{
                xtype:'sef-metachart'
            },{
                xtype:'sef-mainchart',
                flex:1
            }]
        });
        //this.store.load();

        this.callParent(arguments);
        this.afterRenderer();
    }

});