import { IsUUID } from 'class-validator'

export class ReservationGet {
  @IsUUID()
  readonly id: string
}
