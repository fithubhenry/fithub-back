import { Injectable } from '@nestjs/common';
import { CreateTurnoDto } from './dto/create-turno.dto';
import { UpdateTurnoDto } from './dto/update-turno.dto';

@Injectable()
export class TurnoService {
  create(createTurnoDto: CreateTurnoDto) {
    return 'This action adds a new turno';
  }

  findAll() {
    return `This action returns all turno`;
  }

  findOne(id: number) {
    return `This action returns a #${id} turno`;
  }

  update(id: number, updateTurnoDto: UpdateTurnoDto) {
    return `This action updates a #${id} turno`;
  }

  remove(id: number) {
    return `This action removes a #${id} turno`;
  }
}
