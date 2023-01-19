import {
  IsInt,
  IsOptional,
  IsPositive,
  IsString,
  IsUUID,
  Max,
  Min,
  MinLength
} from 'class-validator'

export class ClassSectionCreate {
  @IsString()
  @MinLength(6)
  readonly name: string

  @IsUUID()
  readonly programId: string

  @IsPositive({ message: 'Invalid year level' })
  @IsInt({ message: 'Invalid year level' })
  @Min(1, { message: 'Invalid year level' })
  @Max(10, { message: 'Invalid year level' })
  readonly yearLevel: number

  @IsOptional()
  @IsPositive({ message: 'Invalid maximum capacity' })
  @IsInt({ message: 'Invalid maximum capacity' })
  @Min(1, { message: 'Invalid maximum capacity' })
  readonly maximumCapacity: number

  @IsOptional()
  @IsPositive({ message: 'Invalid maximum irregular students' })
  @IsInt({ message: 'Invalid maximum irregular students' })
  @Min(1, { message: 'Invalid maximum irregular students' })
  readonly maximumIrregularStudent: number

  @IsOptional()
  @IsInt()
  @IsPositive({ message: 'Invalid total student count' })
  readonly totalStudentCount: number
}
