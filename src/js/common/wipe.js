/**
 * 擦除
 */
define(function (require, exports) {

    exports.init = function (canvasElement, context) {
        $.extend(this, {
            canvasHeight: +canvasElement.attr('height'),
            canvasWidth: +canvasElement.attr('width'),
            context: context
        });
    };


    exports.clear = function () {
        var me = this;
        me.context.clearRect(0, 0, me.canvasWidth, me.canvasHeight);
    };
});