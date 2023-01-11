import { IsInt, IsOptional, IsString, IsUUID, MinLength } from 'class-validator'

export class ClassSectionCreate {
  @IsInt()
  readonly yearLevel: number

  @IsString()
  @MinLength(6)
  readonly name: string

  @IsUUID()
  readonly programId: string

  @IsOptional()
  @IsInt()
  readonly maximumCapacity: number

  @IsOptional()
  @IsInt()
  readonly maximumIrregularStudent: number

  @IsOptional()
  @IsInt()
  readonly totalStudentCount: number
}
