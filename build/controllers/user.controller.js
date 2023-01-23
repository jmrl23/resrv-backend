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
const express_response_errors_1 = require("express-response-errors");
const services_1 = require("../services");
const prisma_errors_1 = require("prisma-errors");
const controller = (0, express_1.Router)();
exports.controller = controller;
controller
    .get('/current', (0, middlewares_1.authorization)(client_1.Role.ADMIN, client_1.Role.REGISTRY, client_1.Role.STUDENT), function (request, response) {
    response.json(request.user);
})
    .post('/list', (0, middlewares_1.authorization)(client_1.Role.ADMIN, client_1.Role.REGISTRY), middlewares_1.blockDisabled, (0, middlewares_1.body)(dto_1.UserList), function (request, response, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { role, take, skip, keywords, enabled, programId, studentId } = request.body;
            const users = yield services_1.db.user.findMany({
                where: {
                    enabled,
                    UserLevel: {
                        role: { in: role }
                    },
                    givenName: {
                        search: keywords === null || keywords === void 0 ? void 0 : keywords.join(' ')
                    },
                    familyName: {
                        search: keywords === null || keywords === void 0 ? void 0 : keywords.join(' ')
                    },
                    email: {
                        search: keywords === null || keywords === void 0 ? void 0 : keywords.join(' ')
                    },
                    StudentInformation: {
                        programId,
                        studentId
                    }
                },
                skip,
                take,
                orderBy: {
                    lastUpdated: 'desc'
                },
                include: {
                    UserLevel: true,
                    StudentInformation: true
                }
            });
            response.json(users);
        }
        catch (error) {
            console.error(error);
            if (error instanceof Error)
                return next(new express_response_errors_1.BadRequestError((0, prisma_errors_1.tryToPrismaError)(error).message));
        }
    });
})
    .post('/get', (0, middlewares_1.authorization)(client_1.Role.ADMIN, client_1.Role.REGISTRY, client_1.Role.STUDENT), middlewares_1.blockDisabled, (0, middlewares_1.body)(dto_1.UserGet), function (request, response, next) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const user = request.user;
            const { id } = request.body;
            if (((_a = user === null || user === void 0 ? void 0 : user.UserLevel) === null || _a === void 0 ? void 0 : _a.role) === client_1.Role.STUDENT && user.id !== id) {
                return next(new express_response_errors_1.UnauthorizedError('Unauthorized to get requested data'));
            }
            const data = yield (0, services_1.cached)(`user.${id}`, () => services_1.db.user.findUnique({
                where: { id },
                include: {
                    UserLevel: true,
                    StudentInformation: true
                }
            }), 30000);
            response.json(data);
        }
        catch (error) {
            console.error(error);
            if (error instanceof Error)
                return next(new express_response_errors_1.BadRequestError((0, prisma_errors_1.tryToPrismaError)(error).message));
        }
    });
})
    .post('/update', (0, middlewares_1.authorization)(client_1.Role.ADMIN, client_1.Role.REGISTRY, client_1.Role.STUDENT), middlewares_1.blockDisabled, (0, middlewares_1.body)(dto_1.UserUpdate), function (request, response, next) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j;
    return __awaiter(this, void 0, void 0, function* () {
        try {
            if (((_a = request === null || request === void 0 ? void 0 : request.user) === null || _a === void 0 ? void 0 : _a.id) === ((_b = request === null || request === void 0 ? void 0 : request.body) === null || _b === void 0 ? void 0 : _b.id) &&
                typeof ((_d = (_c = request.body) === null || _c === void 0 ? void 0 : _c.UserLevel) === null || _d === void 0 ? void 0 : _d.role) !== 'undefined')
                return next(new express_response_errors_1.BadRequestError('Cannot perform the request'));
            const user = request === null || request === void 0 ? void 0 : request.user;
            if (user) {
                if (user.id === request.body.id &&
                    (typeof request.body.enabled !== 'undefined' ||
                        typeof request.body.UserLevel !== 'undefined'))
                    return next(new express_response_errors_1.BadRequestError('Cannot perform the request'));
                if (![client_1.Role.ADMIN, client_1.Role.REGISTRY].includes((_e = user.UserLevel) === null || _e === void 0 ? void 0 : _e.role) &&
                    typeof request.body.enabled !== 'undefined')
                    return next(new express_response_errors_1.BadRequestError('Cannot perform the request'));
            }
            const requestBody = Object.assign({}, request.body);
            const UserLevel = Object.assign({}, requestBody.UserLevel);
            const StudentInformation = Object.assign({}, requestBody.StudentInformation);
            delete requestBody.UserLevel;
            delete requestBody.StudentInformation;
            const data = yield services_1.db.user.update({
                where: { id: request.body.id },
                data: Object.assign(Object.assign({}, requestBody), { UserLevel: {
                        update: {
                            role: UserLevel.role
                        }
                    }, StudentInformation: Object.keys(StudentInformation).length > 0
                        ? {
                            upsert: {
                                update: {
                                    studentType: StudentInformation === null || StudentInformation === void 0 ? void 0 : StudentInformation.studentType,
                                    gender: StudentInformation === null || StudentInformation === void 0 ? void 0 : StudentInformation.gender,
                                    studentId: StudentInformation === null || StudentInformation === void 0 ? void 0 : StudentInformation.studentId,
                                    contactNumber: StudentInformation === null || StudentInformation === void 0 ? void 0 : StudentInformation.contactNumber,
                                    address: StudentInformation === null || StudentInformation === void 0 ? void 0 : StudentInformation.address,
                                    Program: (StudentInformation === null || StudentInformation === void 0 ? void 0 : StudentInformation.programId)
                                        ? {
                                            connect: {
                                                id: StudentInformation === null || StudentInformation === void 0 ? void 0 : StudentInformation.programId
                                            }
                                        }
                                        : undefined,
                                    ClassSection: (StudentInformation === null || StudentInformation === void 0 ? void 0 : StudentInformation.classSectionId)
                                        ? {
                                            connect: {
                                                id: StudentInformation === null || StudentInformation === void 0 ? void 0 : StudentInformation.classSectionId
                                            }
                                        }
                                        : undefined
                                },
                                create: {
                                    studentType: StudentInformation === null || StudentInformation === void 0 ? void 0 : StudentInformation.studentType,
                                    gender: StudentInformation === null || StudentInformation === void 0 ? void 0 : StudentInformation.gender,
                                    studentId: StudentInformation === null || StudentInformation === void 0 ? void 0 : StudentInformation.studentId,
                                    contactNumber: StudentInformation === null || StudentInformation === void 0 ? void 0 : StudentInformation.contactNumber,
                                    address: StudentInformation === null || StudentInformation === void 0 ? void 0 : StudentInformation.address,
                                    Program: {
                                        connect: {
                                            id: StudentInformation === null || StudentInformation === void 0 ? void 0 : StudentInformation.programId
                                        }
                                    },
                                    ClassSection: {
                                        connect: {
                                            id: StudentInformation === null || StudentInformation === void 0 ? void 0 : StudentInformation.classSectionId
                                        }
                                    }
                                }
                            }
                        }
                        : undefined }),
                include: {
                    UserLevel: true,
                    StudentInformation: true
                }
            });
            yield (0, services_1.dbLog)((_f = request === null || request === void 0 ? void 0 : request.user) === null || _f === void 0 ? void 0 : _f.id, `[USER] UPDATE ${data.id}`);
            if (((_g = request.body) === null || _g === void 0 ? void 0 : _g.id) === ((_h = request === null || request === void 0 ? void 0 : request.user) === null || _h === void 0 ? void 0 : _h.id))
                yield services_1.cache.put(`user.${(_j = request.body) === null || _j === void 0 ? void 0 : _j.id}`, data, 60000);
            response.json(data);
        }
        catch (error) {
            console.error(error);
            if (error instanceof Error)
                return next(new express_response_errors_1.BadRequestError((0, prisma_errors_1.tryToPrismaError)(error).message));
        }
    });
});
