import { Role } from '@prisma/client'
import {
  IsBoolean,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  IsUUID,
  MinLength
} from 'class-validator'

export class UserList {
  @IsEnum(Role, { each: true })
  readonly role: Role[]

  @IsOptional()
  @IsBoolean()
  readonly enabled: boolean

  @IsOptional()
  @IsInt()
  readonly skip: number

  @IsOptional()
  @IsInt()
  readonly take: number

  @IsOptional()
  @IsString()
  @MinLength(1)
  readonly keyword: string

  @IsOptional()
  @IsUUID()
  readonly departmentId: string
}
