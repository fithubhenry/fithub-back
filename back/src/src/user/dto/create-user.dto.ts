import {
  IsDate,
  IsEmail,
  IsEmpty,
  IsNotEmpty,
  IsNumber,
  IsString,
  Matches,
  MaxDate,
  MaxLength,
  MinLength,
  Validate,
} from 'class-validator';
import { EEstado } from 'src/common/statusEnum';
import { EsAdulto } from 'src/decorators/ageValidator';
import { MatchPassword } from 'src/decorators/matchPassword.decorator';

export class CreateUserDto {
  id: string;

  @IsNotEmpty({ message: 'El apellido y nombre es requerido' })
  @IsString()
  @MinLength(3, {
    message: 'El apellido y nombre debe tener al menos 3 caracteres',
  })
  @MaxLength(20, {
    message: 'El apellido y nombre debe tener máximo 20 caracteres',
  })
  apellido_nombre: string;

  @IsNotEmpty({ message: 'El password es requerido' })
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

  @IsNotEmpty()
  @Validate(MatchPassword, ['password'])
  confirmPassword: string;

  @IsNotEmpty()
  @IsNumber()
  telefono: number;

  @IsNotEmpty()
  @IsDate()
  @Validate(EsAdulto, { message: 'Debe ser mayor de edad' })
  @MaxDate(new Date(), {
    message: 'La fecha de nacimiento no puede ser en el futuro',
  })
  fecha_nacimiento: Date;

  @IsNotEmpty()
  @MaxLength(50, { message: 'El email debe tener máximo 50 caracteres' })
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(3, { message: 'La dirección debe tener al menos 3 caracteres' })
  @MaxLength(50, { message: 'La dirección debe tener máximo 50 caracteres' })
  direccion: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(3, { message: 'La ciudad debe tener al menos 3 caracteres' })
  @MaxLength(50, { message: 'La ciudad debe tener máximo 50 caracteres' })
  ciudad: string;

  @IsEmpty()
  esAdmin: boolean;

  @IsEmpty()
  estado: EEstado;
}
