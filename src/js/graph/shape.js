
define(function (require, exports) {

    var Rect = require('./Rect');
    var Doodle = require('./Doodle');
    var Circle = require('./Circle');
    var Arrow = require('./Arrow');

    var wipe = require('../common/wipe');
    var eventEmitter = require('../common/eventEmitter');

    // 图形的基本属性
    var strokeAttr = {
        strokeColor: 'red',

        lineWidth: 1
    };

    var currentShape

    var shapeArr = [];



    /**
     * 删除指定画笔
     * @param {Object} pos 坐标点
     * @property {number} pos.x
     * @property {number} pos.y
     */
    function updateShape(pos) {
        console.log(pos);
        var shapeLen = shapeArr.length;

        if (shapeLen === 0) {
            return;
        }

        for (var i = shapeLen - 1; i >= 0; i--) {

            if (shapeArr[i].isPointInShape(pos)) {

                shapeArr.splice(i, 1);

                wipe.clear();
                exports.stroke();


                break;
            }
        }
    }

    /**
     * 设置线的颜色
     * @param {string} color
     */
    exports.setStrokeColor = function (color) {
        strokeAttr.strokeColor = color;
    };

    exports.getStrokeColor = function () {
        return strokeAttr.strokeColor;
    };

    /**
     * 设置线的宽度
     * @param {number} lineWidth
     */
    exports.setLineWidth = function (lineWidth) {
        strokeAttr.lineWidth = lineWidth;
    };

    exports.getLineWidth = function () {
        return strokeAttr.lineWidth;
    };



    exports.getShape = function (strokeType, startPos) {

        var defaultOptions = {
            context: exports.context,
            startX: startPos.x,
            startY: startPos.y,
            strokeColor: exports.getStrokeColor(),
            lineWidth: exports.getLineWidth()
        };

        switch (strokeType) {
            case 'doodle':
                currentShape = new Doodle(defaultOptions);
                break;
            case 'rect':
                currentShape = new Rect(defaultOptions);
                break;

            case 'circle':
                currentShape = new Circle(defaultOptions);
                break;
            case 'arrow':
                currentShape = new Arrow(defaultOptions);
                break;

            case 'eraser':
                currentShape = null;
                updateShape(startPos);
                break;

            default:
                break;
        }

        return currentShape;
    };


    /**
     * 存储图形
     */
    exports.store = function () {
        if (currentShape) {
            shapeArr.push(currentShape);
        }
    };

    /**
     * 绘画图形
     */
    exports.stroke = function () {
        $.each(
            shapeArr,
            function (index, shape) {
                shape.repaint();
            }
        );

    };

    /**
     * 清空
     */
    exports.clearAll = function () {
        wipe.clear();
        shapeArr = [];
    };


    exports.init = function (canvasElement, context) {

        exports.context = context;

        wipe.init(canvasElement, context);

        eventEmitter
            .on(
                eventEmitter.DRAW_SHAPE_EVENT,
                function () {
                    exports.stroke();
                }
            );
    };
});