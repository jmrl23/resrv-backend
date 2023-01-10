import { Role } from '@prisma/client'
import {
  IsBoolean,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  IsUUID
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
  @IsString({ each: true })
  readonly keywords: string[]

  @IsOptional()
  @IsUUID()
  readonly programId: string

  @IsOptional()
  @IsUUID()
  readonly studentId: string
}
