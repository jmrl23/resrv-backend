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
const express_1 = require("express");
const services_1 = require("../services");
const express_response_errors_1 = require("express-response-errors");
const client_1 = require("@prisma/client");
const middlewares_1 = require("../middlewares");
const dto_1 = require("../types/dto");
const prisma_errors_1 = require("prisma-errors");
const controller = (0, express_1.Router)();
exports.controller = controller;
controller.post('/send', (0, middlewares_1.authorization)(client_1.Role.ADMIN, client_1.Role.REGISTRY), middlewares_1.blockDisabled, (0, middlewares_1.body)(dto_1.GmailSend), function (request, response, next) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const data = yield (0, services_1.sendMail)(request.body);
            yield (0, services_1.dbLog)((_a = request === null || request === void 0 ? void 0 : request.user) === null || _a === void 0 ? void 0 : _a.id, `[SERVICE] GMAIL.SEND ${data === null || data === void 0 ? void 0 : data.id}`);
            response.json(data);
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
