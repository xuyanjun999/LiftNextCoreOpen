Ext.define('sef.app.liftnext.dashboard.MainChart', {
    extend: 'Ext.container.Container',
    xtype: 'sef-mainchart',
    layout: 'fit',
    margin: '20px 5px 5px 5px',
    items: {
        xtype: 'sef-cardpanel',
        itemId:'chart-cpanel',
        title: '统计图表',
        layout:'fit',
        html: '<div id="chart-c" style="width:100%;height:100%"></div>'
    },
    config: {
        chartData: {
            MaxProject: 250,
            MaxDrawing : 25,
            Months: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'],
            Projects: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            Drawings: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            Operators: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
        }
    },
    afterLayout:function(){
        this.callParent(arguments);
        //console.log('will after layout',this.getSize());
    },

    showChart: function (data) {
        if (this.__chart_maked === true) return;
        this.__chart_maked = true;
        var c = Ext.get('chart-c');
        this.makeChart(c.dom, data || this.chartData);
    },


    makeChart: function(c, data) {
        var option = {
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'cross',
                    crossStyle: {
                        color: '#999'
                    }
                }
            },
            toolbox: {
                feature: {
                    dataView: { show: true, readOnly: false },
                    magicType: { show: true, type: ['line', 'bar'] },
                    restore: { show: true },
                    saveAsImage: { show: true }
                }
            },
            legend: {
                data: ['项目', '图纸', '生成次数']
            },
            xAxis: [{
                type: 'category',
                data: data.Months,
                axisPointer: {
                    type: 'shadow'
                }
            }],
            yAxis: [{
                    type: 'value',
                    name: '数量',
                    axisLabel: {
                        formatter: '{value} 个'
                    }
                },
                {
                    type: 'value',
                    name: '数量',
                    axisLabel: {
                        formatter: '{value} 次'
                    }
                }
            ],
            series: [{
                    name: '项目',
                    type: 'bar',
                    data: data.Projects
                },
                {
                    name: '图纸',
                    type: 'bar',
                    data: data.Drawings
                },
                {
                    name: '生成次数',
                    type: 'line',
                    yAxisIndex: 1,
                    data: data.Operators
                }
            ]
        };

        var myChart = echarts.init(c);
        myChart.setOption(option);
    }
});