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
const middlewares_1 = require("../middlewares");
const dto_1 = require("../types/dto");
const client_1 = require("@prisma/client");
const express_response_errors_1 = require("express-response-errors");
const prisma_errors_1 = require("prisma-errors");
const services_1 = require("../services");
const controller = (0, express_1.Router)();
exports.controller = controller;
controller
    .post('/create', (0, middlewares_1.authorization)(client_1.Role.STUDENT), middlewares_1.blockDisabled, (0, middlewares_1.body)(dto_1.ReservationCreate), function (request, response, next) {
    var _a, _b, _c, _d, _e;
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const role = (_b = (_a = request === null || request === void 0 ? void 0 : request.user) === null || _a === void 0 ? void 0 : _a.UserLevel) === null || _b === void 0 ? void 0 : _b.role;
            if (role !== client_1.Role.STUDENT)
                throw new Error('Not a student');
            const { fileId, courseScheduleIds } = request.body;
            const reservation = yield services_1.db.reservation.create({
                data: {
                    fileId,
                    studentInformationId: (_d = (_c = request === null || request === void 0 ? void 0 : request.user) === null || _c === void 0 ? void 0 : _c.StudentInformation) === null || _d === void 0 ? void 0 : _d.id,
                    CourseSchedule: {
                        connectOrCreate: courseScheduleIds.map((id) => ({
                            where: {
                                id
                            },
                            create: {
                                courseScheduleId: id
                            }
                        }))
                    }
                },
                include: {
                    File: true,
                    CourseSchedule: true
                }
            });
            yield (0, services_1.dbLog)((_e = request === null || request === void 0 ? void 0 : request.user) === null || _e === void 0 ? void 0 : _e.id, `[RESERVATION] CREATE ${reservation.id}`);
            response.json(reservation);
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
    .post('/list', (0, middlewares_1.authorization)(client_1.Role.ADMIN, client_1.Role.REGISTRY, client_1.Role.STUDENT), middlewares_1.blockDisabled, (0, middlewares_1.body)(dto_1.ReservationList), function (request, response, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { skip, take } = request.body;
            delete request.body.skip;
            delete request.body.take;
            const reservations = yield services_1.db.reservation.findMany({
                where: request.body,
                skip,
                take,
                include: {
                    File: true,
                    CourseSchedule: true
                },
                orderBy: {
                    lastUpdated: 'desc'
                }
            });
            response.json(reservations);
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
    .post('/get', (0, middlewares_1.authorization)(client_1.Role.ADMIN, client_1.Role.REGISTRY, client_1.Role.STUDENT), middlewares_1.blockDisabled, (0, middlewares_1.body)(dto_1.ReservationGet), function (request, response, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const reservation = yield services_1.db.reservation.findUnique({
                where: request.body,
                include: {
                    File: true,
                    CourseSchedule: true
                }
            });
            response.json(reservation);
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
    .post('/update', (0, middlewares_1.authorization)(client_1.Role.ADMIN, client_1.Role.REGISTRY, client_1.Role.STUDENT), middlewares_1.blockDisabled, (0, middlewares_1.body)(dto_1.ReservationUpdate), function (request, response, next) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { id, fileId, status } = request.body;
            const reservation = yield services_1.db.reservation.update({
                where: {
                    id
                },
                data: {
                    fileId,
                    status
                }
            });
            yield (0, services_1.dbLog)((_a = request === null || request === void 0 ? void 0 : request.user) === null || _a === void 0 ? void 0 : _a.id, `[RESERVATION] UPDATE ${reservation.id}`);
            response.json(reservation);
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
