import {
  EGrupoMuscular,
  EIntensidad,
  ESubMusculo,
  ETipos,
} from 'src/common/clasesEnums';
import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Clase } from './entities/clase.entity';
import { Turno } from '../turno/entities/turno.entity';
import { CrearClaseDto, HorarioDto } from './dto/createClase.dto';
import * as fs from 'fs';
import clasesSeeder from '../helpers/clasesSeeder.json';
import * as path from 'path';

@Injectable()
export class ClasesRepository {
  constructor(
    @InjectRepository(Clase)
    private readonly claseRepository: Repository<Clase>,
    @InjectRepository(Turno)
    private readonly turnoRepository: Repository<Turno>,
  ) {}

  async crearClase(crearClaseDto: CrearClaseDto): Promise<Clase> {
    // 1. Verificar si la clase ya existe
    const claseExistente = await this.claseRepository.findOne({
      where: {
        nombre: crearClaseDto.nombre,
        sede: crearClaseDto.sede,
      },
    });

    if (claseExistente) {
      throw new ConflictException('Clase ya existe en esta sede');
    }

    // 2. Crear la clase sin horarios primero
    const clase = this.claseRepository.create({
      nombre: crearClaseDto.nombre,
      descripcion: crearClaseDto.descripcion,
      intensidad: crearClaseDto.intensidad,
      instructor: crearClaseDto.instructor,
      duracion: crearClaseDto.duracion,
      capacidad: crearClaseDto.capacidad,
      participantes: 0,
      tipo: crearClaseDto.tipo,
      grupo_musculo: crearClaseDto.grupo_musculo,
      sub_musculo: crearClaseDto.sub_musculo,
      sede: crearClaseDto.sede,
      imageUrl: crearClaseDto.imageUrl,
    });

    // 3. Guardar la clase primero para obtener el ID
    const claseGuardada = await this.claseRepository.save(clase);

    // 4. Manejar horarios si existen
    if (crearClaseDto.horarios && crearClaseDto.horarios.length > 0) {
      const turnos = await this.manejarHorarios(crearClaseDto.horarios);

      // Asignar los turnos a la clase
      claseGuardada.horarios = turnos;

      // Guardar la relación
      await this.claseRepository.save(claseGuardada);
    }

    // 5. Retornar la clase completa con relaciones
    const foundClase = await this.claseRepository.findOne({
      where: { id: claseGuardada.id },
      relations: ['horarios'],
    });
    if (!foundClase)
      throw new NotFoundException(
        'No se pudo recuperar la clase de la base de datos',
      );
    return foundClase;
  }

  private async manejarHorarios(horariosDto: HorarioDto[]): Promise<Turno[]> {
    const turnos: Turno[] = [];

    for (const horarioDto of horariosDto) {
      // Buscar si ya existe un turno con esta fecha y hora
      let turno = await this.turnoRepository.findOne({
        where: {
          fecha: horarioDto.fecha,
          horaInicio: horarioDto.horaInicio,
          horaFin: horarioDto.horaFin,
        },
      });

      // Si no existe, crear nuevo turno
      if (!turno) {
        turno = this.turnoRepository.create({
          fecha: horarioDto.fecha,
          horaInicio: horarioDto.horaInicio,
          horaFin: horarioDto.horaFin,
          diaSemana: this.obtenerDiaSemana(horarioDto.fecha),
          activo: true,
        });
        await this.turnoRepository.save(turno);
      }

      turnos.push(turno);
    }

    return turnos;
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

  // Método adicional para agregar horarios a una clase existente
  async agregarHorariosAClase(
    claseId: string,
    horariosDto: HorarioDto[],
  ): Promise<Clase> {
    const clase = await this.claseRepository.findOne({
      where: { id: claseId },
      relations: ['horarios'],
    });

    if (!clase) {
      throw new NotFoundException('Clase no encontrada');
    }

    const nuevosTurnos = await this.manejarHorarios(horariosDto);

    // Combinar horarios existentes con nuevos
    clase.horarios = [...clase.horarios, ...nuevosTurnos];

    return await this.claseRepository.save(clase);
  }

  async cargaSeeder() {
    // Al importar directamente el JSON, TypeScript y el empaquetador se encargan de incluirlo.
    // Mapeamos los datos del seeder para convertir las fechas de string a Date.
    const clases: CrearClaseDto[] = clasesSeeder.map((clase) => {
      return {
        ...clase,
        // Le decimos a TypeScript que trate estos strings como sus tipos enum correspondientes.
        intensidad: clase.intensidad as EIntensidad,
        tipo: clase.tipo as ETipos,
        grupo_musculo: clase.grupo_musculo as EGrupoMuscular[],
        sub_musculo: clase.sub_musculo as ESubMusculo[],
        horarios: clase.horarios.map((horario) => {
          return {
            ...horario,
            fecha: new Date(horario.fecha), // Aquí ocurre la conversión
          };
        }),
      };
    });
    //Recorrido del array
    for (const clase of clases) {
      // Verificar si la clase ya existe antes de intentar crearla
      const claseExistente = await this.claseRepository.findOne({
        where: {
          nombre: clase.nombre,
          sede: clase.sede,
        },
      });

      if (!claseExistente) {
        try {
          await this.crearClase(clase);
          console.log(`Clase '${clase.nombre}' creada exitosamente.`);
        } catch (error) {
          // Este catch ahora solo se activará para errores inesperados, no para conflictos
          console.log(
            `Error al crear la clase '${clase.nombre}': ${error.message}`,
          );
        }
      }
    }
  }
}
