import { Injectable } from '@nestjs/common';
import { CreateUserDto as CreateUserDto } from './dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}
  register(createUserDto: CreateUserDto) {
    return this.userRepository.save(createUserDto);
  }

  login() {
    return { msg: 'login' };
  }
}
