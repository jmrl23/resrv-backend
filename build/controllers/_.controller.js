"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.controller = void 0;
const express_1 = require("express");
const controller = (0, express_1.Router)();
exports.controller = controller;
controller.all('/', function (_request, response) {
    response.status(200).json({
        statusCode: 200,
        message: 'OK',
        error: null
    });
});
