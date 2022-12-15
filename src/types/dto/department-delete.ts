import { IsUUID } from 'class-validator'

export class DepartmentDelete {
  @IsUUID()
  readonly id: string
}
