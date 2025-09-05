import { ApiProperty } from '@nestjs/swagger';
import { Clase } from 'src/clases/entities/clase.entity';
import {
  EGrupoMuscular,
  EIntensidad,
  ESubMusculo,
  ETipos,
} from 'src/common/clasesEnums';

export class HorarioResponseDto {
  @ApiProperty({
    example: '2022-01-01',
    description: 'Fecha de la clase',
  })
  fecha: Date;

  @ApiProperty({
    example: '10:00:00',
    description: 'Hora de inicio de la clase',
  })
  horaInicio: string;

  @ApiProperty({
    example: '11:00:00',
    description: 'Hora de fin de la clase',
  })
  horaFin: string;
}

export class ClaseResponseDto {
  @ApiProperty({
    example: 1,
    description: 'ID de la clase',
  })
  id: string;

  @ApiProperty({
    example: 'Pilates Fitness',
    description: 'Nombre de la clase',
  })
  nombre: string;

  @ApiProperty({
    example: 'Una variante un poco mas fitness de Pilates',
    description: 'Descripcion de la clase',
  })
  descripcion: string;

  @ApiProperty({
    example: 'Alta',
    enum: EIntensidad,
    description: 'Intensidad de la clase',
  })
  intensidad: EIntensidad;

  @ApiProperty({
    example: 'Juan Perez',
    description: 'Instructor de la clase',
  })
  instructor: string;

  @ApiProperty({
    example: '1 hora',
    description: 'Duracion de la clase',
  })
  duracion: string;

  @ApiProperty({
    example: 10,
    description: 'Capacidad de la clase',
  })
  capacidad: number;

  @ApiProperty({
    example: 'Pilates',
    enum: ETipos,
    description: 'Tipo de la clase',
  })
  tipo: ETipos;

  @ApiProperty({
    example: ['Pierna'],
    enum: EGrupoMuscular,
    isArray: true,
    description: 'Grupo muscular de la clase',
  })
  grupo_musculo: EGrupoMuscular[];

  @ApiProperty({
    example: ['Cuadriceps'],
    enum: ESubMusculo,
    isArray: true,
    description: 'Subgrupo muscular de la clase',
  })
  sub_musculo: ESubMusculo[];

  @ApiProperty({
    example: 'Central',
    description: 'Sede donde se da la clase',
  })
  sede: string;

  @ApiProperty({
    example: 'https://example.com/image.jpg',
    description: 'URL de la imagen de la clase',
    required: false,
  })
  imageUrl?: string;

  @ApiProperty({
    type: [HorarioResponseDto],
    description: 'Horarios de la clase',
    example: [
      {
        fecha: '2022-01-01',
        horaInicio: '10:00:00',
        horaFin: '11:00:00',
      },
    ],
  })
  horarios: HorarioResponseDto[];

  @ApiProperty({
    example: '2025-09-04T20:15:00.000Z',
    description: 'Fecha de creación del registro',
  })
  createdAt: Date;

  @ApiProperty({
    example: '2025-09-04T20:15:00.000Z',
    description: 'Fecha de última actualización',
  })
  updatedAt: Date;

  static fromEntity(entity: Clase): ClaseResponseDto {
    return {
      id: entity.id,
      nombre: entity.nombre,
      descripcion: entity.descripcion,
      intensidad: entity.intensidad,
      instructor: entity.instructor,
      duracion: entity.duracion,
      capacidad: entity.capacidad,
      tipo: entity.tipo,
      grupo_musculo: entity.grupo_musculo,
      sub_musculo: entity.sub_musculo,
      sede: entity.sede,
      imageUrl: entity.imageUrl,
      horarios: entity.horarios,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    };
  }
}
