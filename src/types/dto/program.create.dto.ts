import { IsInt, IsString, Length } from 'class-validator'

export class ProgramCreate {
  @IsString()
  @Length(6, 100)
  readonly name: string

  @IsString()
  @Length(3, 30)
  readonly alias: string

  @IsString()
  @Length(6, 20)
  readonly color: string

  @IsInt({ message: 'Invalid year count' })
  readonly yearCount: number
}
