import { IsString, IsUUID, Length } from 'class-validator'

export class ProgramUpdate {
  @IsUUID()
  readonly id: string

  @IsString()
  @Length(6, 100)
  readonly name: string

  @IsString()
  @Length(3, 10)
  readonly alias: string

  @IsString()
  @Length(6, 20)
  readonly color: string
}
