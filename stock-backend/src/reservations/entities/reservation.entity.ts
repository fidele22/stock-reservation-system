// src/reservations/entities/reservation.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
} from 'typeorm';

import { User } from '../../users/entities/user.entity';
import { Product } from '../../products/entities/product.entity';

@Entity()
export class Reservation {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.reservations)
  user: User;

  @ManyToOne(() => Product, (product) => product.reservations)
  product: Product;

  @Column()
  quantity: number;

  @Column({ default: 'ACTIVE' })
  status: 'ACTIVE' | 'EXPIRED' | 'COMPLETED';

  @Column()
  expiresAt: Date;
}