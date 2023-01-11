import {
  IsBoolean,
  IsInt,
  IsOptional,
  IsString,
  IsUUID,
  Length
} from 'class-validator'

export class ProgramUpdate {
  @IsUUID()
  readonly id: string

  @IsOptional()
  @IsBoolean()
  readonly enabled: boolean

  @IsOptional()
  @IsString()
  @Length(6, 100)
  readonly name: string

  @IsOptional()
  @IsString()
  @Length(3, 20)
  readonly alias: string

  @IsOptional()
  @IsString()
  @Length(6, 20)
  readonly color: string

  @IsOptional()
  @IsInt({ message: 'Invalid year count' })
  readonly yearCount: number
}
