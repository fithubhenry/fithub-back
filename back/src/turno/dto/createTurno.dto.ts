import { IsUUID, IsDateString, IsString, IsEnum } from 'class-validator';
import { EstadoTurno } from '../entities/turno.entity';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTurnoDto {
  @ApiProperty({
    example: '9f584139-c410-46dc-91e3-b1b0ed224673',
    description: 'ID del usuario',
  })
  @IsUUID()
  usuarioId: string;

  @ApiProperty({
    example: '07b87244-af38-43c4-bf67-537acfcd241e',
    description: 'ID de la clase',
  })
  @IsUUID()
  claseId: string;

  @ApiProperty({ example: '2025-09-20', description: 'Fecha del turno' })
  @IsDateString()
  fecha: Date;

  @ApiProperty({ example: '10:00:00', description: 'Hora de inicio' })
  @IsString()
  horaInicio: string;

  @ApiProperty({ example: '11:00:00', description: 'Hora de fin' })
  @IsString()
  horaFin: string;
}
