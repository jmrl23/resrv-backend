import {
  IsInt,
  IsOptional,
  IsPositive,
  IsUUID,
  Min,
  MinLength
} from 'class-validator'

export class ClassSectionUpdate {
  @IsUUID()
  readonly id: string

  @IsOptional()
  @MinLength(1)
  readonly name: string

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
