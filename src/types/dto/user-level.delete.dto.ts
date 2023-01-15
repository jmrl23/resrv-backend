import { IsEmail } from 'class-validator'

export class UserLevelDelete {
  @IsEmail()
  readonly email: string
}
