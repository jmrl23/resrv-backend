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
exports.requestUser = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const services_1 = require("../services");
const configurations_1 = require("../configurations");
function requestUser(request, _response, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const auth = request.header('authorization');
        if (!auth)
            return next();
        const authenticate = auth.split(' ');
        const [scheme, token] = authenticate;
        if (authenticate.length !== 2 || scheme !== 'Bearer')
            return next();
        try {
            const { id } = jsonwebtoken_1.default.verify(token, configurations_1.JWT_SECRET);
            const user = yield (0, services_1.cached)(`user.${id}`, () => services_1.db.user.findUnique({
                where: { id },
                include: {
                    UserLevel: true,
                    StudentInformation: true
                }
            }), 30000);
            request.user = user;
        }
        catch (_) {
            /* empty */
        }
        finally {
            next();
        }
    });
}
exports.requestUser = requestUser;
