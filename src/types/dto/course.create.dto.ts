import { Term } from '@prisma/client'
import {
  IsEnum,
  IsInt,
  IsPositive,
  IsString,
  IsUUID,
  Length,
  Min
} from 'class-validator'

export class CourseCreate {
  @IsString()
  @Length(6, 100)
  readonly name: string

  @IsString()
  @Length(3, 30)
  readonly alias: string

  @IsUUID()
  readonly programId: string

  @IsEnum(Term)
  readonly term: Term

  @IsInt()
  @IsPositive({ message: 'Invalid lec. unit' })
  @Min(1, { message: 'Invalid lec. Unit' })
  readonly lecUnit: number
}
