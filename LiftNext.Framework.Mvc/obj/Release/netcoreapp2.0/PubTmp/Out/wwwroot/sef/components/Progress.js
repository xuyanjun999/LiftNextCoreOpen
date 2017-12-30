Ext.define('sef.core.components.Progress', {
    extend: 'Ext.Component',
    xtype: 'sef-progress',
    cls: 'sef-progress-box',


    config: {
        pgType: 'circle', //line,circle,dashboard
        percent: 0,
        showPercentSymbol: true,
        status: 'success', //error,success
        showInfo: true,

        gapDegree: 0,
        gapPosition: 'top'
    },


    statics: {
        getPathStyles: function(percent, strokeWidth, gapDegree, gapPosition) {
            gapDegree = gapDegree || 0;
            gapPosition = gapPosition || 'top';

            radius = 50 - (strokeWidth / 2);
            var beginPositionX = 0;
            var beginPositionY = -radius;
            var endPositionX = 0;
            var endPositionY = -2 * radius;
            switch (gapPosition) {
                case 'left':
                    beginPositionX = -radius;
                    beginPositionY = 0;
                    endPositionX = 2 * radius;
                    endPositionY = 0;
                    break;
                case 'right':
                    beginPositionX = radius;
                    beginPositionY = 0;
                    endPositionX = -2 * radius;
                    endPositionY = 0;
                    break;
                case 'bottom':
                    beginPositionY = radius;
                    endPositionY = 2 * radius;
                    break;
                default:
            }

            /*
            M 50,50 m ${beginPositionX},${beginPositionY}
            a ${radius},${radius} 0 1 1 ${endPositionX},${-endPositionY}
            a ${radius},${radius} 0 1 1 ${-endPositionX},${endPositionY}
            */

            var pathString = Ext.String.format('M 50,50 m {0},{1}\
            a {2},{2} 0 1 1 {3},{4}\
            a {2},{2} 0 1 1 {5},{6}\
            ', beginPositionX, beginPositionY,
                radius,
                endPositionX, endPositionY * -1,
                endPositionX * -1, endPositionY);

            var len = Math.PI * 2 * radius;
            var trailPathStyle = {
                strokeDasharray: Ext.String.format("{0}px {1}px", len - gapDegree, len),
                strokeDashoffset: Ext.String.format("{0}px", (gapDegree / 2) * -1),
                transition: 'stroke-dashoffset .3s ease 0s, stroke-dasharray .3s ease 0s, stroke .3s'
            };
            var tps = Ext.String.format('{0}:{1};{2}:{3};{4}:{5}', 'stroke-dasharray', trailPathStyle['strokeDasharray'],
                'stroke-dashoffset', trailPathStyle['strokeDashoffset'],
                'transition', trailPathStyle['transition']
            )


            var strokePathStyle = {
                strokeDasharray: Ext.String.format("{0}px {1}px", (percent / 100) * (len - gapDegree), len),
                strokeDashoffset: Ext.String.format("{0}px", (gapDegree / 2) * -1),
                transition: 'stroke-dashoffset .3s ease 0s, stroke-dasharray .3s ease 0s, stroke .3s'

            };

            var sps = Ext.String.format('{0}:{1};{2}:{3};{4}:{5}', 'stroke-dasharray', strokePathStyle['strokeDasharray'],
                'stroke-dashoffset', strokePathStyle['strokeDashoffset'],
                'transition', strokePathStyle['transition']
            )

            return {
                pathString: pathString,
                trailPathStyle: tps, //.join(';'),//trailPathStyle,
                strokePathStyle: sps //.join(';')// strokePathStyle
            };


        },
        makeCircleData: function(opt) {
            var dftOpt = {
                percent: 0,
                trailColor: '#f3f3f3',
                strokeColor: '#108ee9',
                trailWidth: 6,
                strokeWidth: 6,
                strokeLinecap: 'round',
                width: 80,
                height: 80,
                fontSize: 18,
                dashboard: false,
                gapPosition: 'left',
                isTpl: false,
                showInfo: true
            };
            var tOpt = Ext.merge({}, dftOpt);
            opt = Ext.apply(tOpt, opt || {});
            var tpl = [];
            if (opt.isTpl) {
                //todo
                tpl.push('<div class="sef-progress sef-progress-circle {status}">');
                tpl.push('<div class="sef-progress-inner" style="width:{width}px;height:{height}px;font-size:{fontSize}px;">');//, width, height, fontSize));
                tpl.push('<svg\
                    class="sef-progress-circle"\
                    viewBox="0 0 100 100"\
                    style=""\
                  >');
                tpl.push('<path\
                  class="circle-trail"\
                  d="{circelPath}"\
                  stroke="{trailColor}"\
                  stroke-width="{strokeWidth}"\
                  fill-opacity="0"\
                  style="{trialStyle}"\
                />');//
                tpl.push('<path\
                  class="circle-path"\
                  d="{circelPath}"\
                  stroke-linecap="round"\
                  stroke="{strokeColor}"\
                  stroke-width="{strokeWidth}"\
                  fill-opacity="0"\
                  style="{strokeStyle}"\
                />');

                tpl.push('</svg>');
                tpl.push('<span class="sef-progress-text" style="">{percent}%</span>');//, opt.percent));
                tpl.push("</div>");
                tpl.push('</div>');
                

            } else {
                var pathData = null;
                if (opt.dashboard === true) {
                    pathData = sef.core.components.Progress.getPathStyles(opt.percent, opt.strokeWidth, 75, 'bottom');
                } else {
                    pathData = sef.core.components.Progress.getPathStyles(opt.percent, opt.strokeWidth, 0, opt.gapPosition);
                }
                tpl.push('<div class="sef-progress sef-progress-circle">');
                tpl.push(Ext.String.format(
                    '<div class="sef-progress-inner" style="width:{0}px;height:{1}px;font-size:{2}px;">', opt.width, opt.height, opt.fontSize));
                tpl.push('<svg\
                    class="sef-progress-circle"\
                    viewBox="0 0 100 100"\
                    style=""\
                  >');
                tpl.push(Ext.String.format('<path\
                  class="circle-trail"\
                  d="{0}"\
                  stroke="{1}"\
                  stroke-width="{2}"\
                  fill-opacity="0"\
                  style="{3}"\
                />', pathData.pathString, opt.trailColor, opt.trailWidth || opt.strokeWidth, pathData.trailPathStyle));
                if (opt.percent > 0) {
                    tpl.push(
                        Ext.String.format('<path\
                      class="circle-path"\
                      d="{0}"\
                      stroke-linecap="{1}"\
                      stroke="{2}"\
                      stroke-width="{3}"\
                      fill-opacity="0"\
                      style="{4}"\
                    />', pathData.pathString, opt.strokeLinecap, opt.strokeColor, opt.strokeWidth, pathData.strokePathStyle)
                    );
                }
                tpl.push('</svg>');
                tpl.push(Ext.String.format('<span class="sef-progress-text" style="">{0}%</span>', opt.percent));
                tpl.push("</div>");
                tpl.push('</div>');
            }





            
            return tpl;
            //var pathData = this.getPathStyles(percent, strokeWidth,75,'bottom');
        },

        makeLineData:function(opt){
            var dftOpt = {
                percent: 0,
                trailColor: '#f3f3f3',
                strokeColor: '#108ee9',
                strokeWidth: 10,
                isTpl: false,
                showInfo: true
            };
            var tOpt = Ext.merge({}, dftOpt);
            opt = Ext.apply(tOpt, opt || {});
            var tpl = [];
            if(opt.isTpl){
                tpl.push('<div class="sef-progress sef-progress-line">');
                tpl.push('<div>');
                tpl.push('<div class="sef-progress-outer">');
                    tpl.push('<div class="sef-progress-inner">');
                        tpl.push('<div class="sef-progress-bg" style="width:{percent}%;height:{strokeWidth}px"></div>');//,opt.percent,opt.strokeWidth));
                    tpl.push('</div>');
                tpl.push('</div>');
                tpl.push('<span class="sef-progress-text">{percent}%</span>');//,opt.percent));
                tpl.push('</div>');
                tpl.push('</div>');
            }else{
                tpl.push('<div class="sef-progress sef-progress-line">');
                tpl.push('<div>');
                tpl.push('<div class="sef-progress-outer">');
                    tpl.push('<div class="sef-progress-inner">');
                        tpl.push(Ext.String.format('<div class="sef-progress-bg" style="width:{0}%;height:{1}px"></div>',opt.percent,opt.strokeWidth));
                    tpl.push('</div>');
                tpl.push('</div>');
                tpl.push(Ext.String.format('<span class="sef-progress-text" style="{1}">{0}%</span>',opt.percent,opt.fontSize?"font-size:"+opt.fontSize+"px":""));
                tpl.push('</div>');
                tpl.push('</div>');
            }

            return tpl;
        }
    },

    makeCircleTpl: function() {
        var tplOpt = {
            //percent:this.percent,
            trailColor: '#f3f3f3',
            strokeColor: '#108ee9',
            trailWidth: 6,
            strokeWidth: 6,
            strokeLinecap: 'round',
            dashboard: this.pgType === 'dashboard',
            isTpl: true,
            showInfo: true
        };

        var tpl = sef.core.components.Progress.makeCircleData(tplOpt);
        console.log(tpl);
        return tpl;
        //return '<div>hello</div>';
    },

    makeLineTpl: function() {
        var tpl=sef.core.components.Progress.makeLineData({
            //percent:this.percent,
            //strokeWidth:this.strokeWidth,
            isTpl:true
        });
        //console.log('here is linetpl#',tpl);
        return tpl;
    },
    applyData:function(d){
        //debugger;
        
        return this.callParent([this.prepareData(d)]);
    },

    prepareData:function(d){
        //debugger;
        if(this.pgType==='line'){
            //d['width']
            return d;
        }
        var pathData=null;
        if (this.pgType === 'dashboard') {
            pathData = sef.core.components.Progress.getPathStyles(this.percent, d.strokeWidth, 75, 'bottom');
        } else {
            pathData = sef.core.components.Progress.getPathStyles(this.percent, d.strokeWidth, 0, this.gapPosition);
        }
        d['circelPath']=pathData.pathString;
        d['trailColor']='#f3f3f3';
        d['strokeColor']='#108ee9';
        d['trialStyle']=pathData.trailPathStyle;
        d['strokeStyle']=pathData.strokePathStyle;
        d['status']=this.status;
        return d;
    },
    initComponent: function() {
        var d= {
            percent: this.percent || 0,
            fontSize: this.fontSize || 18,
            strokeWidth: this.strokeWidth || 6,
            width: this.circleWidth || 132,
            height: this.circleHeight || 132
        };
        Ext.apply(this, {
            data:this.prepareData(d),
            tpl: this.pgType === 'line' ? this.makeLineTpl() : this.makeCircleTpl()
        });
        //debugger;

        this.callParent(arguments);
    }
});