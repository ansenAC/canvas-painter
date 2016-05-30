/**
 * 图形-涂鸦
 */

define(function (require, exports) {

    /**
     * 涂鸦构造函数
     * @param {Object} options
     * @property {number} options.startX 起点x
     * @property {number} options.startY 起点y
     * @property {string} options.strokeColor 颜色
     * @property {string} options.strokeColor 宽度
     */
    function Doodle(options) {
        $.extend(this, options, {
            maxX: options.startX,
            maxY: options.startY,
            minX: options.startX,
            minY: options.startY
        });
        this.drawPoint = [];
        this.init();
    }

    Doodle.prototype = {


        compositeOperation: 'source-over',


        init: function () {
            var me = this;

            // 初始点放入列表
            me.drawPoint.push({
                x: me.startX,
                y: me.startY
            });
        },



        /**
         * 响应鼠标绘制矩形
         * @param  {Object} pos
         * @property {number} pos.x
         * @property {number} pos.y
         */
        draw: function (pos) {

            var me = this;
            var ctx = me.context;

            var drawPointLength = me.drawPoint.length;

            var prevPos = me.drawPoint[drawPointLength - 1];

            me.updateBorderPoint(pos)

            me.paint(prevPos, pos);

            me.drawPoint.push(pos);
        },


        paint: function (prevPos, nextPos) {
            var me = this;
            var ctx = me.context;

            ctx.strokeStyle = me.strokeColor;
            ctx.lineWidth = me.lineWidth;
            ctx.lineCap = me.lineCap;
            ctx.globalCompositeOperation = me.compositeOperation;

            ctx.beginPath();

            ctx.moveTo(prevPos.x, prevPos.y);



            ctx.lineTo(nextPos.x, nextPos.y);
            ctx.closePath();

            ctx.stroke();

            // console.log(ctx.isPointInPath(prevPos.x, prevPos.y));
        },

        /**
         * 重绘接口
         */
        repaint: function () {
            var me = this;
            var points = me.drawPoint;

            $.each(
                points,
                function (index, point) {
                    if (index < points.length - 1) {
                        me.paint(
                            point,
                            points[index + 1]
                        );
                    }

                }
            );
        },

        updateBorderPoint: function (pos) {
            var me = this;
            var posX = pos.x;
            var posY = pos.y;

            var minX = me.minX;
            var minY = me.minY;
            var maxX = me.maxX;
            var maxY = me.maxY;

            me.minX = Math.min(posX, minX);
            me.minY = Math.min(posY, minY);

            me.maxX = Math.max(posX, maxX);
            me.maxY = Math.max(posY, maxY);
        },

        isPointInShape: function (pos) {
            var me = this;
            var posX = pos.x;
            var posY = pos.y;

            var minX = me.minX;
            var minY = me.minY;
            var maxX = me.maxX;
            var maxY = me.maxY;

            return posX < maxX
                && posX > minX
                && posY < maxY
                && posY > minY;
        }

    };

    return Doodle;

});