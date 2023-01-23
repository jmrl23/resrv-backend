"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.body = void 0;
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
const express_response_errors_1 = require("express-response-errors");
function body(Cls) {
    return function (request, _response, next) {
        var _a, _b, _c;
        return __awaiter(this, void 0, void 0, function* () {
            if (!((_a = request.headers['content-type']) === null || _a === void 0 ? void 0 : _a.startsWith('application/json')))
                return next(new express_response_errors_1.BadRequestError('Invalid Content-Type'));
            const instance = (0, class_transformer_1.plainToInstance)(Cls, (_b = request.body) !== null && _b !== void 0 ? _b : {});
            const constraints = (_c = (yield (0, class_validator_1.validate)(instance, {
                whitelist: true,
                stopAtFirstError: true
            }))[0]) === null || _c === void 0 ? void 0 : _c.constraints;
            for (const key in constraints) {
                return next(new express_response_errors_1.BadRequestError(constraints[key]));
            }
            request.body = instance;
            next();
        });
    };
}
exports.body = body;
