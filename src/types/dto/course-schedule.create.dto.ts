import { Day } from '@prisma/client'
import { IsEnum, IsMilitaryTime, IsOptional, IsUUID } from 'class-validator'

export class CourseScheduleCreate {
  @IsUUID()
  readonly courseId: string

  @IsUUID()
  readonly classSectionId: string

  @IsOptional()
  @IsEnum(Day)
  readonly day: string

  @IsOptional()
  @IsMilitaryTime()
  readonly from: string

  @IsOptional()
  @IsMilitaryTime()
  readonly to: string
}
