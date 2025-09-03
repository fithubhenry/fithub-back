import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { User } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { EEstado } from 'src/common/statusEnum';
import { JwtService } from '@nestjs/jwt';
import { access } from 'fs';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(email: string, pass: string): Promise<User> {
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) throw new UnauthorizedException('Credenciales invalidas');

    return user;
  }

  async login(email: string, pass: string) {
    const user = await this.validateUser(email, pass);

    const payload = { sub: user.id, email: user.email, esAdmin: user.esAdmin };

    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async register(dto: CreateUserDto): Promise<Omit<User, 'password'>> {
    //Verificar si el email ya existe

    const userExist = await this.userRepository.findOne({
      where: { email: dto.email },
    });

    if (userExist) {
      throw new BadRequestException('El email ya esta en uso');
    }

    //Hashear password

    const hashedPassword = await bcrypt.hash(dto.password, 10);

    //Crear Usuario

    const user = this.userRepository.create({
      apellido_nombre: dto.apellido_nombre,
      email: dto.email,
      password: hashedPassword,
      telefono: dto.telefono,
      fecha_nacimiento: dto.fecha_nacimiento,
      direccion: dto.direccion,
      ciudad: dto.ciudad,
      estado: EEstado.Activo, //por defecto lo activamos
      esAdmin: false, //nadie se registra como admin
    });

    //Guardar en la db (en espera)

    const savedUser = await this.userRepository.save(user);

    //Eliminar password del objeto antes de devolverlo

    const { password, ...userWithoutPassword } = savedUser;
    return userWithoutPassword;
  }
}
