import { Role } from '@prisma/client'
import { IsEnum, IsInt, IsOptional } from 'class-validator'

export class UserLevelList {
  @IsEnum(Role)
  readonly role: string

  @IsOptional()
  @IsInt()
  readonly skip: number

  @IsOptional()
  @IsInt()
  readonly take: number
}
