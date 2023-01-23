"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClassSectionUpdate = void 0;
const class_validator_1 = require("class-validator");
class ClassSectionUpdate {
}
__decorate([
    (0, class_validator_1.IsUUID)()
], ClassSectionUpdate.prototype, "id", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.MinLength)(1)
], ClassSectionUpdate.prototype, "name", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsPositive)({ message: 'Invalid maximum capacity' }),
    (0, class_validator_1.IsInt)({ message: 'Invalid maximum capacity' }),
    (0, class_validator_1.Min)(1, { message: 'Invalid maximum capacity' })
], ClassSectionUpdate.prototype, "maximumCapacity", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsPositive)({ message: 'Invalid maximum irregular students' }),
    (0, class_validator_1.IsInt)({ message: 'Invalid maximum irregular students' }),
    (0, class_validator_1.Min)(1, { message: 'Invalid maximum irregular students' })
], ClassSectionUpdate.prototype, "maximumIrregularStudent", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.IsPositive)({ message: 'Invalid total student count' })
], ClassSectionUpdate.prototype, "totalStudentCount", void 0);
exports.ClassSectionUpdate = ClassSectionUpdate;
