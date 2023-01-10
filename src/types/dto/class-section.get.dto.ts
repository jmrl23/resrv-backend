import { IsUUID } from 'class-validator'

export class ClassSectionGet {
  @IsUUID()
  id: string
}
