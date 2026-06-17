import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService implements OnModuleInit {
  constructor(
    @InjectRepository(User)
    private userRepo: Repository<User>,
  ) {}

  async onModuleInit() {
    const count = await this.userRepo.count();

    if (count === 0) {
      await this.userRepo.save([
        { name: 'Castro', email: 'castro@test.com' },
        { name: 'hirwa', email: 'hirwa@test.com' },
      ]);
    }
  }

  findAll() {
    return this.userRepo.find();
  }

  findOne(id: number) {
    return this.userRepo.findOne({ where: { id } });
  }
}