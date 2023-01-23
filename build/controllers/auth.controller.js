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
/* eslint-disable indent */
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const express_1 = require("express");
const passport_google_oauth20_1 = require("passport-google-oauth20");
const services_1 = require("../services");
const express_response_errors_1 = require("express-response-errors");
const configurations_1 = require("../configurations");
const passport_1 = __importDefault(require("passport"));
passport_1.default.use(new passport_google_oauth20_1.Strategy({
    clientID: configurations_1.GOOGLE_CLIENT_ID,
    clientSecret: configurations_1.GOOGLE_CLIENT_SECRET,
    callbackURL: configurations_1.PASSPORT_GOOGLE_CALLBACK_URL,
    scope: ['profile', 'email']
}, (_accessToken, _refreshToken, profile, next) => __awaiter(void 0, void 0, void 0, function* () {
    const data = profile._json;
    if (!(data === null || data === void 0 ? void 0 : data.email))
        return next(new express_response_errors_1.BadRequestError('No email'));
    if (configurations_1.NODE_ENV !== 'development' &&
        !data.email.endsWith(`@${configurations_1.ORGANIZATION_EMAIL_DOMAIN}`))
        return next(new express_response_errors_1.BadRequestError('Invalid email'));
    if (configurations_1.NODE_ENV === 'development' &&
        !configurations_1.BYPASS_ORGANIZATION_EMAIL_FILTER_ON_DEVELOPMENT &&
        !data.email.endsWith(`@${configurations_1.ORGANIZATION_EMAIL_DOMAIN}`))
        return next(new express_response_errors_1.BadRequestError('Invalid email'));
    try {
        const user = yield services_1.db.user.findUnique({
            where: {
                email: data.email
            },
            include: {
                UserLevel: true
            }
        });
        if (user && !(user === null || user === void 0 ? void 0 : user.UserLevel)) {
            yield services_1.db.user.update({
                where: {
                    id: user.id
                },
                data: {
                    UserLevel: {
                        connectOrCreate: {
                            where: {
                                email: data.email
                            },
                            create: {
                                email: data.email
                            }
                        }
                    }
                }
            });
        }
        if (user)
            return next(null, user.id);
        const newUser = yield services_1.db.user.create({
            data: {
                email: data.email,
                givenName: data.given_name,
                familyName: data.family_name,
                displayName: data.name,
                picture: data.picture,
                UserLevel: {
                    connectOrCreate: {
                        where: {
                            email: data.email
                        },
                        create: {
                            email: data.email
                        }
                    }
                }
            }
        });
        next(null, newUser.id);
    }
    catch (error) {
        if (error instanceof Error)
            next(new express_response_errors_1.InternalServerError(error.message));
    }
})));
const controller = (0, express_1.Router)();
exports.controller = controller;
controller
    .get('/google', passport_1.default.authenticate('google', {
    scope: ['profile', 'email'],
    prompt: 'select_account',
    session: false
}))
    .get('/google/redirect', function (request, response, next) {
    passport_1.default.authenticate('google', { session: false }, function (error, id) {
        if (error)
            return next(new express_response_errors_1.BadRequestError(error.message));
        if (!id)
            return response.redirect(`${configurations_1.CLIENT_URL}sign-in?error=1`);
        const token = jsonwebtoken_1.default.sign({ id }, configurations_1.JWT_SECRET, {
            expiresIn: '30d'
        });
        response.redirect(`${configurations_1.CLIENT_URL}sign-in?token=${token}`);
    })(request, response, next);
});
