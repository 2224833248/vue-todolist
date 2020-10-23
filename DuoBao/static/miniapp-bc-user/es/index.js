"use strict";
var tslib_1 = require("tslib");
var pluginMethods;
var pluginId = '2021001161608103';
function loadBC() {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
    }
    var plugin = pluginId + "@*";
    return new Promise(function (res, rej) {
        my.loadPlugin({
            plugin: plugin,
            success: function () {
                pluginMethods = requirePlugin("dynamic-plugin://" + pluginId);
                pluginMethods
                    .init.apply(pluginMethods, tslib_1.__spreadArrays([my], args)).then(function (data) {
                    res({ success: true });
                })
                    .catch(function (err) {
                    rej({ msg: "bc plugin load config fail", err: err, success: false });
                });
            },
            fail: function (err) {
                rej({ msg: "plugin: " + plugin + " load fail", err: err, success: false });
            },
        });
    });
}
function getPluginMethods() {
    return pluginMethods;
}
module.exports = { loadBC: loadBC, getPluginMethods: getPluginMethods };
//# sourceMappingURL=index.js.map