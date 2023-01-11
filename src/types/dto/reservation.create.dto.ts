import { IsOptional, IsUUID } from 'class-validator'

export class ReservationCreate {
  @IsUUID(undefined, { each: true })
  readonly courseScheduleIds: string[]

  @IsOptional()
  @IsUUID()
  readonly fileId: string
}
