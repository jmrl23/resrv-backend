import { IsInt, IsPositive, IsString, Length, Min } from 'class-validator'

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
  @IsPositive({ message: 'Invalid year count' })
  @Min(1, { message: 'Invalid year count' })
  readonly yearCount: number
}
