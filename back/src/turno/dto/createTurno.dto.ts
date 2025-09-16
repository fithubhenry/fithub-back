import { IsUUID, IsDateString, IsString, IsEnum } from 'class-validator';
import { EstadoTurno } from '../entities/turno.entity';

export class CreateTurnoDto {
  @IsUUID()
  usuarioId: string;

  @IsUUID()
  claseId: string;

  @IsDateString()
  fecha: string;

  @IsString()
  hora: string;

  @IsEnum(EstadoTurno)
  estado?: EstadoTurno;
}
