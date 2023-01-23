"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const express_1 = __importDefault(require("express"));
const controllers_1 = require("./controllers");
const configurations_1 = require("./configurations");
const middlewares_1 = require("./middlewares");
const passport_1 = __importDefault(require("passport"));
const app = (0, express_1.default)();
exports.app = app;
app.set('trust proxy', configurations_1.TRUST_PROXY);
app.use(middlewares_1.helmet, middlewares_1.cors, middlewares_1.logger, passport_1.default.initialize(), express_1.default.json(), express_1.default.urlencoded({ extended: false }), middlewares_1.requestUser);
app.use((0, middlewares_1.rateLimiter)({ max: 800 }), controllers_1.controller);
app.use(middlewares_1.notFound, middlewares_1.responseErrorHandler);
