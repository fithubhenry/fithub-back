import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { UpdateUserDto } from './dto/updateUser.dto';
import { EEstado } from 'src/common/usersEnum';

@Injectable()
export class UserRepository {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  async getAllUsers(): Promise<User[]> {
    return this.userRepository.find();
  }

  async findOneById(id: string): Promise<User> {
    const user = await this.userRepository.findOneBy({ id });
    if (!user)
      throw new NotFoundException(`No se encontró el usuario con id ${id}`);
    return user;
  }

  async updateUser(id: string, user: UpdateUserDto): Promise<User> {
    const userFound = await this.findOneById(id);
    const userUpdated = Object.assign(userFound, user);
    return this.userRepository.save(userUpdated);
  }

  async deleteUser(id: string): Promise<User> {
    const userFound = await this.findOneById(id);
    if (userFound.estado === EEstado.Inactivo) {
      throw new NotFoundException(`El usuario con id ${id} ya está inactivo`);
    }
    userFound.estado = EEstado.Inactivo;
    return this.userRepository.save(userFound);
  }

  async createUserFromGoogle(googleUser: {
    email: string;
    firstName: string;
    lastName: string;
  }): Promise<User> {
    const newUser = this.userRepository.create({
      email: googleUser.email,
      nombre: googleUser.firstName,
      apellido: googleUser.lastName,
    });
    return this.userRepository.save(newUser);
  }

  async saveUser(user: User): Promise<User> {
    return this.userRepository.save(user);
  }
}
