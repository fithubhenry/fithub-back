import {
  IsNumber,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  @MinLength(3, {
    message: 'El apellido y nombre debe tener al menos 3 caracteres',
  })
  @MaxLength(20, {
    message: 'El apellido y nombre debe tener máximo 20 caracteres',
  })
  apellido_nombre: string;

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

  @IsOptional()
  @IsNumber()
  telefono: number;

  @IsOptional()
  @IsString()
  @MinLength(3, { message: 'La dirección debe tener al menos 3 caracteres' })
  @MaxLength(50, { message: 'La dirección debe tener máximo 50 caracteres' })
  direccion: string;

  @IsOptional()
  @IsString()
  @MinLength(3, { message: 'La ciudad debe tener al menos 3 caracteres' })
  @MaxLength(50, { message: 'La ciudad debe tener máximo 50 caracteres' })
  ciudad: string;
}
