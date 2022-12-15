import { Role } from '@prisma/client'
import { IsEnum } from 'class-validator'

export class UserLevelList {
  @IsEnum(Role, { each: true })
  readonly role: Role[]
}
