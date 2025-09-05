import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsNumber,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class UpdateUserDto {
  @ApiPropertyOptional({
    example: 'Juan Perez',
    description: 'Apellido y nombre del usuario',
    minLength: 3,
    maxLength: 20,
  })
  @IsOptional()
  @IsString()
  @MinLength(3, {
    message: 'El apellido y nombre debe tener al menos 3 caracteres',
  })
  @MaxLength(20, {
    message: 'El apellido y nombre debe tener máximo 20 caracteres',
  })
  apellido_nombre: string;

  @ApiPropertyOptional({
    example: 'Test123!',
    description:
      'Contraseña del usuario (mínimo 8 caracteres, una mayúscula, una minúscula, un número y un carácter especial)',
    minLength: 8,
    maxLength: 20,
  })
  @IsOptional()
  @IsString()
  @MinLength(8, { message: 'El password debe tener al menos 8 caracteres' })
  @MaxLength(20, { message: 'El password debe tener máximo 20 caracteres' })
  @Matches(/(?=.*[a-z])/, {
    message: 'El password debe tener al menos una letra minúscula',
  })
  @Matches(/(?=.*[A-Z])/, {
    message: 'El password debe tener al menos una letra mayúscula',
  })
  @Matches(/(?=.*\d)/, { message: 'El password debe tener al menos un número' })
  @Matches(/(?=.*[@$!%*?&])/, {
    message: 'El password debe tener al menos un carácter especial',
  })
  password: string;

  @ApiPropertyOptional({
    example: 5491112345678,
    description: 'Teléfono de contacto del usuario',
  })
  @IsOptional()
  @IsNumber()
  telefono: number;

  @ApiPropertyOptional({
    example: 'Calle Falsa 123',
    description: 'Dirección del usuario',
    minLength: 3,
    maxLength: 50,
  })
  @IsOptional()
  @IsString()
  @MinLength(3, { message: 'La dirección debe tener al menos 3 caracteres' })
  @MaxLength(50, { message: 'La dirección debe tener máximo 50 caracteres' })
  direccion: string;

  @ApiPropertyOptional({
    example: 'Buenos Aires',
    description: 'Ciudad del usuario',
    minLength: 3,
    maxLength: 50,
  })
  @IsOptional()
  @IsString()
  @MinLength(3, { message: 'La ciudad debe tener al menos 3 caracteres' })
  @MaxLength(50, { message: 'La ciudad debe tener máximo 50 caracteres' })
  ciudad: string;
}
