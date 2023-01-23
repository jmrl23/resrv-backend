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
exports.dbLog = exports.db = void 0;
const client_1 = require("@prisma/client");
const configurations_1 = require("../configurations");
exports.db = new client_1.PrismaClient({
    log: configurations_1.NODE_ENV === 'development' ? ['warn', 'error'] : undefined
});
const dbLog = (userId, message) => __awaiter(void 0, void 0, void 0, function* () {
    if (!message)
        return;
    try {
        const { id } = yield exports.db.log.create({
            data: { userId, message }
        });
        return id;
    }
    catch (error) {
        if (error instanceof Error)
            return;
    }
});
exports.dbLog = dbLog;
