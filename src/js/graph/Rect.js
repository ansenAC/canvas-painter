/**
 * 图形-矩形
 */
define(function (require, exports) {

    var eventEmitter = require('../common/eventEmitter');

    var wipe = require('../common/wipe');

    /**
     * 矩形构造函数
     * @param {Object} options
     * @property {number} options.startX 起点x
     * @property {number} options.startY 起点y
     * @property {string} options.strokeColor 颜色
     * @property {string} options.lineWidth 宽度
     */
    function Rect(options) {

        $.extend(this, {
            context: options.context,
            strokeColor: options.strokeColor,
            lineWidth: options.lineWidth,
            x: 0,
            y: 0,
            originX: options.startX,
            originY: options.startY,
            height: 0,
            width: 0
        });

    }

    Rect.prototype = {

        compositeOperation: 'source-over',

        /**
         * 响应鼠标绘制矩形
         * @param  {Object} pos 当前鼠标点
         * @property {number} pos.x
         * @property {number} pos.y
         */
        draw: function (pos) {
            var me = this;
            var ctx = me.context;

            me.updatePoint(pos);

            wipe.clear();

            me.paint();

            eventEmitter
                .emit(
                    eventEmitter.DRAW_SHAPE_EVENT
                );

        },

        paint: function () {
            var me = this;
            var ctx = me.context;
            ctx.beginPath();

            ctx.strokeStyle = me.strokeColor;
            ctx.lineWidth = me.lineWidth;
            ctx.lineCap = me.lineCap;
            ctx.globalCompositeOperation = me.compositeOperation;

            ctx.strokeRect(me.x, me.y, me.width, me.height);

            ctx.closePath();
        },

        /**
         * 重绘接口
         */
        repaint: function () {
            this.paint();
        },

        updatePoint: function (pos) {
            var me = this;

            var posX = pos.x;
            var posY = pos.y;

            var originX = me.originX;
            var originY = me.originY;


            var startX = Math.min(originX, posX);
            var startY = Math.min(originY, posY);

            var endX = Math.max(originX, posX);
            var endY = Math.max(originY, posY);


            $.extend(this, {
                x: startX,
                y: startY,
                height: endY - startY,
                width: endX - startX
            });
        },

        isPointInShape: function (pos) {
            var me = this;
            var startX = me.x;
            var startY = me.y;

            var endX = startX + me.width;
            var endY = startY + me.height;

            var posX = pos.x;
            var posY = pos.y;

            return posX <= endX
                && posX >= startX
                && posY <= endY
                && posY >= startY;
        }

    };

    return Rect;
});