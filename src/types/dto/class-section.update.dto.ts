import { IsOptional, IsUUID, MinLength } from 'class-validator'

export class ClassSectionUpdate {
  @IsUUID()
  readonly id: string

  @IsOptional()
  @MinLength(1)
  readonly name: string
}
