import { IsEnum } from 'class-validator';
import { EstadoTurno } from '../entities/turno.entity';

export class UpdateEstadoTurnoDto {
  @IsEnum(EstadoTurno)
  estado: EstadoTurno;
}
