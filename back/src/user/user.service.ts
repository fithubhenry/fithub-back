import { Injectable } from '@nestjs/common';
import { UpdateUserDto } from './dto/updateUser.dto';
import { UserRepository } from './user.repository';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  findAll() {
    return this.userRepository.getAllUsers();
  }

  findOne(id: string) {
    return this.userRepository.findOneById(id);
  }

  update(id: string, updateUser: UpdateUserDto) {
    return this.userRepository.updateUser(id, updateUser);
  }

  remove(id: string) {
    return this.userRepository.deleteUser(id);
  }
}
