"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.responseErrorHandler = void 0;
const express_response_errors_1 = require("express-response-errors");
function responseErrorHandler(error, _request, response, next) {
    var _a;
    if ((_a = !(error instanceof express_response_errors_1.HttpError)) !== null && _a !== void 0 ? _a : response.headersSent) {
        if (typeof next !== 'undefined')
            return next(error);
    }
    const { code, message, name } = error;
    response.status(code).json({
        statusCode: code,
        message: message,
        error: name
            .replace(/([A-Z])/g, ' $1')
            .replace(/Error$/g, '')
            .trim()
    });
}
exports.responseErrorHandler = responseErrorHandler;
