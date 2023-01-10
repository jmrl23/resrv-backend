import { IsUUID } from 'class-validator'

export class CourseDelete {
  @IsUUID()
  readonly id: string
}
