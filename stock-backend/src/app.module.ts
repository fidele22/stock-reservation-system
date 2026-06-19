import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleModule } from '@nestjs/schedule';
import { UsersModule } from './users/users.module';
import { ProductsModule } from './products/products.module';
import { ReservationsModule } from './reservations/reservations.module';


@Module({
  imports: [
    // TypeOrmModule.forRoot({
    //   type: 'postgres',
    //   host: 'localhost',
    //   port: 5432,
    //   username: 'postgres',
    //   password: 'admin',
    //   database: 'stock_system',
    //   autoLoadEntities: true,
    //   synchronize: true,
    // }),

  TypeOrmModule.forRoot({
  type: 'postgres',
  url: process.env.DATABASE_URL,
  autoLoadEntities: true,
  synchronize: true, // ONLY for development (you can turn off later)
}),
    ScheduleModule.forRoot(),
    UsersModule,
    ProductsModule,
    ReservationsModule,
  ],
})
export class AppModule {}