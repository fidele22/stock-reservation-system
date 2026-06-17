// src/reservations/reservations.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleModule } from '@nestjs/schedule';

import { ReservationsService } from './reservations.service';
import { ReservationsController } from './reservations.controller';

import { Reservation } from './entities/reservation.entity';
import { Product } from '../products/entities/product.entity';
import { User } from '../users/entities/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Reservation, Product, User]),
    ScheduleModule.forRoot(),
  ],
  controllers: [ReservationsController],
  providers: [ReservationsService],
})
export class ReservationsModule {}