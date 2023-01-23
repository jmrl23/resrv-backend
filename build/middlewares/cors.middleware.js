"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.cors = void 0;
const cors_1 = __importDefault(require("cors"));
const configurations_1 = require("../configurations");
const express_response_errors_1 = require("express-response-errors");
exports.cors = (0, cors_1.default)({
    methods: ['GET', 'POST'],
    origin: (origin, done) => {
        if (origin && !configurations_1.CORS_WHITELIST.includes(origin))
            return done(new express_response_errors_1.ForbiddenError('Blocked by CORS'));
        done(null, true);
    },
    credentials: true
});
