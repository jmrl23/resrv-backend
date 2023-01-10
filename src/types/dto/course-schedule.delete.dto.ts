import { IsUUID } from 'class-validator'

export class CourseScheduleDelete {
  @IsUUID()
  id: string
}
