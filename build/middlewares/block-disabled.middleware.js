"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.blockDisabled = void 0;
const express_response_errors_1 = require("express-response-errors");
function blockDisabled(request, _response, next) {
    const user = request.user;
    if (!user || (user === null || user === void 0 ? void 0 : user.enabled))
        return next();
    if (!user.enabled)
        next(new express_response_errors_1.UnauthorizedError('Account is disabled'));
}
exports.blockDisabled = blockDisabled;
