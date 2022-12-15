import { IsBoolean, IsUUID } from 'class-validator'

export class UserToggle {
  @IsUUID()
  readonly id: string

  @IsBoolean()
  readonly state: boolean
}
