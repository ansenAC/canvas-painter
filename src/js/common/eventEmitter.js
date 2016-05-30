define(function (require, exports) {

    var eventEmitter = $({});


    exports.on = function (e, handler) {
        eventEmitter.on(e, handler);
    };


    exports.emit = function (e) {
        eventEmitter.trigger(e);
    };



    exports.DRAW_SHAPE_EVENT = 'draw_shape_event';


    return exports;

});