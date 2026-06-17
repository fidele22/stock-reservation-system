// src/reservations/reservations.service.ts
import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThan } from 'typeorm';
import { Cron } from '@nestjs/schedule';

import { Reservation } from './entities/reservation.entity';
import { Product } from '../products/entities/product.entity';
import { User } from '../users/entities/user.entity';

@Injectable()
export class ReservationsService {
  constructor(
    @InjectRepository(Reservation)
    private reservationRepo: Repository<Reservation>,

    @InjectRepository(Product)
    private productRepo: Repository<Product>,

    @InjectRepository(User)
    private userRepo: Repository<User>,
  ) {}

  // CREATE RESERVATION
  async reserve(userId: number, productId: number, quantity: number) {
    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) throw new BadRequestException('User not found');

    const product = await this.productRepo.findOne({
      where: { id: productId },
    });

    if (!product) throw new BadRequestException('Product not found');

    if (product.availableStock < quantity) {
      throw new BadRequestException('Not enough stock');
    }

    product.availableStock -= quantity;
    await this.productRepo.save(product);

    const reservation = this.reservationRepo.create({
      user,
      product,
      quantity,
      status: 'ACTIVE',
      expiresAt: new Date(Date.now() + 10 * 1000),
    });

    return this.reservationRepo.save(reservation);
  }

  // GET ALL
  findAll() {
    return this.reservationRepo.find({
        relations: {
    user: true,
    product: true,
  },
    });
  }

  // EXPIRY SYSTEM
  @Cron('* * * * * *')
  async handleExpiredReservations() {
    const expired = await this.reservationRepo.find({
      where: {
        status: 'ACTIVE',
        expiresAt: LessThan(new Date()),
      },
       relations: {
    product: true,
  },
    });

    for (const r of expired) {
      if (r.product) {
        r.product.availableStock += r.quantity;
        await this.productRepo.save(r.product);
      }

      r.status = 'EXPIRED';
      await this.reservationRepo.save(r);
    }
  }

  // CHECKOUT
  async checkout(reservationId: number) {
    const reservation = await this.reservationRepo.findOne({
      where: { id: reservationId },
         relations: {
      user: true,
      product: true,
    },
    });

    if (!reservation) throw new BadRequestException('Reservation not found');

    if (reservation.status !== 'ACTIVE') {
      throw new BadRequestException('Reservation not active');
    }

    reservation.status = 'COMPLETED';

    return this.reservationRepo.save(reservation);
  }
}