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
const middlewares_1 = require("../middlewares");
const dto_1 = require("../types/dto");
const services_1 = require("../services");
const express_response_errors_1 = require("express-response-errors");
const controller = (0, express_1.Router)();
exports.controller = controller;
controller.post('/list', (0, middlewares_1.authorization)(client_1.Role.ADMIN), middlewares_1.blockDisabled, (0, middlewares_1.body)(dto_1.UserLevelList), function (request, response, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { role } = request.body;
            const userLevels = yield services_1.db.userLevel.findMany({
                where: {
                    role: { in: role }
                },
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
            if (error instanceof Error)
                return next(new express_response_errors_1.InternalServerError(error.message));
            next(error);
        }
    });
});
