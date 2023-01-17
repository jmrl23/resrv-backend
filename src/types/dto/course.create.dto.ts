import { Term } from '@prisma/client'
import { IsEnum, IsInt, IsString, IsUUID, Length } from 'class-validator'

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
  readonly term: string

  @IsInt()
  readonly lecUnit: number
}
