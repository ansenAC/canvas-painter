define(function (require, exports) {


    // 获取点击坐标点的位置
    exports.getPosition = function (event) {
        var canvasElement = $('#canvas');

        var canvasOffset = canvasElement.offset();

        return {
            x: event.pageX - canvasOffset.left,
            y: event.pageY - canvasOffset.top
        };
    }
});