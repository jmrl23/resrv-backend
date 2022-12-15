import { IsEmail } from 'class-validator'

export class UserRemoveRole {
  @IsEmail()
  readonly email: string
}
