import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/createUser.dto';
import { UpdateUserDto } from './dto/updateUser.dto';
import { EEstado } from 'src/common/usersEnum';

@Injectable()
export class UserRepository {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  async getAllUsers(): Promise<Omit<User, 'password'>[]> {
    const users = await this.userRepository.find();
    if (!users) throw new NotFoundException('No se encontraron usuarios');
    return users.map(({ password, ...userFiltered }) => userFiltered);
  }

  async findOneById(id: string): Promise<Omit<User, 'password'>> {
    const user = await this.userRepository.findOneBy({ id });
    if (!user)
      throw new NotFoundException(`No se encontro el usuario con id ${id}`);
    const { password, ...userFiltered } = user;
    return userFiltered;
  }

  async updateUser(
    id: string,
    user: UpdateUserDto,
  ): Promise<Omit<User, 'password'>> {
    const userFound = await this.userRepository.findOneBy({ id });
    if (!userFound)
      throw new NotFoundException(`No se encontro el usuario con id ${id}`);
    const userUpdated = Object.assign(userFound, user);
    await this.userRepository.save(userUpdated);
    const { password, ...userFiltered } = userUpdated;
    return userFiltered;
  }

  async deleteUser(id: string): Promise<string> {
    const userFound = await this.userRepository.findOneBy({ id });
    if (!userFound)
      throw new NotFoundException(`No se encontro el usuario con id ${id}`);
    if (userFound.estado === EEstado.Inactivo)
      throw new NotFoundException(
        `El usuario con id ${id} ya se encuentra inactivo`,
      );
    userFound.estado = EEstado.Inactivo;
    await this.userRepository.save(userFound);
    return `Usuario con id ${id} eliminado exitosamente`;
  }
}
