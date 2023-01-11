import { Role } from '@prisma/client'
import { IsEmail, IsEnum } from 'class-validator'

export class UserLevelSet {
  @IsEmail()
  readonly email: string

  @IsEnum(Role)
  readonly role: Role
}
