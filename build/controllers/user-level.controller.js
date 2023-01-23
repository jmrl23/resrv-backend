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
exports.controller = void 0;
const client_1 = require("@prisma/client");
const express_1 = require("express");
const dto_1 = require("../types/dto");
const middlewares_1 = require("../middlewares");
const express_response_errors_1 = require("express-response-errors");
const prisma_errors_1 = require("prisma-errors");
const services_1 = require("../services");
const controller = (0, express_1.Router)();
exports.controller = controller;
controller
    .post('/set', (0, middlewares_1.authorization)(client_1.Role.ADMIN), middlewares_1.blockDisabled, (0, middlewares_1.body)(dto_1.UserLevelSet), function (request, response, next) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const user = request.user;
            const { email } = request.body;
            if ((user === null || user === void 0 ? void 0 : user.email) === email)
                throw new express_response_errors_1.BadRequestError('Cannot perform the request');
            const userLevel = yield services_1.db.userLevel.upsert({
                where: { email },
                update: request.body,
                create: request.body,
                include: {
                    User: true
                }
            });
            yield (0, services_1.dbLog)((_a = request === null || request === void 0 ? void 0 : request.user) === null || _a === void 0 ? void 0 : _a.id, `[USERLEVEL] SET ${userLevel.id}`);
            response.json(userLevel);
        }
        catch (error) {
            console.error(error);
            if (error instanceof express_response_errors_1.HttpError)
                return next(error);
            if (error instanceof Error)
                return next(new express_response_errors_1.BadRequestError((0, prisma_errors_1.tryToPrismaError)(error).message));
        }
    });
})
    .post('/list', (0, middlewares_1.authorization)(client_1.Role.ADMIN), middlewares_1.blockDisabled, (0, middlewares_1.body)(dto_1.UserLevelList), function (request, response, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { skip, take, role } = request.body;
            const userLevels = yield services_1.db.userLevel.findMany({
                where: {
                    role: {
                        in: role
                    }
                },
                skip,
                take,
                include: {
                    User: true
                },
                orderBy: {
                    lastUpdated: 'desc'
                }
            });
            response.json(userLevels);
        }
        catch (error) {
            console.error(error);
            if (error instanceof express_response_errors_1.HttpError)
                return next(error);
            if (error instanceof Error)
                return next(new express_response_errors_1.BadRequestError((0, prisma_errors_1.tryToPrismaError)(error).message));
        }
    });
})
    .post('/delete', (0, middlewares_1.authorization)(client_1.Role.ADMIN), middlewares_1.blockDisabled, (0, middlewares_1.body)(dto_1.UserLevelDelete), function (request, response, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const user = request.user;
            const { email } = request.body;
            if ((user === null || user === void 0 ? void 0 : user.email) === email)
                throw new express_response_errors_1.BadRequestError('Cannot perform the request');
            const userLevel = yield services_1.db.userLevel.delete({
                where: { email }
            });
            response.json(userLevel);
        }
        catch (error) {
            console.error(error);
            if (error instanceof express_response_errors_1.HttpError)
                return next(error);
            if (error instanceof Error)
                return next(new express_response_errors_1.BadRequestError((0, prisma_errors_1.tryToPrismaError)(error).message));
        }
    });
});
