import { IsInt, IsOptional, IsUUID, MinLength } from 'class-validator'

export class ClassSectionUpdate {
  @IsUUID()
  readonly id: string

  @IsOptional()
  @MinLength(1)
  readonly name: string

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
