// src/reservations/reservations.controller.ts
import {
  Controller,
  Get,
  Post,
  Body,
  Param,
} from '@nestjs/common';

import { ReservationsService } from './reservations.service';
import { CreateReservationDto } from './dto/create-reservation.dto';

@Controller('reservations')
export class ReservationsController {
  constructor(private readonly service: ReservationsService) {}

  @Post()
  reserve(@Body() dto: CreateReservationDto) {
    return this.service.reserve(
      dto.userId,
      dto.productId,
      dto.quantity,
    );
  }

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Post(':id/checkout')
  checkout(@Param('id') id: string) {
    return this.service.checkout(Number(id));
  }
}