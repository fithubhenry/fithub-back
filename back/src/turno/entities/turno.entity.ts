import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { User } from 'src/user/entities/user.entity';
import { Clase } from 'src/clases/entities/clase.entity';

export enum EstadoTurno {
  PENDIENTE = 'PENDIENTE',
  CONFIRMADO = 'CONFIRMADO',
  CANCELADO = 'CANCELADO',
}

@Entity()
export class Turno {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'date' })
  fecha: Date;

  @Column({ type: 'time' })
  hora: string;

  @Column({
    type: 'enum',
    enum: EstadoTurno,
    default: EstadoTurno.PENDIENTE,
  })
  estado: EstadoTurno;

  @ManyToOne(() => User, (user) => user.turnos, { eager: true })
  user: User;

  @ManyToOne(() => Clase, (clase) => clase.turnos, { onDelete: 'CASCADE' })
  clase: Clase;

  @Column()
  horaInicio: string;

  @Column()
  horaFin: string;

  @Column()
  diaSemana: string;

  @Column()
  activo: boolean;
}
