import { IsBoolean, IsUUID } from 'class-validator'

export class ProgramToggle {
  @IsUUID()
  readonly id: string

  @IsBoolean()
  readonly state: boolean
}
