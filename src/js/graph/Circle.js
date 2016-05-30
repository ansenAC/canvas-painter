/**
 * 圆形-圆形
 */

define(function (require, exports) {

    var eventEmitter = require('../common/eventEmitter');
    var wipe = require('../common/wipe');

    function Circle(options) {
        $.extend(this, {
            context: options.context,
            strokeColor: options.strokeColor,
            lineWidth: options.lineWidth,
            x: 0,
            y: 0,
            originX: options.startX,
            originY: options.startY,
            radius: 0
        });
    }

    Circle.prototype = {

        compositeOperation: 'source-over',

        draw: function (pos) {

            this.updatePoint(pos);
            // 清空
            wipe.clear();

            this.paint();

            eventEmitter
                .emit(
                    eventEmitter.DRAW_SHAPE_EVENT
                );
        },

        paint: function () {
            var me = this;
            var ctx = me.context;

            var startAngle = 0;
            var endAngle = Math.PI * 2;
            var antiClockWise = false;

            ctx.strokeStyle = me.strokeColor;
            ctx.lineWidth = me.lineWidth;
            ctx.lineCap = me.lineCap;
            ctx.globalCompositeOperation = me.compositeOperation;

            ctx.beginPath();

            ctx.arc(
                me.x,
                me.y,
                me.radius,
                startAngle,
                endAngle,
                antiClockWise
            );

            ctx.stroke();

            ctx.closePath();
        },

        repaint: function () {
            this.paint();
        },

        updatePoint: function (pos) {
            var me = this;

            var startX = me.originX;
            var startY = me.originY;

            var endX = pos.x;
            var endY = pos.y;

            var height = endY - startY;
            var width = endX - startX;

            radiusX = parseInt(width / 2);
            radiusY = parseInt(height / 2);

            if (!radiusX || !radiusY) {
                return;
            }

            // 直径
            var diameter = Math.round(
                Math.sqrt(Math.pow(height, 2) + Math.pow(width, 2))
            );

            $.extend(this, {
                x: startX + radiusX,
                y: startY + radiusY,
                radius: diameter / 2
            });
        },

        /**
         * 点是否在图形内
         * @param {Object} pos
         * @param {property} pos.x
         * @param {property} pos.y
         * @return {boolean}
         */
        isPointInShape: function (pos) {
            var me = this;
            var height = pos.y - me.y;
            var width = pos.x - me.x;

            var distance = Math.round(
                Math.sqrt(Math.pow(height, 2) + Math.pow(width, 2))
            );

            return distance < me.radius;
        }
    };

    return Circle;

});