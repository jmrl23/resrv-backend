import { IsBoolean, IsUUID } from 'class-validator'

export class DepartmentToggle {
  @IsUUID()
  readonly id: string

  @IsBoolean()
  readonly state: boolean
}
