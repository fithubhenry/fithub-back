import { ApiProperty } from '@nestjs/swagger';
import { EstadoTurno } from 'src/turno/entities/turno.entity';

export class TurnoSimplificadoDto {
  @ApiProperty({ example: 'a1b2c3d4-e5f6-7890-abcd-1234567890ef' })
  id: string;

  @ApiProperty({ example: '2025-09-20' })
  fecha: Date;

  @ApiProperty({ enum: EstadoTurno })
  estado: EstadoTurno;

  @ApiProperty({ example: '10:00:00' })
  horaInicio: string;

  @ApiProperty({ example: '11:00:00' })
  horaFin: string;

  @ApiProperty({ example: 'LUNES' })
  diaSemana: string;

  @ApiProperty({ example: true })
  activo: boolean;

  @ApiProperty()
  clase: {
    id: string;
    nombre: string;
    descripcion?: string;
    capacidad: number;
    participantes: number;
    tipoClase: string;
    nivel: string;
    activa: boolean;
  };
}

export class UserTurnosResponseDto {
  @ApiProperty({ example: 'a1b2c3d4-e5f6-7890-abcd-1234567890ef' })
  id: string;

  @ApiProperty({ example: 'Juan' })
  nombre: string;

  @ApiProperty({ example: 'Pérez' })
  apellido: string;

  @ApiProperty({ example: '123456' })
  telefono: number;

  @ApiProperty({ example: '1990-01-01' })
  fecha_nacimiento: Date;

  @ApiProperty({ example: 'juan@example.com' })
  email: string;

  @ApiProperty({ example: 'Calle 123' })
  direccion: string;

  @ApiProperty({ example: 'Buenos Aires' })
  ciudad: string;

  @ApiProperty({ example: false })
  esAdmin: boolean;

  @ApiProperty({ example: 'Activo' })
  estado: string;

  @ApiProperty({ example: 'https://example.com/image.jpg' })
  profileImageUrl: string;

  @ApiProperty({ type: [TurnoSimplificadoDto] })
  turnos: TurnoSimplificadoDto[];

  @ApiProperty()
  historialPagos: {
    amount: number;
    dateApproved: Date;
    status: string;
  }[];
}