// src/reservations/dto/create-reservation.dto.ts
import { IsInt, Min } from 'class-validator';

export class CreateReservationDto {
  @IsInt()
  userId: number;

  @IsInt()
  productId: number;

  @IsInt()
  @Min(1)
  quantity: number;
}