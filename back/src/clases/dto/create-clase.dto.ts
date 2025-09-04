import {
  EGrupoMuscular,
  EIntensidad,
  ESubMusculo,
  ETipos,
} from 'src/common/clasesEnums';
import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsString,
  IsOptional,
  ValidateNested,
  IsDateString,
  Matches,
} from 'class-validator';
import { Type } from 'class-transformer';

export class HorarioDto {
  @IsDateString()
  fecha: Date;

  @IsString()
  @Matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/)
  horaInicio: string;

  @IsString()
  @Matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/)
  horaFin: string;
}

export class CrearClaseDto {
  @IsNotEmpty()
  @IsString()
  nombre: string;

  @IsNotEmpty()
  @IsString()
  descripcion: string;

  @IsNotEmpty()
  intensidad: EIntensidad;

  @IsNotEmpty()
  @IsString()
  instructor: string;

  @IsNotEmpty()
  @IsString()
  duracion: string;

  @IsNotEmpty()
  @IsNumber()
  capacidad: number;

  @IsNotEmpty()
  tipo: ETipos;

  @IsNotEmpty()
  grupo_musculo: EGrupoMuscular;

  @IsNotEmpty()
  sub_musculo: ESubMusculo;

  @IsNotEmpty()
  @IsString()
  sede: string;

  @IsOptional()
  @IsString()
  imageUrl: string;

  @IsNotEmpty()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => HorarioDto)
  horarios: HorarioDto[];
}
