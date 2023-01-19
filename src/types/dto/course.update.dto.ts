import { Term } from '@prisma/client'
import {
  IsBoolean,
  IsEnum,
  IsOptional,
  IsString,
  IsUUID,
  Length
} from 'class-validator'

export class CourseUpdate {
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
  @Length(3, 30)
  readonly alias: string

  @IsOptional()
  @IsEnum(Term)
  readonly term: Term
}
