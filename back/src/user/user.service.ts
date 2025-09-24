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

  // 🚀 Método optimizado para obtener solo turnos con información mínima
  async findUserTurnos(id: string) {
    const user = await this.userRepository.findOneById(id);
    
    // Transformar turnos para devolver solo la info necesaria
    const turnosOptimizados = user.turnos.map(turno => ({
      id: turno.id,
      fecha: turno.fecha,
      horaInicio: turno.horaInicio,
      horaFin: turno.horaFin,
      estado: turno.estado,
      diaSemana: turno.diaSemana,
      activo: turno.activo,
      clase: turno.clase ? {
        id: turno.clase.id,
        nombre: turno.clase.nombre,
        imageUrl: turno.clase.imageUrl,
        instructor: turno.clase.instructor,
      } : null
    }));

    return turnosOptimizados;
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
