import { IsUUID } from 'class-validator'

export class ProgramGet {
  @IsUUID()
  readonly id: string
}
