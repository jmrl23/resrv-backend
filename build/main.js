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
const server_1 = require("./server");
const configurations_1 = require("./configurations");
const cli_color_1 = require("cli-color");
const detect_port_1 = __importDefault(require("detect-port"));
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        const _port = yield (0, detect_port_1.default)(configurations_1.PORT !== null && configurations_1.PORT !== void 0 ? configurations_1.PORT : '3001');
        server_1.server.listen(_port, () => {
            console.log(`${cli_color_1.bold.bgGreen(' SERVER ')} http://localhost:${_port}/\n`);
        });
    });
}
void main();
