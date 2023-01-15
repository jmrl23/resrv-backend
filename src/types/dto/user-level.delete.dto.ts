import { IsUUID } from 'class-validator'

export class UserLevelDelete {
  @IsUUID()
  readonly id: string
}
