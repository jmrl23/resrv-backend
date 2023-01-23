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
exports.driveUpload = exports.drive = void 0;
const configurations_1 = require("../configurations");
const googleapis_1 = require("googleapis");
const mime_types_1 = require("mime-types");
const fs_1 = require("fs");
const express_response_errors_1 = require("express-response-errors");
exports.drive = googleapis_1.google.drive({
    version: 'v3',
    auth: configurations_1.googleOAuth2Client
});
const driveUpload = (file) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        if (!(0, fs_1.existsSync)(file))
            throw new Error('File not found');
        const mimeType = (0, mime_types_1.lookup)(file);
        if (!mimeType)
            throw new Error('Unknown mimetype');
        const name = file.replace(/^.*[\\/]/, '');
        const response = yield exports.drive.files.create({
            media: {
                mimeType,
                body: (0, fs_1.createReadStream)(file)
            },
            requestBody: {
                mimeType,
                name,
                parents: [configurations_1.GOOGLE_DRIVE_FOLDER_ID]
            }
        });
        if (response.status !== 200 || !((_a = response === null || response === void 0 ? void 0 : response.data) === null || _a === void 0 ? void 0 : _a.id))
            throw new Error('An error occurs');
        const { data } = response;
        return data;
    }
    catch (error) {
        if (error instanceof Error)
            return new express_response_errors_1.InternalServerError(error.message);
    }
});
exports.driveUpload = driveUpload;
