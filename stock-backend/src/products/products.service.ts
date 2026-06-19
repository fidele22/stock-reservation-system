import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { CreateProductDto } from './dto/create-product.dto';

@Injectable()
export class ProductsService implements OnModuleInit {
  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
  ) {}

  async onModuleInit() {
    await this.seedProducts();
  }

  private async seedProducts() {
    const existing = await this.productRepository.find();

    if (existing.length > 0) return;

    const products = [
      {
        name: 'Laptop',
        price: 800,
        totalStock: 10,
        availableStock: 10,
      },
      {
        name: 'Mouse',
        price: 20,
        totalStock: 50,
        availableStock: 50,
      },
      {
        name: 'Keyboard',
        price: 45,
        totalStock: 30,
        availableStock: 30,
      },
    ];

    await this.productRepository.save(products);
    console.log(' Products seeded successfully');
  }


  create(dto: CreateProductDto) {
    const product = this.productRepository.create({
      ...dto,
      availableStock: dto.totalStock,
    });

    return this.productRepository.save(product);
  }

  findAll() {
    return this.productRepository.find();
  }
}