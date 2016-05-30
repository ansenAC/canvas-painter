/**
 * @下拉菜单组件
 * @author anchen01
 */

define(function (require, exports) {


    /**
     * 下拉选择组件
     * @param {Object} options
     * @param {jQuery} options.button        select按钮  （必须传）
     * @param {jQuery} options.layer         select浮层  （必须传）
     * @param {string} options.attrValueName     属性名，点击浮层获该取属性值
     * @param {Object} options.listSelector  浮层项选择器
     * @param {Object} options.onLayerOpen   打开浮层触发
     * @param {Object} options.onLayerClose  关闭浮层触发
     * @param {Object} options.setText       选中菜单后触发，兼容之前的Select所以保留
     * @param {Object} options.onChange      选中菜单后触发
     */
    function Select(options) {

        $.extend(this, defaultOptions, options);

        this.init();
    }


    Select.prototype = {

        constructor: Select,

        docElement: $(document),

        // 浮层展现状态
        layerShow: false,

        init: function () {

            var me = this;

            me.button.on('click', function (e) {

                if (me.layerShow) {
                    me.hideLayer();
                }
                else {
                    me.showLayer();
                }

                // 阻止事件冒泡到document
                e.stopPropagation();
            });

            me.docElement.on('click', $.proxy(me.onClick, me));
        },


        /**
         * 触发document上的点击事件
         *
         * @param  {Object} e 事件
         */
        onClick: function (e) {

            var me = this;

             // 点击在layer内部
            if (me.isInternal(e.target)) {

                var target = $(e.target);

                var text = $.trim(target.html());

                var value = target.attr(me.attrValueName);

                if (!value) {
                    return;
                }

                if (typeof me.onChange === 'function') {

                    me.onChange({
                        text: text,
                        value: value
                    });
                }

                if (typeof me.setText === 'function') {

                    me.setText({
                        text: text,
                        value: value
                    });
                }
            }

            me.hideLayer();
        },

        /**
         * 展示浮层
         *
         */
        showLayer: function () {
            this.layer.show();
            this.layerShow = true;

            if (typeof this.onLayerOpen === 'function') {
                this.onLayerOpen();
            }
        },

        /**
         * 关闭浮层
         *
         */
        hideLayer: function () {
            this.layer.hide();
            this.layerShow = false;

            if (typeof this.onLayerClose === 'function') {
                this.onLayerClose();
            }
        },


        /**
         * 判断点击事件是在layer浮层内
         * @param  {HTMLElement} target 点击的dom元素
         * @return {boolean}            判断是否再浮层layer中
         */
        isInternal: function (target) {
            return $.contains(this.layer.get(0), target)
                || this.layer.get(0) === target;
        },

        /**
         * 销毁对象
         */
        dispose: function () {
            var me = this;
            // 释放事件
            me.button.off('click');
            me.docElement.off('click', me.onClick);
            // 释放变量
            me.button = me.layer = me.docElement = null;
        }

    };

    /**
     * 默认配置项
     *
     */
    var defaultOptions = {
        // 从列表dom的自定义属性中取值
        attrValueName: 'data-value',
        // select列表项选择器
        listSelector: 'li',
        // 打开浮层要触发的函数
        onLayerOpen: null,
        // 关闭浮层要触发的函数
        onLayerClose: null,

        setText: null,
        // 点击浮层要触发函数
        onChange: null
    };

    return Select;

});