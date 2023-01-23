"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CourseCreate = void 0;
const client_1 = require("@prisma/client");
const class_validator_1 = require("class-validator");
class CourseCreate {
}
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Length)(6, 100)
], CourseCreate.prototype, "name", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Length)(3, 30)
], CourseCreate.prototype, "alias", void 0);
__decorate([
    (0, class_validator_1.IsUUID)()
], CourseCreate.prototype, "programId", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(client_1.Term)
], CourseCreate.prototype, "term", void 0);
__decorate([
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.IsPositive)({ message: 'Invalid lec. unit' }),
    (0, class_validator_1.Min)(1, { message: 'Invalid lec. Unit' })
], CourseCreate.prototype, "lecUnit", void 0);
exports.CourseCreate = CourseCreate;
