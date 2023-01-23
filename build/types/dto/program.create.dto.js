"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProgramCreate = void 0;
const class_validator_1 = require("class-validator");
class ProgramCreate {
}
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Length)(6, 100)
], ProgramCreate.prototype, "name", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Length)(3, 30)
], ProgramCreate.prototype, "alias", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Length)(6, 20)
], ProgramCreate.prototype, "color", void 0);
__decorate([
    (0, class_validator_1.IsInt)({ message: 'Invalid year count' }),
    (0, class_validator_1.IsPositive)({ message: 'Invalid year count' }),
    (0, class_validator_1.Min)(1, { message: 'Invalid year count' })
], ProgramCreate.prototype, "yearCount", void 0);
exports.ProgramCreate = ProgramCreate;
