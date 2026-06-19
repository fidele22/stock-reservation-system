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
    await this.seedUsers();
  }

  private async seedUsers() {
    const existing = await this.userRepo.find();

    if (existing.length > 0) return;

    const users = [
      { name: 'Castro', email: 'castro@test.com' },
      { name: 'Hirwa', email: 'hirwa@test.com' },
    ];

    await this.userRepo.save(users);
    console.log('Users seeded successfully');
  }

  findAll() {
    return this.userRepo.find();
  }

  findOne(id: number) {
    return this.userRepo.findOne({ where: { id } });
  }
}