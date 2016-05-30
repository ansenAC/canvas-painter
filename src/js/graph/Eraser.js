/**
 * 橡皮擦构造函数
 */
define(function (require, exports) {

    var eventEmitter = require('../common/eventEmitter');

    function Eraser(options) {

        $.extend(this, {
            context: options.context,
            strokeColor: options.strokeColor,
            lineWidth: options.lineWidth,
            centerX: options.startX,
            centerY: options.startY,
            radius: 10
        });

        var startPoint = {
            x: options.startX,
            y: options.startY
        };

        this.drawPoint = [];

        this.draw(startPoint);
    }

    Eraser.prototype = {

        compositeOperation: 'destination-out',

        draw: function (pos) {
            this.paint(pos);

            this.drawPoint.push(pos);
        },

        paint: function (pos) {
            console.log(pos);
            var me = this;
            var ctx = me.context;

            ctx.strokeStyle = me.strokeColor;
            ctx.lineWidth = me.lineWidth;
            ctx.lineCap = me.lineCap;
            ctx.globalCompositeOperation = me.compositeOperation;
            ctx.save();
            ctx.beginPath();

            ctx.arc(
                pos.x,
                pos.y,
                me.radius,
                0,
                Math.PI * 2,
                false
            );

            ctx.fill();
            ctx.restore();
            ctx.closePath();
        },

        repaint: function () {
            var me = this;
            var points = me.drawPoint;
            console.log(points);
            $.each(
                points,
                function (index, point) {

                    me.paint(
                        point
                    );
                }
            );
        },

    };



    return Eraser;
});