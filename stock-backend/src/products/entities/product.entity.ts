// src/products/entities/product.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Reservation } from '../../reservations/entities/reservation.entity';

@Entity()
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column('decimal')
  price: number;

  @Column()
  totalStock: number;

  @Column()
  availableStock: number;

  @OneToMany(() => Reservation, (reservation) => reservation.product)
  reservations: Reservation[];
}