import { IsInt, IsOptional, IsString, IsUUID } from 'class-validator'

export class ClassSectionList {
  @IsOptional()
  @IsString({ each: true })
  readonly keywords: string

  @IsOptional()
  @IsUUID()
  readonly programId: string

  @IsOptional()
  @IsInt()
  readonly skip: number

  @IsOptional()
  @IsInt()
  readonly take: number
}
