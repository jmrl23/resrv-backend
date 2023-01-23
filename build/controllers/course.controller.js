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
const dto_1 = require("../types/dto");
const client_1 = require("@prisma/client");
const middlewares_1 = require("../middlewares");
const services_1 = require("../services");
const express_response_errors_1 = require("express-response-errors");
const prisma_errors_1 = require("prisma-errors");
const controller = (0, express_1.Router)();
exports.controller = controller;
controller
    .post('/create', (0, middlewares_1.authorization)(client_1.Role.ADMIN, client_1.Role.REGISTRY), middlewares_1.blockDisabled, (0, middlewares_1.body)(dto_1.CourseCreate), function (request, response, next) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const course = yield services_1.db.course.create({ data: request.body });
            yield (0, services_1.dbLog)((_a = request === null || request === void 0 ? void 0 : request.user) === null || _a === void 0 ? void 0 : _a.id, `[COURSE] CREATE ${course.id}`);
            response.json(course);
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
    .post('/list', (0, middlewares_1.authorization)(client_1.Role.ADMIN, client_1.Role.REGISTRY, client_1.Role.STUDENT), middlewares_1.blockDisabled, (0, middlewares_1.body)(dto_1.CourseList), function (request, response, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { take, skip, term, programId, keywords, enabled } = request.body;
            const courses = yield services_1.db.course.findMany({
                where: {
                    enabled,
                    name: {
                        search: keywords === null || keywords === void 0 ? void 0 : keywords.join(' ')
                    },
                    alias: {
                        search: keywords === null || keywords === void 0 ? void 0 : keywords.join(' ')
                    },
                    programId,
                    term
                },
                skip,
                take,
                orderBy: { lastUpdated: 'desc' }
            });
            response.json(courses);
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
    .post('/get', (0, middlewares_1.authorization)(client_1.Role.ADMIN, client_1.Role.REGISTRY, client_1.Role.STUDENT), middlewares_1.blockDisabled, (0, middlewares_1.body)(dto_1.CourseGet), function (request, response, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { id } = request.body;
            const course = yield services_1.db.course.findUnique({
                where: { id }
            });
            response.json(course);
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
    .post('/update', (0, middlewares_1.authorization)(client_1.Role.ADMIN, client_1.Role.REGISTRY), middlewares_1.blockDisabled, (0, middlewares_1.body)(dto_1.CourseUpdate), function (request, response, next) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { id } = request.body;
            delete request.body.id;
            const course = yield services_1.db.course.update({
                where: { id },
                data: request.body
            });
            yield (0, services_1.dbLog)((_a = request === null || request === void 0 ? void 0 : request.user) === null || _a === void 0 ? void 0 : _a.id, `[COURSE] UPDATE ${course.id}`);
            response.json(course);
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
    .post('/delete', (0, middlewares_1.authorization)(client_1.Role.ADMIN, client_1.Role.REGISTRY), middlewares_1.blockDisabled, (0, middlewares_1.body)(dto_1.CourseDelete), function (request, response, next) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { id } = request.body;
            const course = yield services_1.db.course.delete({
                where: { id }
            });
            yield (0, services_1.dbLog)((_a = request === null || request === void 0 ? void 0 : request.user) === null || _a === void 0 ? void 0 : _a.id, `[COURSE] DELETE ${course.id}`);
            response.json(course);
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
