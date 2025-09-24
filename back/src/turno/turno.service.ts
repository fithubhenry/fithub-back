import { NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, Repository } from 'typeorm';
import { Turno, EstadoTurno } from './entities/turno.entity';
import { CreateTurnoDto } from './dto/createTurno.dto';
import { UpdateTurnoDto } from './dto/updateTurno.dto';
import { UpdateEstadoTurnoDto } from './dto/updateEstado.dto';
import { User } from 'src/user/entities/user.entity';
import { Clase } from 'src/clases/entities/clase.entity';
import { MailerService } from '../mail/mail.service';
import { TurnoResponseDto } from './dto/turnoResponse.dto';

export class TurnosService {
  // Métodos para uso interno (schedule) que retornan la entidad completa
  async findTurnosProximosEntity(): Promise<Turno[]> {
    const ahora = new Date();
    const enUnaHora = new Date(ahora.getTime() + 60 * 60 * 1000);
    return this.turnoRepository.find({
      where: { fecha: Between(ahora, enUnaHora) },
      relations: ['user', 'clase'],
    });
  }

  async findTurnosEnRangoEntity(
    fechaInicio: Date,
    fechaFin: Date,
  ): Promise<Turno[]> {
    return this.turnoRepository.find({
      where: { fecha: Between(fechaInicio, fechaFin) },
      relations: ['user', 'clase'],
    });
  }

  async findTurnosActivosEntity(): Promise<Turno[]> {
    return this.turnoRepository.find({
      where: [{ estado: EstadoTurno.PENDIENTE }],
      relations: ['user', 'clase'],
    });
  }
  // Mapea la entidad Turno a TurnoResponseDto
  mapTurnoToResponse(turno: Turno) {
    return {
      id: turno.id,
      fecha: turno.fecha,
      estado: turno.estado,
      userId: turno.user?.id,
      claseId: turno.clase?.id ?? null,
      horaInicio: turno.horaInicio,
      horaFin: turno.horaFin,
      diaSemana: turno.diaSemana,
      activo: turno.activo,
    };
  }
  // Lógica para actualizar automáticamente el estado a FINALIZADO si el turno expiró
  async actualizarTurnosFinalizados(): Promise<void> {
    const ahora = new Date();
    // Obtengo todos los turnos PENDIENTE
    const turnosPendientes = await this.turnoRepository.find({
      where: { estado: EstadoTurno.PENDIENTE },
    });
    let actualizados = 0;
    for (const turno of turnosPendientes) {
      const fechaHoraFin = new Date(`${turno.fecha}T${turno.horaFin}`);
      if (fechaHoraFin < ahora) {
        turno.estado = EstadoTurno.FINALIZADO;
        await this.turnoRepository.save(turno);
        actualizados++;
        console.log(`[Turno] Actualizado a FINALIZADO: ${turno.id}`);
      }
    }
    console.log(
      `[Turno] Total turnos actualizados a FINALIZADO: ${actualizados}`,
    );

    // Ejemplo de cron job (debes mover esto a un servicio con @Cron si usas schedule)
    // setInterval(() => this.actualizarTurnosFinalizados(), 60000); // cada minuto
  }
  constructor(
    @InjectRepository(Turno)
    private readonly turnoRepository: Repository<Turno>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Clase)
    private readonly claseRepository: Repository<Clase>,
    private readonly mailerService: MailerService,
  ) {}

  async create(dto: CreateTurnoDto): Promise<TurnoResponseDto> {
    const usuario = await this.userRepository.findOne({
      where: { id: dto.usuarioId },
    });
    if (!usuario) throw new NotFoundException('Usuario no encontrado');

    const clase = await this.claseRepository.findOne({
      where: { id: dto.claseId },
      relations: ['horarios'],
    });
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

    if (clase.participantes >= clase.capacidad) {
      throw new NotFoundException(
        'La clase está llena, no se pueden crear más turnos',
      );
    }

    const diaSemana = this.obtenerDiaSemana(dto.fecha);
    clase.participantes += 1;

    const turno = this.turnoRepository.create({
      user: usuario,
      clase: clase,
      fecha: dto.fecha,
      horaInicio: dto.horaInicio,
      horaFin: dto.horaFin,
      estado: EstadoTurno.PENDIENTE,
      diaSemana,
    });

    // Guardar el turno
    const turnoGuardado = await this.turnoRepository.save(turno);

    // Agregar el turno al array de horarios de la clase y guardar la clase
    clase.horarios = [...(clase.horarios || []), turnoGuardado];
    await this.claseRepository.save(clase);

    // Enviar email de prueba cuando se crea un turno (asíncrono - no bloquear respuesta)
    this.sendTestEmailOnBooking(
      usuario.email,
      usuario.nombre,
      clase.nombre,
    ).catch((error) => {
      console.error('❌ Error enviando email de prueba al crear turno:', error);
      // No fallar la creación del turno si falla el email
    });

    return this.mapTurnoToResponse(turnoGuardado);
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
  findAll(): Promise<TurnoResponseDto[]> {
    return this.actualizarTurnosFinalizados().then(async () => {
      const turnos = await this.turnoRepository.find({
        relations: ['user', 'clase'],
      });
      return turnos.map(this.mapTurnoToResponse);
    });
  }

  async findOne(id: string): Promise<TurnoResponseDto> {
    await this.actualizarTurnosFinalizados();
    const turno = await this.turnoRepository.findOne({
      where: { id },
      relations: ['user', 'clase'],
    });
    if (!turno) throw new NotFoundException('Turno no encontrado');
    return this.mapTurnoToResponse(turno);
  }

  async update(id: string, dto: UpdateTurnoDto): Promise<TurnoResponseDto> {
    const turno = await this.turnoRepository.findOne({
      where: { id },
      relations: ['user', 'clase'],
    });
    if (!turno) throw new NotFoundException('Turno no encontrado');
    Object.assign(turno, dto);
    const actualizado = await this.turnoRepository.save(turno);
    return this.mapTurnoToResponse(actualizado);
  }

  async updateEstado(
    id: string,
    dto: UpdateEstadoTurnoDto,
  ): Promise<TurnoResponseDto> {
    const turno = await this.turnoRepository.findOne({
      where: { id },
      relations: ['user', 'clase'],
    });
    if (!turno) throw new NotFoundException('Turno no encontrado');
    turno.estado = dto.estado;
    const actualizado = await this.turnoRepository.save(turno);
    return this.mapTurnoToResponse(actualizado);
  }

  async remove(id: string): Promise<void> {
    const turno = await this.turnoRepository.findOne({ where: { id } });
    if (!turno) throw new NotFoundException('Turno no encontrado');
    await this.turnoRepository.remove(turno);
  }

  async findTurnosProximos(): Promise<TurnoResponseDto[]> {
    const ahora = new Date();
    const enUnaHora = new Date(ahora.getTime() + 60 * 60 * 1000);

    const turnos = await this.turnoRepository.find({
      where: { fecha: Between(ahora, enUnaHora) },
      relations: ['user', 'clase'],
    });
    return turnos.map(this.mapTurnoToResponse);
  }

  // ✅ Nuevo método para buscar turnos en un rango específico
  async findTurnosEnRango(
    fechaInicio: Date,
    fechaFin: Date,
  ): Promise<TurnoResponseDto[]> {
    const turnos = await this.turnoRepository.find({
      where: { fecha: Between(fechaInicio, fechaFin) },
      relations: ['user', 'clase'],
    });
    return turnos.map(this.mapTurnoToResponse);
  }

  // ✅ Nuevo método para buscar TODOS los turnos activos (para recordatorios cada 5 minutos)
  async findTurnosActivos(): Promise<TurnoResponseDto[]> {
    const turnos = await this.turnoRepository.find({
      where: [{ estado: EstadoTurno.PENDIENTE }],
      relations: ['user', 'clase'],
    });
    return turnos.map(this.mapTurnoToResponse);
  }

  // ✅ Método para enviar email de prueba cuando se crea un turno
  private async sendTestEmailOnBooking(
    userEmail: string,
    userName: string,
    claseNombre: string,
  ) {
    console.log('🚀 Enviando email de prueba por nueva reserva de turno...');

    try {
      const frasesPrueba = [
        '¡Hola! Este es un email de prueba desde FitHub 🏋️‍♂️',
        '✨ Sistema de notificaciones funcionando correctamente',
        '🔔 Confirmación de reserva automática desde el backend',
        '💪 ¡Tu plataforma fitness está en funcionamiento!',
        '🚀 Email automático enviado al reservar turno',
      ];

      // Seleccionar frase aleatoria
      const fraseAleatoria =
        frasesPrueba[Math.floor(Math.random() * frasesPrueba.length)];

      await this.mailerService.sendMail({
        to: userEmail,
        subject: `🧪 Test FitHub - Turno Reservado - ${new Date().toLocaleString()}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; background-color: #f0f8ff; border-radius: 8px;">
            <h2 style="color: #333;">🧪 Email de Prueba - FitHub</h2>
            <p style="color: #555; font-size: 16px;">¡Hola ${userName}!</p>
            <p style="color: #555; font-size: 16px;">${fraseAleatoria}</p>
            
            <div style="background-color: #e8f5e8; padding: 15px; border-radius: 5px; margin: 20px 0;">
              <h3 style="color: #2d5a2d; margin: 0 0 10px 0;">✅ Turno Reservado</h3>
              <p style="color: #2d5a2d; margin: 0; font-size: 14px;">
                <strong>Clase:</strong> ${claseNombre}<br>
                <strong>Usuario:</strong> ${userName}<br>
                <strong>Email:</strong> ${userEmail}
              </p>
            </div>

            <p style="color: #777; font-size: 14px;">
              <strong>Hora:</strong> ${new Date().toLocaleString()}<br>
              <strong>Estado:</strong> ✅ Sistema funcionando correctamente
            </p>
            
            <div style="background-color: #fff3cd; padding: 15px; border-radius: 5px; margin-top: 20px;">
              <p style="color: #856404; margin: 0; font-size: 14px;">
                📧 Este email se envía automáticamente cuando reservas un turno para probar el sistema de notificaciones.
              </p>
            </div>
          </div>
        `,
      });

      console.log('✅ Email de prueba enviado exitosamente a:', userEmail);
    } catch (error) {
      console.error('❌ Error enviando email de prueba:', error);
    }
  }
}
