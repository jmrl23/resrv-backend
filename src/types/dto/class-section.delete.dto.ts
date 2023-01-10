import { IsUUID } from 'class-validator'

export class ClassSectionDelete {
  @IsUUID()
  id: string
}
