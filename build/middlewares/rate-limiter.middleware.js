"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.rateLimiter = void 0;
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const express_response_errors_1 = require("express-response-errors");
function rateLimiter(passedOptions = {}) {
    return (0, express_rate_limit_1.default)(Object.assign({ windowMs: 60000 * 3, standardHeaders: true, legacyHeaders: false, handler: (_request, _response, next) => {
            next(new express_response_errors_1.TooManyRequestsError('Sorry, this link is automatically turned off for now, try again later'));
        } }, passedOptions));
}
exports.rateLimiter = rateLimiter;
