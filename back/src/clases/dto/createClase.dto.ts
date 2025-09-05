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
import { ApiProperty } from '@nestjs/swagger';

export class HorarioDto {
  @ApiProperty({
    example: '2022-01-01',
    description: 'Fecha de la clase',
  })
  @IsDateString()
  fecha: Date;

  @ApiProperty({
    example: '10:00:00',
    description: 'Hora de inicio de la clase',
  })
  @IsString()
  @Matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/)
  horaInicio: string;

  @ApiProperty({
    example: '11:00:00',
    description: 'Hora de fin de la clase',
  })
  @IsString()
  @Matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/)
  horaFin: string;
}

export class CrearClaseDto {
  @ApiProperty({
    example: 'Pilates Fitness',
    description: 'Nombre de la clase',
  })
  @IsNotEmpty()
  @IsString()
  nombre: string;

  @ApiProperty({
    example: 'Una variante un poco mas fitness de Pilates',
    description: 'Descripcion de la clase',
  })
  @IsNotEmpty()
  @IsString()
  descripcion: string;

  @ApiProperty({
    example: 'Alta',
    description: 'Intensidad de la clase',
  })
  @IsNotEmpty()
  intensidad: EIntensidad;

  @ApiProperty({
    example: 'Juan Perez',
    description: 'Instructor de la clase',
  })
  @IsNotEmpty()
  @IsString()
  instructor: string;

  @ApiProperty({
    example: '1 hora',
    description: 'Duracion de la clase',
  })
  @IsNotEmpty()
  @IsString()
  duracion: string;

  @ApiProperty({
    example: '10',
    description: 'Capacidad de la clase',
  })
  @IsNotEmpty()
  @IsNumber()
  capacidad: number;

  @ApiProperty({
    example: 'Pilates',
    description: 'Tipo de la clase',
  })
  @IsNotEmpty()
  tipo: ETipos;

  @ApiProperty({
    example: 'Pierna',
    description: 'Grupo muscular de la clase',
  })
  @IsNotEmpty()
  grupo_musculo: [EGrupoMuscular];

  @ApiProperty({
    example: 'Cuadriceps',
    description: 'Subgrupo muscular de la clase',
  })
  @IsNotEmpty()
  sub_musculo: [ESubMusculo];

  @ApiProperty({
    example: 'Central',
    description: 'Sede donde se da la clase',
  })
  @IsNotEmpty()
  @IsString()
  sede: string;

  @ApiProperty({
    example: 'https://example.com/image.jpg',
    description: 'URL de la imagen de la clase',
  })
  @IsOptional()
  @IsString()
  imageUrl: string;

  @ApiProperty({
    example: [
      {
        fecha: '2022-01-01',
        horaInicio: '10:00:00',
        horaFin: '11:00:00',
      },
    ],
    description: 'Horarios de la clase',
  })
  @IsNotEmpty()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => HorarioDto)
  horarios: HorarioDto[];
}
