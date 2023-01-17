import { Term } from '@prisma/client'
import {
  IsBoolean,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  IsUUID
} from 'class-validator'

export class CourseList {
  @IsOptional()
  @IsBoolean()
  readonly enabled: boolean

  @IsOptional()
  @IsInt()
  readonly skip: number

  @IsOptional()
  @IsInt()
  readonly take: number

  @IsOptional()
  @IsString({ each: true })
  readonly keywords: string[]

  @IsOptional()
  @IsEnum(Term)
  readonly term: Term

  @IsOptional()
  @IsUUID()
  readonly programId: string
}
