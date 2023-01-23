"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logger = void 0;
const morgan_1 = __importDefault(require("morgan"));
const configurations_1 = require("../configurations");
function logger(request, response, next) {
    switch (configurations_1.NODE_ENV) {
        case 'production':
            return (0, morgan_1.default)('common')(request, response, next);
        case 'development':
            return (0, morgan_1.default)('dev')(request, response, next);
        default:
            next();
    }
}
exports.logger = logger;
