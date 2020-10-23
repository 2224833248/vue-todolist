"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("../../../tslib");
Component({
    initInvoke: false,
    mixins: [],
    data: {
        show: false,
        info: [],
    },
    props: {
        name: '',
        code: '',
        ext: {},
    },
    onInit: function () {
        this.initInvoke = true;
        this.init();
    },
    didMount: function () {
        if (!this.initInvoke)
            this.init();
    },
    didUpdate: function () { },
    didUnmount: function () { },
    methods: {
        init: function () {
            return tslib_1.__awaiter(this, void 0, void 0, function () {
                var pluginMethods, info;
                return tslib_1.__generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            pluginMethods = getApp().globalData.bc.getPluginMethods();
                            if (!pluginMethods) {
                                if (typeof this.props.onError === 'function')
                                    this.props.onError({ msg: 'pluginMethods is undefined', code: this.props.code, name: this.props.name });
                                throw new Error('pluginMethods is undefined');
                            }
                            return [4, pluginMethods.getComponentByCode(this.props.code, this.props.name)];
                        case 1:
                            info = _a.sent();
                            if (!info) {
                                if (typeof this.props.onError === 'function')
                                    this.props.onError({ msg: 'module not found', code: this.props.code, name: this.props.name });
                                throw new Error('module not found');
                            }
                            this.setData({ show: true, info: info });
                            return [2];
                    }
                });
            });
        },
    },
});
//# sourceMappingURL=bc-module.js.map