import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, Repository } from 'typeorm';
import { Turno, EstadoTurno } from './entities/turno.entity';
import { CreateTurnoDto } from './dto/createTurno.dto';
import { UpdateTurnoDto } from './dto/updateTurno.dto';
import { UpdateEstadoTurnoDto } from './dto/updateEstado.dto';
import { User } from 'src/user/entities/user.entity';
import { Clase } from 'src/clases/entities/clase.entity';

@Injectable()
export class TurnosService {
  constructor(
    @InjectRepository(Turno)
    private readonly turnoRepository: Repository<Turno>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Clase)
    private readonly claseRepository: Repository<Clase>,
  ) {}

  async create(dto: CreateTurnoDto): Promise<Turno> {
    const usuario = await this.userRepository.findOne({
      where: { id: dto.usuarioId },
    });
    const clase = await this.claseRepository.findOne({
      where: { id: dto.claseId },
      relations: ['horarios'],
    });

    if (!usuario) throw new NotFoundException('Usuario no encontrado');
    if (!clase) throw new NotFoundException('Clase no encontrada');

    const claseConHorario = await this.claseRepository
      .createQueryBuilder('clase')
      .leftJoinAndSelect('clase.horarios', 'horario')
      .where('clase.id = :claseId', { claseId: dto.claseId })
      .andWhere('horario.fecha = :fecha', { fecha: dto.fecha })
      .andWhere('horario.horaInicio = :horaInicio', {
        horaInicio: dto.horaInicio,
      })
      .getOne();

    if (!claseConHorario)
      throw new NotFoundException('Horario no válido para esta clase');

    const turno = this.turnoRepository.create({
      user: usuario,
      clase,
      fecha: dto.fecha,
      horaInicio: dto.horaInicio,
      horaFin: dto.horaFin,
      estado: EstadoTurno.PENDIENTE,
    });

    return this.turnoRepository.save(turno);
  }
  findAll(): Promise<Turno[]> {
    return this.turnoRepository.find();
  }

  async findOne(id: string): Promise<Turno> {
    const turno = await this.turnoRepository.findOne({ where: { id } });
    if (!turno) throw new NotFoundException('Turno no encontrado');
    return turno;
  }

  async update(id: string, dto: UpdateTurnoDto): Promise<Turno> {
    const turno = await this.findOne(id);
    Object.assign(turno, dto);
    return this.turnoRepository.save(turno);
  }

  async updateEstado(id: string, dto: UpdateEstadoTurnoDto): Promise<Turno> {
    const turno = await this.findOne(id);
    turno.estado = dto.estado;
    return this.turnoRepository.save(turno);
  }

  async remove(id: string): Promise<void> {
    const turno = await this.findOne(id);
    await this.turnoRepository.remove(turno);
  }

  async findTurnosProximos(): Promise<Turno[]> {
    const ahora = new Date();
    const enUnaHora = new Date(ahora.getTime() + 60 * 60 * 1000);

    return this.turnoRepository.find({
      where: {
        fecha: Between(ahora, enUnaHora),
      },
      relations: ['user', 'clase'], // 👈 importante para el mail
    });
  }
}
