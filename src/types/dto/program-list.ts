import { IsBoolean, IsInt, IsOptional, IsString } from 'class-validator'

export class ProgramList {
  @IsOptional()
  @IsBoolean()
  readonly enabled: boolean

  @IsOptional()
  @IsInt()
  readonly skip: number

  @IsOptional()
  @IsInt()
  readonly take: number

  @IsOptional()
  @IsString({ each: true })
  readonly keywords: string[]
}
