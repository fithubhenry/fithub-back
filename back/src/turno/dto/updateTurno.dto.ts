import { PartialType } from '@nestjs/swagger';
import { CreateTurnoDto } from './createTurno.dto';

export class UpdateTurnoDto extends PartialType(CreateTurnoDto) {}
