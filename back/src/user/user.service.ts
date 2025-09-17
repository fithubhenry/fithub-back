import { Injectable, NotFoundException } from '@nestjs/common';
import { UpdateUserDto } from './dto/updateUser.dto';
import { UserRepository } from './user.repository';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  async findAll() {
    return await this.userRepository.getAllUsers();
  }

  async findOne(id: string) {
    return await this.userRepository.findOneById(id);
  }

  async update(id: string, updateUser: UpdateUserDto) {
    return await this.userRepository.updateUser(id, updateUser);
  }

  async updateProfileImage(id: string, file: Express.Multer.File) {
    const user = await this.userRepository.findOneById(id);
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    const uploadResult = await this.cloudinaryService.uploadImage(file);

    user.profileImageUrl = uploadResult.secure_url;
    await this.userRepository.saveUser(user);

    return {
      message: 'Imagen de perfil actualizada correctamente',
      imageUrl: user.profileImageUrl,
    };
  }

  async remove(id: string) {
    return await this.userRepository.deleteUser(id);
  }

  async addAdmin(id: string) {
    return this.userRepository.setAdmin(id);
  }

  async deleteAdmin(id: string) {
    return this.userRepository.removeAdmin(id);
  }
}
