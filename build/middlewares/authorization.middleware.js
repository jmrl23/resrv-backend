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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorization = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const services_1 = require("../services");
const configurations_1 = require("../configurations");
const express_response_errors_1 = require("express-response-errors");
function authorization(...role) {
    const UNAUTHORIZED_MESSAGE = 'Sorry, your request could not be processed';
    return function (request, _response, next) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            if (((_a = request.query) === null || _a === void 0 ? void 0 : _a.authorization) === configurations_1.AUTHORIZATION_KEY ||
                (configurations_1.NODE_ENV === 'development' && configurations_1.BYPASS_AUTHORIZATION_ON_DEVELOPMENT))
                return next();
            const auth = request.header('authorization');
            if (!auth || !auth.startsWith('Bearer'))
                return next(new express_response_errors_1.UnauthorizedError(UNAUTHORIZED_MESSAGE));
            const token = auth.split(' ')[1];
            try {
                const { id } = jsonwebtoken_1.default.verify(token, configurations_1.JWT_SECRET);
                const user = (yield services_1.cache.get(`user.${id}`));
                if (!user || !(user === null || user === void 0 ? void 0 : user.UserLevel) || !role.includes(user.UserLevel.role))
                    return next(new express_response_errors_1.UnauthorizedError(UNAUTHORIZED_MESSAGE));
                next();
            }
            catch (_error) {
                next(new express_response_errors_1.UnauthorizedError(UNAUTHORIZED_MESSAGE));
            }
        });
    };
}
exports.authorization = authorization;
