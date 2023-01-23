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
/* eslint-disable indent */
const express_1 = require("express");
const middlewares_1 = require("../middlewares");
const client_1 = require("@prisma/client");
const dto_1 = require("../types/dto");
const express_response_errors_1 = require("express-response-errors");
const services_1 = require("../services");
const prisma_errors_1 = require("prisma-errors");
const controller = (0, express_1.Router)();
exports.controller = controller;
controller
    .post('/create', (0, middlewares_1.authorization)(client_1.Role.ADMIN, client_1.Role.REGISTRY), middlewares_1.blockDisabled, (0, middlewares_1.body)(dto_1.CourseScheduleCreate), function (request, response, next) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { from, to, day, courseId, classSectionId } = request.body;
            const courseSchedule = yield services_1.db.courseSchedule.create({
                data: {
                    from: from ? new Date('0 ' + from) : undefined,
                    to: from ? new Date('0 ' + to) : undefined,
                    day,
                    courseId,
                    classSectionId
                },
                include: {
                    ClassSection: true,
                    Course: true,
                    Reservations: true
                }
            });
            yield (0, services_1.dbLog)((_a = request === null || request === void 0 ? void 0 : request.user) === null || _a === void 0 ? void 0 : _a.id, `[COURSESCHEDULE] CREATE ${courseSchedule.id}`);
            response.json(courseSchedule);
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
    .post('/list', (0, middlewares_1.authorization)(client_1.Role.ADMIN, client_1.Role.REGISTRY), middlewares_1.blockDisabled, (0, middlewares_1.body)(dto_1.CourseScheduleList), function (request, response, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { from, to, day, courseId, programId, classSectionId, skip, take } = request.body;
            const courseSchedules = yield services_1.db.courseSchedule.findMany({
                where: {
                    courseId,
                    classSectionId,
                    day,
                    Course: programId
                        ? {
                            programId
                        }
                        : undefined,
                    AND: {
                        from: from ? { gte: new Date('0 ' + from) } : undefined,
                        to: to ? { lte: new Date('0 ' + to) } : undefined
                    }
                },
                skip,
                take,
                orderBy: {
                    lastUpdated: 'desc'
                },
                include: {
                    ClassSection: true,
                    Course: true,
                    Reservations: true
                }
            });
            response.json(courseSchedules);
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
    .post('/get', (0, middlewares_1.authorization)(client_1.Role.ADMIN, client_1.Role.REGISTRY), middlewares_1.blockDisabled, (0, middlewares_1.body)(dto_1.CourseScheduleGet), function (request, response, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const courseSchedule = yield services_1.db.courseSchedule.findUnique({
                where: request.body,
                include: {
                    ClassSection: true,
                    Course: true,
                    Reservations: true
                }
            });
            response.json(courseSchedule);
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
    .post('/update', (0, middlewares_1.authorization)(client_1.Role.ADMIN, client_1.Role.REGISTRY), middlewares_1.blockDisabled, (0, middlewares_1.body)(dto_1.CourseScheduleUpdate), function (request, response, next) {
    var _a, _b, _c;
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { id } = request.body;
            delete request.body.id;
            if (typeof ((_a = request.body) === null || _a === void 0 ? void 0 : _a.from) !== 'undefined')
                request.body.from = new Date('0 ' + request.body.from);
            if (typeof ((_b = request.body) === null || _b === void 0 ? void 0 : _b.to) !== 'undefined')
                request.body.to = new Date('0 ' + request.body.to);
            const courseSchedule = yield services_1.db.courseSchedule.update({
                where: { id },
                data: request.body,
                include: {
                    ClassSection: true,
                    Course: true,
                    Reservations: true
                }
            });
            yield (0, services_1.dbLog)((_c = request === null || request === void 0 ? void 0 : request.user) === null || _c === void 0 ? void 0 : _c.id, `[COURSESCHEDULE] UPDATE ${courseSchedule.id}`);
            response.json(courseSchedule);
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
    .post('/delete', (0, middlewares_1.authorization)(client_1.Role.ADMIN, client_1.Role.REGISTRY), middlewares_1.blockDisabled, (0, middlewares_1.body)(dto_1.CourseScheduleDelete), function (request, response, next) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { id } = request.body;
            const courseSchedule = yield services_1.db.courseSchedule.delete({
                where: { id },
                include: {
                    ClassSection: true,
                    Course: true,
                    Reservations: true
                }
            });
            yield (0, services_1.dbLog)((_a = request === null || request === void 0 ? void 0 : request.user) === null || _a === void 0 ? void 0 : _a.id, `[COURSESCHEDULE] DELETE ${courseSchedule.id}`);
            response.json(courseSchedule);
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
