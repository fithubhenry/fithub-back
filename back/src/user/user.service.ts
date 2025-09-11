import { Injectable } from '@nestjs/common';
import { UpdateUserDto } from './dto/updateUser.dto';
import { UserRepository } from './user.repository';
import { User } from './entities/user.entity';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';

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
    const user = await this.findOne(id);
    const uploadResult = await this.cloudinaryService.uploadImage(file);

    user.profileImageUrl = uploadResult.secure_url;
    return this.userRepository.saveUser(user);
  }

  remove(id: string) {
    return this.userRepository.deleteUser(id);
  }
}
