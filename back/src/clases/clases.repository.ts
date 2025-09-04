import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Clase } from './entities/clase.entity';
import { Turno } from '../turno/entities/turno.entity';
import { CrearClaseDto, HorarioDto } from './dto/create-clase.dto';

@Injectable()
export class ClasesRepository {
  constructor(
    @InjectRepository(Clase)
    private readonly claseRepository: Repository<Clase>,
    @InjectRepository(Turno)
    private readonly turnoRepository: Repository<Turno>,
  ) {}

  async crearClase(clase: CrearClaseDto): Promise<Clase> {
    // 1. Verificar si ya existe una clase con el mismo nombre en la misma sede
    const claseExistente = await this.claseRepository.findOne({
      where: {
        nombre: clase.nombre,
        sede: clase.sede,
      },
    });

    if (claseExistente) {
      throw new ConflictException(
        `Ya existe una clase con el nombre "${clase.nombre}" en la sede ${clase.sede}`,
      );
    }

    // 2. Crear la clase (sin horarios primero)
    const newClase = this.claseRepository.create({
      nombre: clase.nombre,
      descripcion: clase.descripcion,
      intensidad: clase.intensidad,
      instructor: clase.instructor,
      duracion: clase.duracion,
      capacidad: clase.capacidad,
      participantes: 0, // Inicia con 0 participantes
      tipo: clase.tipo,
      grupo_musculo: clase.grupo_musculo,
      sub_musculo: clase.sub_musculo,
      sede: clase.sede,
      imageUrl: clase.imageUrl,
    });

    // 3. Guardar la clase en la base de datos
    const claseGuardada = await this.claseRepository.save(clase);

    // 4. Crear los horarios/turnos si se proporcionaron
    if (clase.horarios && clase.horarios.length > 0) {
      await this.crearHorariosParaClase(claseGuardada.id, clase.horarios);
    }

    // 5. Retornar la clase completa con sus horarios
    const foundClase = await this.claseRepository.findOne({
      where: { id: claseGuardada.id },
      relations: ['horarios'],
    });
    if (!foundClase)
      throw new NotFoundException(
        'Error al recuperar la clase de la base de datos',
      );
    return foundClase;
  }

  private async crearHorariosParaClase(
    claseId: string,
    horarios: HorarioDto[],
  ): Promise<Turno[]> {
    const clase = await this.claseRepository.findOneBy({ id: claseId });
    if (!clase) {
      throw new NotFoundException('Clase no encontrada');
    }

    const turnos: Turno[] = [];

    for (const horario of horarios) {
      // Verificar si ya existe un turno en la misma fecha y hora
      const turnoExistente = await this.turnoRepository.findOne({
        where: {
          date: horario.fecha,
          hora: horario.hora,
          clase: { id: claseId },
        },
      });

      if (turnoExistente) {
        throw new ConflictException(
          `Ya existe un turno para la fecha ${horario.fecha} a las ${horario.hora}`,
        );
      }

      const turno = this.turnoRepository.create({
        date: horario.fecha,
        hora: horario.hora,
        diaSemana: this.obtenerDiaSemana(horario.fecha),
        clase: clase,
        inscriptos: 0,
        disponible: true,
      });

      turnos.push(turno);
    }

    return await this.turnoRepository.save(turnos);
  }

  private obtenerDiaSemana(fecha: Date): string {
    const dias = [
      'DOMINGO',
      'LUNES',
      'MARTES',
      'MIERCOLES',
      'JUEVES',
      'VIERNES',
      'SABADO',
    ];
    return dias[new Date(fecha).getDay()];
  }
}
