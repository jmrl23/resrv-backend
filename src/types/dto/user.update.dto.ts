import 'reflect-metadata'
import { Type } from 'class-transformer'
import {
  IsBoolean,
  IsEnum,
  IsOptional,
  IsString,
  IsUUID,
  Length,
  MinLength,
  ValidateNested
} from 'class-validator'
import { Role, Gender, StudentType } from '@prisma/client'

class UserLevel {
  @IsEnum(Role)
  role: Role
}

class StudentInformation {
  @IsOptional()
  @IsEnum(StudentType)
  readonly studentType: StudentType

  @IsOptional()
  @IsEnum(Gender)
  readonly gender: Gender

  @IsOptional()
  @IsString()
  @MinLength(20)
  readonly address: string

  @IsOptional()
  @IsString()
  @Length(10, 10, { message: 'Invalid contact number' })
  readonly contactNumber: string

  @IsOptional()
  @IsString()
  @MinLength(9)
  readonly studentId: string

  @IsOptional()
  @IsUUID()
  readonly programId: string
}

export class UserUpdate {
  @IsUUID()
  readonly id: string

  @IsOptional()
  @IsBoolean()
  readonly enabled: boolean

  @IsOptional()
  @ValidateNested()
  @Type(() => UserLevel)
  UserLevel: UserLevel

  @IsOptional()
  @ValidateNested()
  @Type(() => StudentInformation)
  StudentInformation: StudentInformation
}
