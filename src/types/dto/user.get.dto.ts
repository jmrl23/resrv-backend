import { IsUUID } from 'class-validator'

export class UserGet {
  @IsUUID()
  readonly id: string
}
