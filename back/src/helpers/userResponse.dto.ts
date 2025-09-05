import { ApiProperty } from '@nestjs/swagger';
import { EEstado } from 'src/common/usersEnum';

export class UserResponseDto {
  @ApiProperty({
    description: 'ID del usuario',
    example: 'a1b2c3d4-e5f6-7890-abcd-1234567890ef',
  })
  id: string;

  @ApiProperty({
    description: 'Apellido y nombre del usuario',
    example: 'Juan Pérez',
  })
  apellido_nombre: string;

  @ApiProperty({ description: 'Teléfono del usuario', example: 1122334455 })
  telefono: number;

  @ApiProperty({ description: 'Fecha de nacimiento', example: '1990-01-01' })
  fecha_nacimiento: Date;

  @ApiProperty({
    description: 'Email del usuario',
    example: 'usuario@mail.com',
  })
  email: string;

  @ApiProperty({
    description: 'Dirección del usuario',
    example: 'Calle Falsa 123',
  })
  direccion: string;

  @ApiProperty({ description: 'Ciudad del usuario', example: 'Buenos Aires' })
  ciudad: string;

  @ApiProperty({
    description: 'Indica si el usuario es administrador',
    example: false,
  })
  esAdmin: boolean;

  @ApiProperty({
    description: 'Estado del usuario',
    enum: EEstado,
    example: EEstado.Invitado,
  })
  estado: EEstado;
}
