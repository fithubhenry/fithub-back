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
    return await this.userRepository.find();
  }

  async findOneById(id: string): Promise<User> {
    const user = await this.userRepository.findOneBy({ id });
    if (!user)
      throw new NotFoundException(`No se encontró el usuario con id ${id}`);
    return user;
  }

  async updateUser(
    id: string,
    user: Partial<User>,
  ): Promise<Omit<User, 'password'>> {
    const userFound = await this.userRepository.findOneBy({ id });
    if (!userFound)
      throw new NotFoundException(`No se encontro el usuario con id ${id}`);

    const updatedUser = Object.assign(userFound, user);
    await this.userRepository.save(updatedUser);

    const { password, ...userFiltered } = updatedUser;
    return userFiltered;
  }

  async deleteUser(id: string): Promise<User> {
    const userFound = await this.findOneById(id);
    if (userFound.estado === EEstado.Inactivo) {
      throw new NotFoundException(`El usuario con id ${id} ya está inactivo`);
    }
    userFound.estado = EEstado.Inactivo;
    return await this.userRepository.save(userFound);
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
    return await this.userRepository.save(newUser);
  }

  async saveUser(user: User): Promise<User> {
    return await this.userRepository.save(user);
  }

  async setAdmin(id: string) {
    const userFound = await this.findOneById(id);
    if (!userFound)
      throw new NotFoundException(`No se encontró el usuario con id ${id}`);
    if (userFound.esAdmin === true) {
      return 'El usuario ya es administrador';
    } else {
      userFound.esAdmin = true;
      await this.userRepository.save(userFound);
      return 'El usuario ahora es administrador';
    }
  }

  async removeAdmin(id: string) {
    const userFound = await this.findOneById(id);
    if (!userFound)
      throw new NotFoundException(`No se encontró el usuario con id ${id}`);
    if (userFound.esAdmin === false) {
      return 'El usuario no es administrador';
    } else {
      userFound.esAdmin = false;
      await this.userRepository.save(userFound);
      return 'El usuario ya no es administrador';
    }
  }
}
