"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.notFound = void 0;
const express_response_errors_1 = require("express-response-errors");
function notFound(request, _response, next) {
    next(new express_response_errors_1.NotFoundError(`Cannot ${request.method} ${request.url}`));
}
exports.notFound = notFound;
