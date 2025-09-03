import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Clase } from './entities/clase.entity';

@Injectable()
export class ClasesService {
  constructor(
    @InjectRepository(Clase)
    private readonly claseRepository: Repository<Clase>,
  ) {}

  // Método para encontrar todas las clases con sus horarios
  async findAll(): Promise<Clase[]> {
    // Usamos una query 'find' con la relación 'horarios' cargada
    return this.claseRepository.find({
      relations: ['horarios'], // Esto carga los turnos asociados a cada clase
      // where: {} // Aquí luego podrás agregar filtros
    });
  }
}
