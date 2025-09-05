import { PartialType } from '@nestjs/mapped-types';
import { CreateTurnoDto } from './createTurno.dto';

export class UpdateTurnoDto extends PartialType(CreateTurnoDto) {}
