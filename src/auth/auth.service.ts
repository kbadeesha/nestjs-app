import { Injectable } from '@nestjs/common';
import { CreateUserDto as CreateUserDto, ExistingUserDto } from './dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/user/entities/user.entity';
import * as bcrypt from 'bcrypt';
import { UserService } from 'src/user/user.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 12);
  }
  async register(createUserDto: CreateUserDto) {
    const { password, email } = createUserDto;
    const existingUser = await this.userService.findByEmail(email);
    if (existingUser) return 'Email taken';
    const hashedPassword = await this.hashPassword(password);
    const newUser = { ...createUserDto, password: hashedPassword };
    return this.userRepository.save(newUser);
  }

  async doesPasswordMatch(
    password: string,
    hashPassword: string,
  ): Promise<boolean> {
    return bcrypt.compare(password, hashPassword);
  }

  async validateUser(email: string, password: string): Promise<User | null> {
    const user = await this.userService.findByEmail(email);
    const doesUserExist = !!user;

    if (!doesUserExist) return null;
    const doesPasswordMatch = await this.doesPasswordMatch(
      password,
      user.password,
    );
    if (!doesPasswordMatch) return null;

    return user;
  }
  async login(
    existingUser: ExistingUserDto,
  ): Promise<{ token: string } | null> {
    const { email, password } = existingUser;
    const user = await this.validateUser(email, password);

    if (!user) return null;
    const jwt = await this.jwtService.signAsync({ user });
    return { token: jwt };
  }
}
