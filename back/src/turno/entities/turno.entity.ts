import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { User } from 'src/user/entities/user.entity';
import { Clase } from 'src/clases/entities/clase.entity';
import { ApiProperty } from '@nestjs/swagger';

export enum EstadoTurno {
  PENDIENTE = 'PENDIENTE',
  CONFIRMADO = 'CONFIRMADO',
  CANCELADO = 'CANCELADO',
}

@Entity()
export class Turno {
  @ApiProperty({ example: 'a1b2c3d4-e5f6-7890-abcd-1234567890ef' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ example: '2025-09-20' })
  @Column({ type: 'date', nullable: true })
  fecha: Date;

  @Column({
    type: 'enum',
    enum: EstadoTurno,
    default: EstadoTurno.PENDIENTE,
  })
  estado: EstadoTurno;

  @ApiProperty({
    example: 'a1b2c3d4-e5f6-7890-abcd-1234567890ef',
    description: 'ID del usuario',
    type: 'string',
  })
  @ManyToOne(() => User, (user) => user.turnos, {
    onDelete: 'CASCADE',
  })
  user: User;

  @ApiProperty({
    example: 'a1b2c3d4-e5f6-7890-abcd-1234567890ef',
    description: 'ID de la clase',
  })
  @ManyToOne(() => Clase, (clase) => clase.horarios, {
    eager: true,
    onDelete: 'CASCADE',
  })
  clase: Clase;

  @ApiProperty({ example: '10:00:00', description: 'Hora de inicio' })
  @Column({ type: 'time', nullable: true })
  horaInicio: string;

  @ApiProperty({ example: '11:00:00', description: 'Hora de fin' })
  @Column({ type: 'time', nullable: true })
  horaFin: string;

  @ApiProperty({ example: 'Lunes', description: 'Día de la semana' })
  @Column({ type: 'varchar', nullable: true })
  diaSemana: string;

  @ApiProperty({ example: true, description: 'Estado del turno' })
  @Column({ type: 'boolean', default: true })
  activo: boolean;
}
