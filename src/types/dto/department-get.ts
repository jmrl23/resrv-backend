import { IsUUID } from 'class-validator'

export class DepartmentGet {
  @IsUUID()
  readonly id: string
}
