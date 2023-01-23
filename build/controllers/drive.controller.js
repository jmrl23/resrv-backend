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
exports.controller = void 0;
const express_1 = require("express");
const services_1 = require("../services");
const os_1 = require("os");
const uuid_1 = require("uuid");
const express_response_errors_1 = require("express-response-errors");
const services_2 = require("../services");
const middlewares_1 = require("../middlewares");
const client_1 = require("@prisma/client");
const path_1 = require("path");
const multer_1 = __importDefault(require("multer"));
const prisma_errors_1 = require("prisma-errors");
const controller = (0, express_1.Router)();
exports.controller = controller;
const storage = multer_1.default.diskStorage({
    destination: (0, os_1.tmpdir)(),
    filename(_req, file, callback) {
        const fileName = `${Date.now()}_${(0, uuid_1.v4)()}${(0, path_1.extname)(file.originalname)}`;
        callback(null, fileName);
    }
});
const upload = (0, multer_1.default)({
    storage,
    limits: {
        fieldSize: 5242880
    }
});
controller
    .post('/upload', (0, middlewares_1.authorization)(client_1.Role.ADMIN, client_1.Role.REGISTRY, client_1.Role.STUDENT), middlewares_1.blockDisabled, upload.single('f'), function (request, response, next) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        if (!request.file)
            return next(new express_response_errors_1.BadRequestError('No file'));
        const data = yield (0, services_1.driveUpload)(request.file.path);
        if (!data)
            return next(new express_response_errors_1.InternalServerError('An error occurs'));
        if (data instanceof Error)
            return next(new express_response_errors_1.BadRequestError(data.message));
        try {
            const user = request.user;
            const uploadedFile = yield services_2.db.file.create({
                data: {
                    fileId: data.id,
                    mimeType: data.mimeType,
                    userId: user === null || user === void 0 ? void 0 : user.id,
                    size: request.file.size
                }
            });
            yield (0, services_1.dbLog)((_a = request === null || request === void 0 ? void 0 : request.user) === null || _a === void 0 ? void 0 : _a.id, `[SERVICE] DRIVE.UPLOAD ${data === null || data === void 0 ? void 0 : data.id}`);
            response.json(uploadedFile);
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
    .get('/get/:id([0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12})', function (request, response, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const id = request.params.id;
            const file = yield (0, services_1.cached)(`drive.file.${id}`, () => services_2.db.file.findUnique({
                where: { id }
            }), 300000);
            if (!file)
                return next(new express_response_errors_1.NotFoundError('File not found'));
            const data = yield services_1.drive.files.get({
                fileId: file.fileId,
                alt: 'media'
            }, { responseType: 'stream' });
            response.setHeader('Content-Type', file.mimeType);
            // Stream directly from Google drive
            // pro: prevents resource bloating
            // con: prevents caching
            data.data.pipe(response);
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
