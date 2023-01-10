import { IsUUID } from 'class-validator'

export class ProgramDelete {
  @IsUUID()
  readonly id: string
}
