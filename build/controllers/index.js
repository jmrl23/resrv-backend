"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
const express_list_endpoints_1 = __importDefault(require("express-list-endpoints"));
const recursive_readdir_1 = __importDefault(require("recursive-readdir"));
const cli_color_1 = __importDefault(require("cli-color"));
const controller = (0, express_1.Router)();
exports.controller = controller;
(0, recursive_readdir_1.default)(__dirname, ['!*.controller.{ts,js}']).then((files) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    for (const file of files) {
        const { controller: _controller } = yield (_a = file, Promise.resolve().then(() => __importStar(require(_a))));
        if (typeof _controller !== 'function')
            continue;
        const path = file
            .replace(__dirname, '')
            .substring(1)
            .replace(/\.controller\.(ts|js)$/g, '')
            .replace(/^_+/g, '')
            .toLowerCase();
        controller.use(`/${path}`, _controller);
        const endpoints = (0, express_list_endpoints_1.default)(_controller);
        console.log(cli_color_1.default.bold.bgBlueBright(' CONTROLLER ') + cli_color_1.default.black.bgWhite(` ${path} `));
        for (const endpoint of endpoints) {
            const { methods, path } = endpoint;
            console.log(` - [${methods.length > 0 ? methods.join(', ') : 'ALL'}] ${path}`);
        }
        console.log();
    }
}));
