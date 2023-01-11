import { ReservationStatus } from '@prisma/client'
import { IsOptional, IsUUID, IsEnum } from 'class-validator'

export class ReservationList {
  @IsOptional()
  @IsUUID()
  readonly id: string

  @IsOptional()
  @IsUUID()
  readonly studentInformationId: string

  @IsOptional()
  @IsUUID()
  readonly fileId: string

  @IsOptional()
  @IsEnum(ReservationStatus)
  readonly status: ReservationStatus
}
