//FlowChartDrawer

Ext.define('sef.core.components.flowchart.Drawer', {
    extend: 'Ext.draw.Container',
    xtype: 'sef-flowdrawer',
    autoSize: true,
    plugins: ['spriteevents'],
    /**
     * @requires Ext.draw.plugin.SpriteEvents
     */
    requires: [
        'Ext.draw.plugin.SpriteEvents',
        'Ext.draw.sprite.Rect',
        'Ext.draw.sprite.Circle',
        'Ext.draw.sprite.Path',
        'Ext.draw.sprite.Arrow',
        'Ext.draw.sprite.Composite',
         'Ext.draw.sprite.Text'
    ],
    //floating:true,

    config: {
        //chartLayout: 'maxUpOrDownLayerLayout'
        chartDir: '',
        chartMargin: 10,
        layerSpacing: 50,
        diagramWidth: 60,
        diagramHeight: 40,
        diagramBorderColor: '#108ee9',
        labelFontSize: '12px',
        dummyNodeColor: '#108ee9',
        edgeColor: '#108ee9'

    },

    privates: {
        _settings: {
            margin: 0, // margin around the DAG     
            layerSpacing: 50, // space between layers (vertically)
            nodes: {
                spacing: 20, // space between nodes (horizontally)
                label: {
                    marginWidth: 5, // margin between text and rectangle 
                    marginHeight: 0,
                    fontSize: '12px',
                    fontWeight: 'lighter',
                    //strokeStyle:'#fff',
                    //'font-size': '12px',
                    'font-family': ' "Helvetica Neue For Number",-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"PingFang SC","Hiragino Sans GB","Microsoft YaHei","Helvetica Neue",Helvetica,Arial,sans-serif',
                    //'font-weight': 'normal',
                },
                rect: {
                    width: 60, // minimum width (resized if the text is bigger)
                    height: 40, // minimum height
                    fillStyle: '#fff',
                    radius: 5,
                    'fill-opacity': 1,
                    strokeStyle: 'blue',
                    'stroke-width': 2
                },
            },
            highlightedNodes: {
                rect: {
                    fill: 'orange',
                    stroke: 'red',
                    'fill-opacity': 0.5,
                },
            },
            dummyNodes: {
                fillStyle: 'black',
                radius: 2,
            },
            edges: {
                color: 'red',
                arrow_height: 6, // size of head of the arrows
            },
            interaction: {

            }
        }
    },


    _constructor: function(options) {
        Ext.Object.merge(this, options);
        Ext.applyIf(this.settings.highlightedNodes, this.settings.nodes);
        Ext.applyIf(this.settings.highlightedNodes.rect, this.settings.nodes.rect);
        Ext.applyIf(this.settings.highlightedNodes.label, this.settings.nodes.label);
        this.callParent();
    },

    initComponent: function() {
        //debugger;
        this.computeLayout = FlowChartDrawerLayout.topDownLayerLayout;
        if (this.dag) {
            this.flowChartLayout = this.computeLayout.call(null, this.dag);
        } else {
            this.flowChartLayout = null;
        }


        this.settings = Ext.apply({}, this._settings);
        Ext.apply(this.settings, {
            margin: this.chartMargin, // margin around the DAG      
            layerSpacing: this.layerSpacing
        });
        Ext.apply(this.settings.nodes.label, {
            fontSize: this.labelFontSize
        });
        Ext.apply(this.settings.nodes.rect, {
            width: this.diagramWidth,
            height: this.diagramHeight,
            strokeStyle: this.diagramBorderColor
        });
        this.settings.dummyNodes.fillStyle = this.dummyNodeColor;
        this.settings.edges.color = this.edgeColor;
        var me = this;
        Ext.apply(this, {
            listeners: {
                spriteclick: function(item) {
                    var sprite = item && item.sprite;
                    if (!sprite) return;
                    //console.log('here is over...', sprite, sprite.isRectGroup);
                    if (sprite.isRectGroup === true) {
                        me.fireEvent('flownodeclick', sprite.dataId, sprite.nodeType);
                        //console.log(sprite.nodeType,sprite.dataId);
                    }
                },
                spritemouseover: function(item) {
                    var sprite = item && item.sprite;
                    if (!sprite) return;
                    //console.log('here is over...', sprite, sprite.isRectGroup);
                    if (sprite.isRectGroup === true) {
                        //do anim
                        var rect = sprite.sprites[0];
                        var t = 10; //settings.interaction.radius;
                        //console.log('will set rect.style',rect);
                        rect.setAttributes({
                            fillStyle: '#3F51B5'
                        }, true);
                        rect.getSurface().renderFrame();

                    }
                    //return;
                },
                spritemouseout: function(item) {
                    var sprite = item && item.sprite;
                    if (!sprite) return;
                    //console.log('here is over...', sprite, sprite.isRectGroup);
                    if (sprite.isRectGroup === true) {
                        //do anim
                        var rect = sprite.sprites[0];
                        var colors = sef.core.components.flowchart.Drawer.COLORS[sprite.nodeType];
                        var attb = {};
                        attb['fillStyle'] = colors.rect;
                        attb['strokeStyle'] = colors.border;
                        rect.setAttributes(attb, true);
                        attb = {};
                        attb['strokeStyle'] = colors.label;
                        sprite.sprites[1].setAttributes(attb, true);


                        rect.getSurface().renderFrame();
                        sprite.sprites[1].getSurface().renderFrame();
                    }
                }
            }
        });
        this.callParent(arguments);
        //console.log('testConfig#',this.getChartLayout());

    },



    onRender: function() {
        this.callParent();

        //debugger;
        var surface = this.getSurface();
        //surface.setSize(1000,600);
        this.backgroundSprite = surface.add({
            type: 'rect',
            opacity: 1.1,
            stroke: 'red',//transparent',
            width: 100,
            height: 100,
            _fillStyle: '#000'
        });

        this.updateFlowData();

    },

    updateFlowData: function(data) {
        //debugger;
        if (!this.flowChartLayout && data) {
            this.dag = data;
            this.flowChartLayout = this.computeLayout.call(null, this.dag);
        }
        if (this.flowChartLayout) {
            this.allShapes = this.applyLayout(this.flowChartLayout);

            this.center();
        }

    },

    redraw:function(w,h){
        //this.setSize(w,h);
        return;
        this.flowChartLayout = this.computeLayout.call(null, this.dag);
        this.allShapes = this.applyLayout(this.flowChartLayout);
        this.center();
        console.log('will redraw now',w,h);
    },

    updateNodeStatus: function(s, newStatus) {
        var sprite = null;
        var surface = this.getSurface();
        //if(Ext.isNumber(s))s=''+s+'';
        if (Ext.isNumber(s)) {
            surface.getItems().forEach(function(sp) {

                if (sp.dataId === s) {
                    sprite = sp;
                    return false;
                }
            });
        } else {
            sprite = s;
        }
        if (!sprite) return;
        //console.log('found sprite#',sprite);
        newStatus = newStatus.toLowerCase();
        if (sprite.nodeType === newStatus) return;
        sprite.nodeType = newStatus;
        var rect = sprite.sprites[0];
        var label = sprite.sprites[1];
        var colors = sef.core.components.flowchart.Drawer.COLORS[newStatus];
        var attb = {};
        attb['fillStyle'] = colors.rect;
        attb['strokeStyle'] = colors.border;
        rect.setAttributes(attb, true);
        attb = {};
        attb['strokeStyle'] = colors.label;
        label.setAttributes(attb, true);


        surface.renderFrame();
    },

    doTest: function() {
        var surface = this.getSurface();

        var test = this.buildNode(surface, {
            itemId: 't',
            label: '中文更多描述性测试'
        }, 20, this.settings);
        surface.renderFrame();
        return;
        /*
        var rect=surface.add({
            type:'rect'
        });
        
        rect.setAttributes({
            x:10,
            y:10,
            width:100,
            height:100,
            strokeStyle:'red',
            lineWidth:1
        },true);


        var secRect=surface.add({
            type:'rect'
        });
        secRect.setAttributes({
            x:150,
            y:150,
            width:50,
            height:50,
            strokeStyle:'blue',
            lineWidth:1
        },true);
        */

        var backgroundSprite = surface.add({
            type: 'rect',
            opacity: 0.5,
            stroke: 'red',
            width: 100,
            height: 100,
            fillStyle: 'green'
        });
        var group = Ext.createByAlias('sprite.composite', {
            surface: surface
        });
        group.add({
            type: 'rect',
            width: 100,
            height: 100,
            strokeStyle: 'red'
        });


        var label = group.add({
            type: 'text',
            text: 'Hello',
            width: 100,
            height: 100,
            strokeStyle: 'blue'
        });
        label.setAttributes({
            translationX: 10,
            translationY: 20
        }, true);
        //console.log(label);

        //group.add(secRect);


        surface.add(group);
        group.setAttributes({
            translationX: 50,
            translationY: 50
        });


        var group2 = Ext.createByAlias('sprite.composite', {
            surface: surface,
            itemId: 'group_002'
        });
        group2.add({
            type: 'rect',
            width: 100,
            height: 100,
            strokeStyle: 'red'
        });


        var label2 = group2.add({
            type: 'text',
            text: 'Hello',
            width: 100,
            height: 100,
            strokeStyle: 'blue'
        });
        label2.setAttributes({
            translationX: 10,
            translationY: 20
        }, true);
        //console.log(label);

        //group.add(secRect);


        surface.add(group2);
        group2.setAttributes({
            translationX: 250,
            translationY: 250
        });

        this.drawEdge(surface, group, group2); //, line, bg)
        var allItems = surface.getItems();
        var marginX = 10;
        var marginY = 10;
        //console.log(allItems);
        sef.core.components.flowchart.Drawer.TRANSLATE(allItems, marginX, marginY); //,10);// settings.margin, settings.margin);
        var box = surface.getBBox(allItems); //, true);
        //var box2=surface.getBBox(allItems,false);
        console.log(box);
        backgroundSprite.setAttributes({
            x: -marginX,
            y: -marginY,
            width: box.width + 2 * marginX,
            height: box.height + 2 * marginY
        }, true);
        surface.setSize(box.width + 2 * marginX, box.height + 2 * marginY);
        /*
        var settings = this.settings;
        var surface = this.getSurface();
        var box = surface.getBBox(surface.getItems(), true); //surface.getBBox();
        console.log(surface.getSize(), this.getSize(), box, surface.getItems());

        var x = (this.getSize().width - box.width) / 2;
        var y = 30;
        console.log(x, y);
        sef.core.components.flowchart.Drawer.TRANSLATE(surface.getItems(), x, y); // settings.margin, settings.margin);
        return;
        //debugger;
        //sef.core.components.flowchart.Drawer.TRANSLATE(surface.getItems(), settings.margin, settings.margin);
        //var box = surface.items.getBBox();

        // create artificial margin
        this.backgroundSprite.setAttributes({
            x: 100, // -this.settings.margin,
            y: -this.settings.margin,
            width: box.width + 2 * settings.margin,
            height: box.height + 2 * settings.margin,
        }, true);

        //if (this.viewBox && this.autoSize) {
        if (this.autoSize) {
            // resize canvas
            surface.setSize(box.width + 2 * settings.margin, box.height + 2 * settings.margin);
            this.autoSize = false;
        };
        surface.renderFrame();
        */

        surface.renderFrame();
    }

}, function(cls) {
    //debugger;
    extend_drawer_info();
});


function extend_drawer_info() {
    //============================
    //Group: Layout

    /*
     * Method: applyLayout
     *
     * apply a layout to the graph, and draw it
     *
     * Parameters: layout - {dag: {nodes:, edges:}, layers: }
     *
     * Returns: list of shapes
     * 
     */

    sef.core.components.flowchart.Drawer.prototype.applyLayout = function(layout) {
            this.eraseAll();

            var settings = this.settings;
            var surface = this.getSurface();

            var shapes_by_layer = this.buildShapesByLayer(surface, layout.dag.nodes,
                layout.layers, settings);


            this.setLayerHeights(shapes_by_layer, settings);
            this.centerLayersHorizontally(shapes_by_layer, settings);
            //console.log('all layout#', layout, shapes_by_layer);
            var allShapes = [];
            allShapes.push(shapes_by_layer);
            surface.renderFrame();
            //var surface = this.getSurface();
            var connections = this.initEdges(surface, shapes_by_layer, layout.dag.edges, settings);
            connections.forEach(function(s) {
                if (s.line)
                    allShapes.push(s.shape);
                if (s.bg)
                    allShapes.push(s.bg)
            });
            return allShapes;
        },


        //=====================
        //Group: Other Methods

        /*
         * Method: eraseAll
         *
         * delete and erase all shapes
         *
         */
        sef.core.components.flowchart.Drawer.prototype.eraseAll = function() {
            console.log(this.allShapes);
            if (this.allShapes)
                this.allShapes.forEach(function(s) {
                    if(Ext.isArray(s)){
                        s.forEach(function(ss){
                            ss.remove();
                        })
                    }else s.remove(); 
                    });
            this.allShapes = null;
        },

        /*
         * Method: center
         *
         * center the whole graph drawing
         *
         */
        sef.core.components.flowchart.Drawer.prototype.center = function(force) {

            var surface = this.getSurface();
            var allItems = surface.getItems();
            var marginX = 10;
            var marginY = 10;
            //console.log(allItems);
            //console.log(this.getSize(),this.getSurface().getSize());
            var box = surface.getBBox(allItems); //, true);
            if(force===true){
                sef.core.components.flowchart.Drawer.TRANSLATE(allItems, 0, 0);
            }

            var dx = (this.getSize().width - box.width - marginX) / 2 + marginX;
            //console.log('hole box1#:',box,dx);
            sef.core.components.flowchart.Drawer.TRANSLATE(allItems, dx, marginY); //,10);// settings.margin, settings.margin);
            box = surface.getBBox(allItems); //, true);
            //var box2=surface.getBBox(allItems,false);
            //console.log('hole box#:',box);
            this.backgroundSprite.setAttributes({
                x: -marginX,
                y: -marginY,
                width: box.width + 2 * marginX,
                height: box.height + 2 * marginY
            }, true);

            if (this.autoSize) {
                // resize canvas
                surface.setSize(box.width + 2 * marginX, box.height + 2 * marginY);
                this.autoSize = false;
            };
            surface.renderFrame();

        }




    //============================
    //Group: Shapes related Methods

    /*
     * Method: initEdges
     *
     * create the drawing/shapes for the edges
     *
     * Parameters: surface - the Ext.draw canvas, allShapes - the list of all
     * Shapes/graphics, should contain the node shapes, edges - the edges list :
     * <edges>, settings - the user settings : <settings>
     *
     * Returns: the list of edge shapes
     *
     */
    sef.core.components.flowchart.Drawer.prototype.initEdges = function(surface, shapes_by_layer, edges, settings) {
        // make a hash of node names
        var shape_by_name = {};
        shapes_by_layer.forEach(function(layer) {
            layer.forEach(function(shape) {
                shape_by_name[shape.node.name] = shape;
            });
        });

        var color = settings.edges.color;
        var me = this;
        var connections = edges.map(function(e) {
            var pred = shape_by_name[e[0]];
            var succ = shape_by_name[e[1]];
            //console.log(pred,succ);
            var c = me.drawEdge(surface, pred, succ, color);

            return c;
        });

        return connections;
    }

    /*
     * Method: buildShapesByLayer
     *
     * create the nodes shapes and organize them by layer.
     *
     * Parameters: surface - the Ext.draw canvas, nodes - the nodes :
     * <nodes>, layers - the layers : a list of lists of nodes, settings - the
     * user settings : <settings>
     *
     * Returns: a list of lists of nodes, ordered by layer
     *
     */
    sef.core.components.flowchart.Drawer.prototype.buildShapesByLayer = function(surface, nodes,
        layers, settings) {

        var me = this;
        var shapes_by_layer = [];

        layers.forEach(function(layer) {
            var entry = [];
            layer.forEach(function(node) {
                var lnodes = nodes[node];
                lnodes.name = node;
                entry.push(lnodes);
            });
            var shapes = me.buildNodeShapes(surface, entry, settings);
            shapes_by_layer.push(shapes);
        });

        return shapes_by_layer;
    }

    /*
     * Method: centerLayersHorizontally
     *
     * Center horizontally all the layers. It translates the shapes in the
     * layers.
     *
     * Parameters: shapes_by_layer - the shapes by layer as returned by
     * <buildShapesByLayer>
     *
     */
    sef.core.components.flowchart.Drawer.prototype.centerLayersHorizontally = function(shapes_by_layer) {
        // compute all width
        var widths = shapes_by_layer.map(function(layer) {
            var bb = layer[layer.length - 1].getBBox();
            return bb.x + bb.width;
        });

        var maxWidth = widths.reduce(function(a, b) {
            return Math.max(a, b)
        });

        // now center all layers
        shapes_by_layer.forEach(function(layer) {
            var bb = layer[layer.length - 1].getBBox();
            var x = maxWidth - (bb.x + bb.width);

            if (x > 0) {
                layer.forEach(function(shape) {
                    sef.core.components.flowchart.Drawer.TRANSLATE(shape, x / 2, 0);
                });
            }
        });
    }

    /*
     * Method: setLayerHeights
     *
     * Center horizontally all the layers. It translates the shapes in the
     * layers.
     *
     * Parameters: shapes_by_layer - the shapes by layer as returned by
     * <buildShapesByLayer>, settings - the user settings : <settings>
     *
     */
    sef.core.components.flowchart.Drawer.prototype.setLayerHeights = function(shapes_by_layer, settings) {
        // process layers
        var spacing = settings.layerSpacing;
        var y = 0;

        shapes_by_layer.forEach(function(layer) {
            var layerHeight = 0;
            layer.forEach(function(shape) {
                layerHeight = Math.max(shape.getBBox().height, layerHeight);
                sef.core.components.flowchart.Drawer.TRANSLATE(shape, 0, y);
            });
            layer.forEach(function(shape) {
                sef.core.components.flowchart.Drawer.TRANSLATE(shape, 0, layerHeight / 2);
            });

            y += layerHeight + spacing;
        });
    }

    /*
     * Method: buildNodeShapes
     *
     * Build the node shapes.
     *
     * Parameters: surface - the Ext.draw canvas, nodes - the list of nodes, settings -
     * the user settings : <settings>
     *
     * Returns: a list of shapes
     *
     */
    sef.core.components.flowchart.Drawer.prototype.buildNodeShapes = function(surface, nodes, settings) {
        var shapes = [];
        var x = 0;
        var me = this;

        nodes.forEach(function(node) {
            var s = me.buildNode(surface, node, x, settings);
            s.node = {};
            s.node = node;
            x += s.getBBox().width + me.settings.nodes.spacing;

            shapes.push(s);
        });

        return shapes;
    }

    /*
     * Method: buildNode
     *
     * Build the shape of a node.
     *
     * Parameters: surface - the Ext.draw canvas, node - the node, x - the shape
     * horizontal coordinate, settings - the user settings : <settings>
     *
     * Returns: a shape
     *
     */

    sef.core.components.flowchart.Drawer.COLORS = {
        'default': {
            'rect': '#fff',
            'label': '#9E9E9E',
            'border': '#108ee9'
        },
        'doing': {
            'rect': '#108ee9',
            'label': 'white',
            'border': '#108ee9'
        },
        'complete': {
            'rect': '#4CAF50',
            'label': '#fff',
            'border': '#4CAF50'
        }
    };

    sef.core.components.flowchart.Drawer.prototype.buildNode = function(surface, node, x, settings) {
        var nodSettings = settings.nodes;
        //else nodSettings = settings.highlightedNodes;
        var nodeType = node.nodeType || 'default';

        var rectWidth = nodSettings.rect.width;
        var rectHeight = nodSettings.rect.height;

        //console.log('node info#',node);

        // the node object : a composite sprite
        var group = Ext.createByAlias('sprite.composite', {
            surface: surface,
            isRectGroup: true,
            dataId: node.dataId,
            nodeType: node.nodeType
                //itemId: 'grp_' + node.itemId
        });

        // ? is it a dummy node ???
        if (node.dummy) {
            var dummy = group.add({
                type: 'circle',
                x: x,
                y: rectHeight / 2,
            });

            dummy.setAttributes(settings.dummyNodes, true);
            //sprites.add(dummy);
        } else {
            //console.log('running for here');
            // build a rectangle around the label
            var rect = group.add({
                //itemId: 'rect_' + node.itemId,
                type: 'rect',
                x: x,
                y: 0,
                strokeStyle: 'blue',
                fillStyle: '#fff',
                _highlighted: node.highlighted
            });

            var label = group.add({
                type: 'text',
                //itemId: 'text_' + node.itemId,
                x: x,
                y: 0,
                textBaseline: 'middle',
                text: node.label,
                _link: node.link
            });

            var colors = sef.core.components.flowchart.Drawer.COLORS[nodeType];
            var attb = nodSettings.rect;
            attb['fillStyle'] = colors.rect;
            attb['strokeStyle'] = colors.border;
            rect.setAttributes(attb, true);
            attb = nodSettings.label;
            attb['strokeStyle'] = colors.label;
            label.setAttributes(attb, true);

            var labelBB = label.getBBox();
            var labelWidth = labelBB.width + 2 * nodSettings.label.marginWidth + rect.attr['stroke-width'];
            var labelHeight = labelBB.height + 2 * nodSettings.label.marginHeight + rect.attr['stroke-width'];

            // check if we need to resize the rectangle
            if (labelWidth > rectWidth)
                rect.setAttributes({ width: labelWidth }, true);

            if (labelHeight > rectHeight)
                rect.setAttributes({ height: labelHeight }, true);
            var rectBB = rect.getBBox();
            var labelX = rectBB.width / 2 - labelBB.width / 2;
            var labelY = rectBB.height / 2 - labelBB.height / 2 - labelBB.y;

            sef.core.components.flowchart.Drawer.TRANSLATE([label], labelX, labelY);



        }

        surface.add(group);
        //surface.renderFrame();
        return group;
    }


    /*
     * Method: drawDownwardsArrowHead
     *
     * draw and build the shape of an arrow head, pointing downwards. The extreme
     * point where the arrow is pointing is (0,0)
     *
     * Parameters: surface - the Ext.draw canvas, height - the height of the arrow, color -
     * the color of the arrow
     *
     * Returns: the arrow head shape
     *
     */
    sef.core.components.flowchart.Drawer.prototype.drawDownwardsArrowHead = function(surface, height, color) {
        //height = 100;
        //console.log('will draw arrow');
        var x = height / 2;
        var h = -height - 1;
        var arrow = {
            type: 'path',
            path: 'M' + -x + ',' + h + 'L' + 0 + ',' + -1 + 'L' + x + ',' + h + 'C' + 0 + ',' + h + 2 + ',' + -x + ',' + h + 'Z',
            //path:['M',-x,h,'L',0,-1,'L',x,h,'C',0,h,2,',',-x,',',h,'Z'].join(' '),
            //path: 'M20,30 c0,-50 75,50 75,0 c0,-50 -75,50 -75,0',
            stroke: color,
            fill: color,
            _translate: {
                x: 50,
                y: 50
            }
        };
        return arrow;
        var arrow = surface.add({
            type: 'path',
            path: 'M' + -x + ',' + h + 'L' + 0 + ',' + -1 + 'L' + x + ',' + h + 'C' + 0 + ',' + h + 2 + ',' + -x + ',' + h + 'Z',
            //path:['M',-x,h,'L',0,-1,'L',x,h,'C',0,h,2,',',-x,',',h,'Z'].join(' '),
            //path: 'M20,30 c0,-50 75,50 75,0 c0,-50 -75,50 -75,0',
            stroke: color,
            fill: color,
            _translate: {
                x: 50,
                y: 50
            }
        });

        return arrow;
    }

    /*
     * Method: drawEdge
     *
     * draw an edge between two objects/shapes borrowed from raphaeljs example
     * <http://raphaeljs.com/graffle.js>
     *
     * Parameters: surface - the Ext.draw canvas, obj1 - source shape, obj2 - destination
     * shape, line - the edge color
     *
     *
     * Returns: the edge shape
     *
     */
    sef.core.components.flowchart.Drawer.prototype.drawEdge = function(surface, obj1, obj2, line, bg) {
        //debugger;
        if (obj1.line && obj1.from && obj1.to) {
            line = obj1;
            obj1 = line.from;
            obj2 = line.to;
        }

        var arrowHeight = this.settings.edges.arrow_height;

        var bb1 = obj1.getBBox();
        var bb2 = obj2.getBBox();

        //console.log('bb1,bb2#', bb1, bb2);
        // origin
        var xo = bb1.x + bb1.width / 2;
        var yo = bb1.y + bb1.height + 1;

        // destination
        var xd = bb2.x + bb2.width / 2;
        var yd = bb2.y - 1;

        var xmid = (xo + xd) / 2;
        var ymid = (yo + yd) / 2;
        var color = typeof line == "string" ? line : "#000";
        var path = ["M", xo.toFixed(3), yo.toFixed(3), "C", xo.toFixed(3),
            ymid.toFixed(3), xd.toFixed(3), ymid.toFixed(3), xd.toFixed(3),
            (yd - arrowHeight).toFixed(3)
        ].join(","); //.join(",");


        var set = Ext.createByAlias('sprite.composite', {
            surface: surface
        });

        var arrow = set.add(this.drawDownwardsArrowHead(surface, arrowHeight, color));
        //arrow.setAttributes({ translate: { x: xd, y: yd } }, true);
        arrow.setAttributes({ translationX: xd, translationY: yd }, true);



        var line = set.add({
            type: 'path',
            path: path,
            stroke: color,
            fill: 'none'
        });

        //set.add(line);
        //set.add(arrow);
        surface.add(set);

        return {
            bg: bg && bg.split && surface.add({
                type: 'path',
                path: path,
                stroke: bg.split("|")[0],
                fill: 'none',
                'stroke-width': bg.split("|")[1] || 3
            }),
            line: line,
            shape: set,
            arrow: arrow,
            from: obj1,
            to: obj2
        };
    }


    /*
     * Static Method: TRANSLATE 
     * 
     * translate a Sprite or a CompositeSprite (from ExtJS4)
     * 
     * Parameters: sprites - the sprites to translate, dx - the horizontal delta, dy - the vertical delta
     *
     */

    //var __FLOWCHART_DRAWER=sef.core.components.flowchart.Drawer;
    sef.core.components.flowchart.Drawer.TRANSLATE = function(sprites, dx, dy) {
        //debugger;
        //if(!sprites)debugger;
        if (sprites.type === 'composite') {
            sprites = sprites.sprites; //();
        }
        sprites.forEach(function(sprite) {
            sprite.setAttributes({
                _translate: {
                    //x: sprite.attr.translation.x + dx,
                    x: sprite.attr.translationX + dx,
                    y: sprite.attr.translationY + dy
                },
                translationX: sprite.attr.translationX + dx,
                translationY: sprite.attr.translationY + dy
            }, true);
        })
    }

    //__FLOWCHART_DRAWER.LAYOUT_MGR=FlowChartDrawerLayoutMgr
}









function FlowChartDrawerLayout() {

}


/*
 * Function: topDownLayerLayout
 *
 * Compute a layout using - longestPathLayering - topDown layer sweep
 *
 * Parameter: dag - the nodes and the edges lists
 *
 * Returns: {dag:, layers: }
 * 
 */

FlowChartDrawerLayout.topDownLayerLayout = function(dag) {
    var layers = FlowChartDrawerLayout.longestPathLayering(dag);

    // add dummy nodes and corresponding edges
    var dagAndLayers = FlowChartDrawerLayout.addDummyNodes(dag, layers);

    var res = FlowChartDrawerLayout.topDownLayerByLayerSweep(dagAndLayers.dag, dagAndLayers.layers, FlowChartDrawerLayout.two_layer_adjacent_exchange);

    return { dag: dagAndLayers.dag, layers: res.layers };
}

/*
 * Function: bottomUpLayerLayout
 *
 * Compute a layout using - longestPathLayering - bottom_up layer sweep
 *
 * Parameter: dag - the nodes and the edges lists
 *
 * Returns: {dag:, layers: }
 * 
 */
FlowChartDrawerLayout.bottomUpLayerLayout = function(dag) {

    var layers = FlowChartDrawerLayout.longestPathLayering(dag);

    // add dummy nodes and corresponding edges
    var dagAndLayers = FlowChartDrawerLayout.addDummyNodes(dag, layers);

    var res = FlowChartDrawerLayout.bottomUpLayerByLayerSweep(dagAndLayers.dag, dagAndLayers.layers, FlowChartDrawerLayout.two_layer_adjacent_exchange);

    return { dag: dagAndLayers.dag, layers: res.layers };
}



/*
 * Function: maxUpOrDownLayerLayout
 *
 * Compute a layout using - longestPathLayering - max(bottom_up, top_down) layer
 * sweep
 *
 * Parameter: dag - the nodes and the edges lists
 *
 * Returns: {dag:, layers: }
 * 
 */
FlowChartDrawerLayout.maxUpOrDownLayerLayout = function(dag) {
    var layers = FlowChartDrawerLayout.longestPathLayering(dag);

    // add dummy nodes and corresponding edges
    var dagAndLayers = FlowChartDrawerLayout.addDummyNodes(dag, layers);

    var res = FlowChartDrawerLayout.orderLayersUsing2waysSweep(dagAndLayers.dag, dagAndLayers.layers, FlowChartDrawerLayout.two_layer_adjacent_exchange);

    return { dag: dagAndLayers.dag, layers: res.layers };
}


// ==============================
// Group: Setup

/*
 * Function: compute_successors
 *
 * Compute the list of successors
 *
 * Parameter: dag - the nodes and the edges lists 
 *
 * Returns: successors - hash of nodes: sorted list of nodes
 *
 *
 */
FlowChartDrawerLayout.compute_successors = function(dag) {
    var successors = {};
    for (nn in dag.nodes) {
        successors[nn] = [];
    }
    dag.edges.forEach(function(e) {
        successors[e[0]].push(e[1]);
    });
    for (nn in dag.nodes) {
        successors[nn].sort(function(a, b) {
            return a < b ? -1 : a == b ? 0 : 1
        });
    }
    return successors;
}


// =========
// Group: Layering

/*
 * Function: longestPathLayering
 *
 * Simple algorithm that computes the layers of a digraph 
 * See "Graph Drawing" pp272
 *
 * This algorithm produces the minimum number of layers, but some layers may be
 * quite large compared to the others.
 *
 * Parameter: dag - the nodes and the edges lists 
 *
 * Returns: the layers - a list of lists of node indices
 *
 */
FlowChartDrawerLayout.longestPathLayering = function(dag) {
    // make a hash of out edges from nodes
    var out_edges = {};
    var in_edges_counts = {};
    for (var name in dag.nodes) {
        out_edges[name] = [];
        in_edges_counts[name] = 0;
    }

    dag.edges.forEach(function(e) {
        out_edges[e[0]].push(e[1]);
        in_edges_counts[e[1]]++;
    });

    // init queue with sources
    var queue = [];
    for (var nodename in dag.nodes) {
        if (in_edges_counts[nodename] == 0)
            queue.push(nodename);
    }

    var longest_path = {};
    for (var nodename in dag.nodes)
        longest_path[nodename] = 0;

    var n = null;
    while (n = queue.pop()) {
        var l = longest_path[n] + 1;
        out_edges[n].forEach(function(son) {
            longest_path[son] = Math.max(longest_path[son], l);
            queue.push(son);
        });
    }

    var layers = [];
    for (var nodename in dag.nodes) {
        var l = longest_path[nodename];
        if (!layers[l])
            layers[l] = [];
        layers[l].push(nodename);
    }


    return layers;
}

/*
 * Function: addDummyNodes
 *
 * Add dummy nodes so that no edge crosses a layer.
 *
 * The edges crossing a layer are broken in several edges passing by dummy
 * nodes.
 *
 * Parameters: dag - the nodes and the edges lists, layers - a list of node indices, 
 * see <longestPathLayering>
 *
 * Returns: an object with {
 *  dag: the newly created dag with dummy nodes, 
 *  layers: the layers
 * }
 */
FlowChartDrawerLayout.addDummyNodes = function(dag, layers) {
    var layer_by_node = {};
    for (var i = 0; i < layers.length; ++i)
        layers[i].forEach(function(n) { layer_by_node[n] = i; });

    var dagWithDummies = { nodes: dag.nodes, edges: [] };
    var new_layers = layers;

    dag.edges.forEach(function(e) {
        var a = e[0],
            b = e[1];
        var pred = a;

        if (layer_by_node[b] - layer_by_node[a] > 1) {
            for (var l = layer_by_node[a] + 1; l < layer_by_node[b]; ++l) {
                var name = ['dummy', a, b, l].join('_');
                var node = {
                    label: '',
                    dummy: true
                };
                dagWithDummies.nodes[name] = node;
                new_layers[l].push(name);

                dagWithDummies.edges.push([pred, name]);
                pred = name;
            }
            dagWithDummies.edges.push([pred, b]);
        } else {
            dagWithDummies.edges.push(e);
        }
    });

    return { dag: dagWithDummies, layers: new_layers };
}


// ======================
// Group: Layer ordering

/*
 * Function: two_layer_adjacent_exchange
 *
 * 2-layer crossing minimization problem : Algorithm adjacent exchange. This is
 * the base method for layer ordering
 * See Graph Drawing pp283
 * 
 * Parameters: nodes - the list of nodes, successors - the list
 * of successors, layer1 - ordered layer : an array of node indices, layer2 -
 * an array of node indices.
 *
 * Returns: an object with: {
 *  crossings: the matrix of crossing numbers, see <compute_crossing_numbers>,
 *  lower_bound: the lower bound of the number of crossing numbers : int,
 *  ordering: an ordering of layer2 : list of nodes indices
 * }
 */

FlowChartDrawerLayout.two_layer_adjacent_exchange = function(nodes, successors,
    layer1, layer2) {
    var crossings = FlowChartDrawerLayout.compute_crossing_numbers(successors, layer1,
        layer2);
    var cn = FlowChartDrawerLayout.compute_crossing(crossings, layer2);
    var lb = FlowChartDrawerLayout.compute_crossing_lower_bound(crossings, layer2);

    if (cn == lb) { // already optimal, nothing to do
        return {
            crossings: cn,
            lower_bound: lb,
            ordering: layer2
        };
    }

    var best_crossing = cn;
    var l2 = layer2.slice();
    var n2 = l2.length,
        i = 0,
        left = 0,
        right = 0,
        cross = 0;
    while (true) {
        left = l2[0];
        for (i = 1; i < n2; ++i) { // scan
            right = l2[i];

            if (crossings[left][right] > crossings[right][left]) {
                // swap nodes
                l2[i - 1] = right;
                l2[i] = left;
            }

            left = l2[i];
        }
        // compute
        cross = FlowChartDrawerLayout.compute_crossing(crossings, l2);

        if (cross >= best_crossing)
            break;
        best_crossing = cross;
        if (best_crossing == lb)
            break; // reached the lower bound
    }
    return {
        crossings: best_crossing,
        lower_bound: lb,
        ordering: l2
    };
}


/*
 * Function: topDownLayerByLayerSweep
 *
 * Do a top-down layer by layer sweep ordering to reduce the number of
 * crossings.
 *
 * The two-layer algorithm function is given as argument, and takes
 * (dag.nodes, successors, layer1, layer2) as arguments, and return a hash of
 * {crossings:#, ordering:list}
 *
 * Parameters: dag - the nodes and the edges lists, layers_orig - a list of 
 * node indices, see <longestPathLayering>, two_layer_algorithm - the algorithm 
 * to use for 2-layer minimization problem : function, see <two_layer_adjacent_exchange>
 *
 * Returns: an object with: {
 *  crossings: the matrix of crossing numbers, see <compute_crossing_numbers>,
 *  lower_bound:the lower bound of the number of crossing numbers : int,
 *  layers: the ordered layers : list of nodes indices
 * }
 */
FlowChartDrawerLayout.topDownLayerByLayerSweep = function(dag, layers_orig, two_layer_algorithm) {
    var successors = FlowChartDrawerLayout.compute_successors(dag);
    var nb = layers_orig.length;

    var layers = layers_orig.map(function(t) {
        return t.slice()
    }); // clone

    var best = Number.MAX_VALUE;

    var lower_bound = 0;
    var l1 = layers[0];
    var nb_crossings = 0;
    for (var i = 1; i < nb; ++i) {
        var l2 = layers[i];
        var res = two_layer_algorithm.call(null, dag.nodes, successors,
            l1, l2);
        lower_bound += res.lower_bound;
        nb_crossings += res.crossings;
        l1 = layers[i] = res.ordering;
    }

    best = nb_crossings;

    return {
        crossings: best,
        lower_bound: lower_bound,
        layers: layers
    };
}

/*
 * 
 * Function: bottomUpLayerByLayerSweep
 *
 * Do a bottom-up layer by layer sweep to reduce crossing number. calls
 * <topDownLayerByLayerSweep>
 *
 * Parameters: dag - the nodes and the edges lists, layers - a list of list of 
 * node indices, see <longestPathLayering>, two_layer_algorithm - the algorithm to use for 
 * 2-layer minimization problem : function
 * 
 */
FlowChartDrawerLayout.bottomUpLayerByLayerSweep = function(dag, layers, two_layer_algorithm) {
    // inverse layers and edges
    var reversed_edges = dag.edges.map(function(e) { return e.slice().reverse() });
    var reversed_layers = layers.slice().reverse();
    var reversed_dag = { nodes: dag.nodes, edges: reversed_edges };

    var res = FlowChartDrawerLayout.topDownLayerByLayerSweep(reversed_dag,
        reversed_layers, two_layer_algorithm);
    res.layers.reverse();

    return res;
}

/*
 * Function: orderLayersUsing2waysSweep
 *
 * Do a topDown layer sweep *and* a bottomUp one, and return the layering of
 * which minimizes the number of crossings. See <bottomUpLayerByLayerSweep> and
 * <topDownLayerByLayerSweep>
 *
 * Parameters: dag - the nodes and the edges lists, layers - a list of list of 
 * node indices, see <longestPathLayering>, algo - the algorithm to use for 
 * 2-layer minimization problem : function
 *
 */

FlowChartDrawerLayout.orderLayersUsing2waysSweep = function(dag, layers, algo) {

    var res_top = FlowChartDrawerLayout.topDownLayerByLayerSweep(dag, layers, algo);
    var res_up = FlowChartDrawerLayout.bottomUpLayerByLayerSweep(dag, layers, algo);

    return res_top.crossings < res_up.crossings ? res_top : res_up;
}

/*
 * Function: compute_crossing
 *
 * Compute the number of crossings between one ordered layer and
 * an ordering of the next layer Useful to test an layer ordering
 *
 * Parameters: matrix - the matrix of crossing numbers, as computed by
 * <compute_crossing_numbers> layer2 - the layer : an array of node indices.
 *
 * Returns: the number of crossings - int
 * 
 */
FlowChartDrawerLayout.compute_crossing = function(matrix, layer2) {
    var n2 = layer2.length;
    var crossings = 0;
    for (var i = 0; i < n2; ++i) {
        for (var j = i + 1; j < n2; ++j)
            crossings += matrix[layer2[i]][layer2[j]];
    }
    return crossings;
}

/*
 * Function: compute_crossing_lower_bound
 *
 * Compute the lower bound of the number of crossings between
 * one ordered layer and the next (unordered) layer.
 *
 * Parameters: matrix - the matrix of crossing numbers, as computed by
 * <compute_crossing_numbers> layer2 - the layer : a list of node indices.
 *
 * Returns: lower bound - int
 * 
 */
FlowChartDrawerLayout.compute_crossing_lower_bound = function(matrix, layer2) {
    var n2 = layer2.length;
    var lb = 0;
    for (var i = 0; i < n2; ++i) {
        for (var j = i + 1; j < n2; ++j)
            lb += Math.min(matrix[layer2[i]][layer2[j]],
                matrix[layer2[j]][layer2[i]]);
    }
    return lb;
}

/*
 * Function: compute_crossing_numbers
 *
 * Compute the crossing numbers for layer 2 assuming that layer1
 * is ordered.
 *
 * Parameters: successors - the list of successors, layer1 - ordered layer : a
 * list of node indices, layer2 - the unordered layer : a list of node indices.
 *
 * Returns: matrix - a matrix n2 by n2 where n2 is the # of nodes in layer2
 * 
 */

FlowChartDrawerLayout.compute_crossing_numbers = function(successors, layer1, layer2) {
    var n1 = layer1.length;
    var p = layer1[0];
    var isNodeLayer2 = {};
    layer2.forEach(function(x) {
        isNodeLayer2[x] = true
    });

    // init crossing matrix
    var matrix = {};
    var n2 = layer2.length;
    for (var i = 0; i < n2; ++i) {
        var t = matrix[layer2[i]] = {};
        for (var j = 0; j < n2; ++j)
            t[layer2[j]] = 0;
    }

    // compute all successor lists from layer1 to layer2
    var succs = {};
    layer1.forEach(function(n) {
        var list = successors[n];
        succs[n] = list.filter(function(x) {
            return isNodeLayer2[x]
        });

    });

    var psucc, pn, qsucc, qn, p, q, p2, q2;
    for (var pi = 0; pi < n1; ++pi) {
        p = layer1[pi];
        psucc = succs[p];
        pn = psucc.length;
        for (var qi = pi + 1; qi < n1; ++qi) {
            q = layer1[qi];
            qsucc = succs[q];
            qn = qsucc.length;
            for (var i = 0; i < pn; ++i) {
                p2 = psucc[i];
                for (var j = 0; j < qn; ++j) {
                    q2 = qsucc[j];
                    if (p2 != q2)
                        matrix[q2][p2]++;
                }
            }
        }
    }

    return matrix;
}