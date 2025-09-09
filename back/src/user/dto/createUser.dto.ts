import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsDate,
  IsEmail,
  IsEmpty,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Matches,
  MaxDate,
  MaxLength,
  MinLength,
  Validate,
} from 'class-validator';
import { EEstado } from 'src/common/usersEnum';
import { EsAdulto } from 'src/decorators/ageValidator';
import { MatchPassword } from 'src/decorators/matchPassword.decorator';

export class CreateUserDto {
  @ApiProperty({
    example: 'Juan',
    description: 'Nombre del usuario',
  })
  @IsNotEmpty({ message: 'El nombre es requerido' })
  @IsString()
  @MinLength(3, {
    message: 'El nombre debe tener al menos 3 caracteres',
  })
  @MaxLength(20, {
    message: 'El nombre debe tener máximo 20 caracteres',
  })
  nombre: string;

  @ApiProperty({
    example: 'Pérez',
    description: 'Apellido del usuario',
  })
  @IsNotEmpty({ message: 'El apellido y nombre es requerido' })
  @IsString()
  @MinLength(3, {
    message: 'El apellido debe tener al menos 3 caracteres',
  })
  @MaxLength(25, {
    message: 'El apellido debe tener máximo 25 caracteres',
  })
  apellido: string;

  @ApiProperty({ example: 'Test123!', description: 'Contraseña segura' })
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

  @ApiProperty({
    example: 'Test123!',
    description: 'Confirmación de la contraseña',
  })
  @IsOptional()
  @Validate(MatchPassword, ['password'])
  confirmPassword: string;

  @ApiProperty({ example: 5491112345678, description: 'Número de teléfono' })
  @IsOptional()
  @IsNumber()
  telefono: number;

  @ApiProperty({
    example: '1990-01-01',
    description: 'Fecha de nacimiento (YYYY-MM-DD)',
  })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  @Validate(EsAdulto, { message: 'Debe ser mayor de edad' })
  @MaxDate(new Date(), {
    message: 'La fecha de nacimiento no puede ser en el futuro',
  })
  fecha_nacimiento: Date;

  @ApiProperty({
    example: 'usuario@ejemplo.com',
    description: 'Email único del usuario',
  })
  @IsNotEmpty()
  @MaxLength(50, { message: 'El email debe tener máximo 50 caracteres' })
  @IsEmail()
  email: string;

  @ApiProperty({
    example: 'Calle Falsa 123',
    description: 'Dirección del usuario',
  })
  @IsOptional()
  @IsString()
  @MinLength(3, { message: 'La dirección debe tener al menos 3 caracteres' })
  @MaxLength(50, { message: 'La dirección debe tener máximo 50 caracteres' })
  direccion: string;

  @ApiProperty({ example: 'Buenos Aires', description: 'Ciudad de residencia' })
  @IsOptional()
  @IsString()
  @MinLength(3, { message: 'La ciudad debe tener al menos 3 caracteres' })
  @MaxLength(50, { message: 'La ciudad debe tener máximo 50 caracteres' })
  ciudad: string;

  @IsEmpty()
  esAdmin: boolean;

  @IsEmpty()
  estado: EEstado;
}
