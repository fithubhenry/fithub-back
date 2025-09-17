import { IsUUID, IsDateString, IsString, IsEnum } from 'class-validator';
import { EstadoTurno } from '../entities/turno.entity';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTurnoDto {
  @ApiProperty({
    example: 'a1b2c3d4-e5f6-7890-abcd-1234567890ef',
    description: 'ID del usuario',
  })
  @IsUUID()
  usuarioId: string;

  @ApiProperty({
    example: 'a1b2c3d4-e5f6-7890-abcd-1234567890ef',
    description: 'ID de la clase',
  })
  @IsUUID()
  claseId: string;

  @ApiProperty({
    example: '2022-01-01',
    description: 'Fecha del turno en formato YYYY-MM-DD',
  })
  @IsDateString()
  fecha: string;

  @ApiProperty({
    example: '10:00:00',
    description: 'Hora del turno en formato HH:mm:ss',
  })
  @IsString()
  hora: string;

  @ApiProperty({
    example: 'Pendiente',
    enum: EstadoTurno,
    description: 'Estado del turno',
  })
  @IsEnum(EstadoTurno)
  estado?: EstadoTurno;
}
