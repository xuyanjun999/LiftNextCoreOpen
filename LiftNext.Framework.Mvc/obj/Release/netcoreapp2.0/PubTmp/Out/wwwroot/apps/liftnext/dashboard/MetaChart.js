Ext.define('sef.app.liftnext.dashboard.MetaChart', {
    extend: 'Ext.container.Container',
    xtype:'sef-metachart',
    layout:{
        type:'hbox',
        align:'stretch'
    },
    margin:'20px 5px 0 5px',
    items:[{
        xtype:'sef-cardpanel',
        title:'项目统计情况',
        flex: 1,
        itemId : 'projectCard',
        data:{},
        tpl:['<div class="dashboard-status-grid">',
        '<div class="row">',
            '<div class="col"><span>昨日项目数：{LastProjects}</span></div>',
            '<div class="col"><span>今日项目数：{TodayProject}</span></div>',
        '</div>',
        '<div class="row">',
            '<div class="col"><span>本月项目数：{MonthProjects}</span></div>',
            '<div class="col"><span>本年项目数：{YearProjects}</span></div>',
        '</div>',
        '<div class="row">',
            '<div class="col"><span>累计项目数：{TotalProjects}</span></div>',
            '<div class="col"></div>',
        '</div>',
    '</div>']
    },{
        xtype:'box',
        width:20
    },{
        xtype:'sef-cardpanel',
        title:'图纸生成情况',
        itemId: 'drawingCard',
        flex:1,
        data:{},
        tpl:['<div class="dashboard-status-grid">',
        '<div class="row">',
            '<div class="col"><span>昨日图纸数：{LastProjects}</span></div>',
            '<div class="col"><span>今日图纸数：{TodayProject}</span></div>',
        '</div>',
        '<div class="row">',
            '<div class="col"><span>本月图纸数：{MonthProjects}</span></div>',
            '<div class="col"><span>本年图纸数：{YearProjects}</span></div>',
        '</div>',
        '<div class="row">',
            '<div class="col"><span>累计图纸数：{TotalProjects}</span></div>',
            '<div class="col"></div>',
        '</div>',
    '</div>']
    }]
});