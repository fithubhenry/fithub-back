import { Injectable } from '@nestjs/common';
import { UpdateUserDto } from './dto/updateUser.dto';
import { UserRepository } from './user.repository';
import { User } from './entities/user.entity';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { Express } from 'express';

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  findAll() {
    return this.userRepository.getAllUsers();
  }

  findOne(id: string) {
    return this.userRepository.findOneById(id);
  }

  update(id: string, updateUser: UpdateUserDto) {
    return this.userRepository.updateUser(id, updateUser);
  }

  async updateProfileImage(id: string, file: Express.Multer.File) {
    const user = await this.userRepository.findOneById(id);
    const uploadResult = await this.cloudinaryService.uploadImage(file);

    // Actualizamos el usuario con la URL de Cloudinary
    return this.userRepository.updateUser(id, {
      profileImageUrl: uploadResult.secure_url,
    });
  }

  remove(id: string) {
    return this.userRepository.deleteUser(id);
  }
}
