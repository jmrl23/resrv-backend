import {
  IsBoolean,
  IsInt,
  IsOptional,
  IsString,
  MinLength
} from 'class-validator'

export class DepartmentList {
  @IsOptional()
  @IsBoolean()
  readonly isDisabled: boolean

  @IsOptional()
  @IsInt()
  readonly skip: number

  @IsOptional()
  @IsInt()
  readonly take: number

  @IsOptional()
  @IsString()
  @MinLength(1)
  readonly keyword: string
}
