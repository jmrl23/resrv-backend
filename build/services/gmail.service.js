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
exports.sendMail = exports.transporter = exports.transportURL = void 0;
const nodemailer_1 = require("nodemailer");
const configurations_1 = require("../configurations");
const express_response_errors_1 = require("express-response-errors");
exports.transportURL = new URL(configurations_1.SMTP_TRANSPORT_URL);
exports.transporter = (0, nodemailer_1.createTransport)({
    host: exports.transportURL.hostname,
    port: parseInt(exports.transportURL.port, 10),
    secure: exports.transportURL.port === '465',
    service: 'gmail',
    auth: {
        type: 'oauth2',
        user: decodeURIComponent(exports.transportURL.username),
        clientId: configurations_1.GOOGLE_CLIENT_ID,
        clientSecret: configurations_1.GOOGLE_CLIENT_SECRET,
        refreshToken: configurations_1.GOOGLE_REFRESH_TOKEN
    }
});
const sendMail = (options) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield exports.transporter.sendMail(options);
        return response;
    }
    catch (error) {
        if (error instanceof Error)
            return new express_response_errors_1.InternalServerError(error.message);
    }
});
exports.sendMail = sendMail;
