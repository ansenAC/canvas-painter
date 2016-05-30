/**
 * 测试白板
 */
define(function (require, exports) {

    var Select = require('./common/Select');
    var position = require('./common/position');
    var shape = require('./graph/shape');
    var eventEmitter = require('./common/eventEmitter');

    var painerNameSpace = '.painter';

    var defaultStrokeType = 'doodle';
    var strokeType = defaultStrokeType;


    var painter;


    function initOperation() {
        var operationElement = $('#operation');

        var fontGroup = operationElement.find('.font-group');
        var colorGroup = operationElement.find('.color-group');

        var fontSelect = new Select({
            button: fontGroup.find('.btn'),
            layer: fontGroup.find('.menu'),
            onChange: function (data) {
                this.button.html(data.value);
                shape.setLineWidth(+data.value);
            }
        });


        var colorSelect = new Select({
            button: colorGroup.find('.btn'),
            layer: colorGroup.find('.menu'),
            onChange: function (data) {
                this.button.attr('data-value', data.value);
                strokeColor = data.value;
                shape.setStrokeColor(data.value);
            }
        });

    }

    exports.init = function () {

        var canvasElement =
        exports.canvasElement = $('#canvas');

        var canvasDom = canvasElement.get(0);

        var ctx =
        exports.canvasContext = canvasDom.getContext('2d');

        var operationElement =
        exports.operationElement = $('#operation');

        operationElement
            .on(
                'click',
                '.action-tool',
                function () {
                    var activeItem = $(this);
                    strokeType = activeItem.attr('data-type') || defaultStrokeType;

                    activeItem.siblings('.active').removeClass('active');

                    activeItem.addClass('active');
                }
            )
            .on(
                'click',
                '.tool-trash',
                function () {
                    // 清空
                    shape.clearAll();
                }
            );

        initOperation();

        var eventHandler = {};

        eventHandler['mousemove' + painerNameSpace] = function (e) {
            var movePos = position.getPosition(e);
            if (painter) {
                painter.draw(movePos);
            }

        };

        eventHandler['mouseup' + painerNameSpace] = function () {
            canvasElement.off(painerNameSpace);
            shape.store();
        };

        eventHandler['mouseleave' + painerNameSpace] = function() {
            canvasElement.off(painerNameSpace);
            shape.store();
        };

        canvasElement
            .on('mousedown', function (e) {

                var startPos = position.getPosition(e);
                painter = shape.getShape(strokeType, startPos);

                canvasElement.on(eventHandler);
            });

        shape.init(canvasElement, ctx);

    };

});