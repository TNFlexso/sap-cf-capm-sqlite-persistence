"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var strategies_1 = require("./strategies");
var strategies;
(function (strategies) {
    strategies[strategies["localProject"] = 0] = "localProject";
    strategies[strategies["amazonS3"] = 1] = "amazonS3";
})(strategies = exports.strategies || (exports.strategies = {}));
;
exports.strategyInstances = {
    localProject: new strategies_1.localProject(),
    amazonS3: new strategies_1.ObjectStore()
};
//# sourceMappingURL=interfaces.js.map