/**
 * 图形-剪头
 */

define(function (require, exports) {

    var eventEmitter = require('../common/eventEmitter');
    var wipe = require('../common/wipe');
    /**
     * 箭头构造函数
     * @param {Object} options
     * @property {number} options.startX 起点x
     * @property {number} options.startY 起点y
     * @property {string} options.strokeColor 颜色
     * @property {string} options.lineWidth 宽度
     */
    function Arrow(options) {
        $.extend(this, {
            context: options.context,
            strokeColor: options.strokeColor,
            x: 0,
            y: 0,
            startX: options.startX,
            startY: options.startY
        });
    }

    Arrow.prototype = {


        compositeOperation: 'source-over',
        /**
         * 随鼠标画点
         * @param  {Object} pos
         * @property {number} pos.x
         * @property {number} pos.y
         */
        draw: function (pos) {

            var me = this;
            var ctx = me.context;

            wipe.clear();

            me.endX = pos.x;
            me.endY = pos.y;

            me.calculateTriangle();

            me.paint();

            eventEmitter
                .emit(
                    eventEmitter.DRAW_SHAPE_EVENT
                );
        },

        /**
         * 计算头部三角形
         * @return {[type]} [description]
         */
        calculateTriangle: function () {
            var me = this;
            var startX = me.startX;
            var startY = me.startY;

            var endX = me.endX;
            var endY = me.endY;

            var width = endX - startX;
            var height = endY - startY;

            var angle = Math.atan(height / width);

            if (endX < startX) {
                angle = angle - Math.PI;
            }

            var distance = Math.sqrt(Math.pow(width, 2) + Math.pow(height, 2));

            var arrowDistance = distance - 5;

            var wingPoint1 = {};
            var wingPoint2 = {};
            var arrowPoint = {};



            var arrowX = startX + arrowDistance * Math.cos(angle);
            var arrowY = startY + arrowDistance * Math.sin(angle);


            var unitY = height / distance;
            var unitX = width / distance;

            var arrowHeadSize = 15;

            wingPoint1.x = endX - unitX * arrowHeadSize - unitY * arrowHeadSize;
            wingPoint1.y = endY - unitY * arrowHeadSize + unitX * arrowHeadSize;

            wingPoint2.x = endX - unitX * arrowHeadSize + unitY * arrowHeadSize;
            wingPoint2.y = endY - unitY * arrowHeadSize - unitX * arrowHeadSize;


            $.extend(me, {
                wingPoint1: wingPoint1,
                wingPoint2: wingPoint2,
                arrowPoint: {
                    x: arrowX,
                    y: arrowY
                }
            });

        },

        getTrianglePoint: function () {

        },


        paint: function () {


            var me = this;
            var ctx = me.context;

            var startX = me.startX;
            var startY = me.startY;

            var endX = me.endX;
            var endY = me.endY;

            ctx.beginPath();

            ctx.strokeStyle = me.strokeColor;
            ctx.lineWidth = me.lineWidth;
            ctx.lineCap = me.lineCap;
            ctx.fillStyle = me.strokeColor;
            ctx.globalCompositeOperation = me.compositeOperation;


            // 直线
            ctx.moveTo(me.startX, me.startY);
            ctx.lineTo(endX, endY);


            ctx.moveTo(endX, endY);

            ctx.lineTo(me.wingPoint1.x, me.wingPoint1.y);
            ctx.lineTo(me.arrowPoint.x, me.arrowPoint.y);
            ctx.lineTo(me.wingPoint2.x, me.wingPoint2.y);

            ctx.closePath();

            ctx.fill();

            ctx.stroke();
        },

        repaint: function () {
            this.paint();
        },

        isPointInShape: function (pos) {
            var me = this;

            var minX = Math.min(
                me.wingPoint1.x,
                me.wingPoint2.x,
                me.startX,
                me.endX
            );

            var minY = Math.min(
                me.wingPoint1.y,
                me.wingPoint2.y,
                me.startY,
                me.endY
            );

            var maxX = Math.max(
                me.wingPoint1.x,
                me.wingPoint2.x,
                me.startX,
                me.endX
            );

            var maxY = Math.max(
                me.wingPoint1.y,
                me.wingPoint2.y,
                me.startY,
                me.endY
            );

            var posX = pos.x;
            var posY = pos.y;

            return posX < maxX
                && posX > minX
                && posY < maxY
                && posY > minY;
        }
    };

    return Arrow;
});