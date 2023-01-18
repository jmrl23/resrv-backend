import { Day } from '@prisma/client'
import {
  IsEnum,
  IsInt,
  IsMilitaryTime,
  IsOptional,
  IsUUID
} from 'class-validator'

export class CourseScheduleList {
  @IsOptional()
  @IsOptional()
  readonly courseId: string

  @IsOptional()
  @IsUUID()
  readonly classSectionId: string

  @IsOptional()
  @IsEnum(Day)
  readonly day: Day

  @IsOptional()
  @IsMilitaryTime()
  readonly from: string

  @IsOptional()
  @IsMilitaryTime()
  readonly to: string

  @IsOptional()
  @IsInt()
  readonly skip: number

  @IsOptional()
  @IsInt()
  readonly take: number
}
