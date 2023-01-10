import { IsUUID } from 'class-validator'

export class CourseScheduleGet {
  @IsUUID()
  id: string
}
