import { IsUUID } from 'class-validator'

export class CourseGet {
  @IsUUID()
  readonly id: string
}
