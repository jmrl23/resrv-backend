import { ReservationStatus } from '@prisma/client'
import { IsEnum, IsOptional, IsUUID } from 'class-validator'

export class ReservationUpdate {
  @IsUUID()
  readonly id: string

  @IsOptional()
  @IsUUID()
  readonly fileId: string

  @IsOptional()
  @IsEnum(ReservationStatus)
  readonly status: string
}
