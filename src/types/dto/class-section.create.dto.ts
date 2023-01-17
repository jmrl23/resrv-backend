import { IsInt, IsOptional, IsString, IsUUID, MinLength } from 'class-validator'

export class ClassSectionCreate {
  @IsString()
  @MinLength(6)
  readonly name: string

  @IsUUID()
  readonly programId: string

  @IsInt({ message: 'Invalid year level' })
  readonly yearLevel: number

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
