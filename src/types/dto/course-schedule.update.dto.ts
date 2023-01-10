import { Day } from '@prisma/client'
import { IsEnum, IsMilitaryTime, IsOptional, IsUUID } from 'class-validator'

export class CourseScheduleUpdate {
  @IsUUID()
  readonly id: string

  @IsOptional()
  @IsEnum(Day)
  readonly day: Day

  @IsOptional()
  @IsMilitaryTime()
  readonly from: string

  @IsOptional()
  @IsMilitaryTime()
  readonly to: string
}
