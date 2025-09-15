import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Clase } from './entities/clase.entity';
import { CrearClaseDto } from './dto/createClase.dto';
import { ClasesRepository } from './clases.repository';
import { FiltroClasesDto, OpcionesFiltro } from './dto/filtros.dto';
import { FiltrosRepository } from './filtros.repository';
import { NotFoundError } from 'rxjs';

@Injectable()
export class ClasesService {
  constructor(
    @InjectRepository(Clase)
    private readonly claseRepository: Repository<Clase>,
    private readonly clasesRepository: ClasesRepository,
    private readonly filtrosRepository: FiltrosRepository,
  ) {}

  // Método para encontrar todas las clases con sus horarios
  async findAll(): Promise<Clase[]> {
    // Usamos una query 'find' con la relación 'horarios' cargada
    return this.claseRepository.find({
      relations: ['horarios'], // Esto carga los turnos asociados a cada clase
      // where: {} // Aquí luego podrás agregar filtros
    });
  }

  async newClase(clase: CrearClaseDto) {
    return this.clasesRepository.crearClase(clase);
  }

  async busquedaConFiltros(filtros: FiltroClasesDto) {
    return this.filtrosRepository.filtrarClases(filtros);
  }

  async cargaSeeder() {
    return this.clasesRepository.cargaSeeder();
  }

  async findById(id: string) {
    if (!id) throw new NotFoundException('Clase no encontrada');
    const clase = await this.claseRepository.findOne({
      where: { id },
      relations: ['horarios'],
    });
    if (!clase) throw new NotFoundException('Clase no encontrada');
    return clase;
  }
}
