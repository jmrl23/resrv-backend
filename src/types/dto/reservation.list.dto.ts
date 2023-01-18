import { ReservationStatus } from '@prisma/client'
import { IsOptional, IsUUID, IsEnum, IsInt } from 'class-validator'

export class ReservationList {
  @IsOptional()
  @IsUUID()
  readonly studentInformationId: string

  @IsOptional()
  @IsUUID()
  readonly fileId: string

  @IsOptional()
  @IsEnum(ReservationStatus)
  readonly status: ReservationStatus

  @IsOptional()
  @IsInt()
  readonly skip: number

  @IsOptional()
  @IsInt()
  readonly take: number
}
