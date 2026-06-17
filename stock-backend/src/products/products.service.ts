import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { CreateProductDto } from './dto/create-product.dto';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
  ) {}

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