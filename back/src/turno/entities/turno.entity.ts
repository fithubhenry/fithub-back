import { User } from 'src/user/entities/user.entity';
import { Clase } from '../../clases/entities/clase.entity';
import {
  Column,
  Entity,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Turno {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('date')
  fecha: Date;

  @Column('time')
  horaInicio: string;

  @Column('time')
  horaFin: string;

  @Column({ nullable: false })
  diaSemana: string;

  @ManyToMany(() => Clase, (clase) => clase.horarios)
  clases: Clase[];

  @Column({ type: 'int', default: '0' })
  inscriptos: number;

  @Column({ default: true })
  activo: boolean;
  @ManyToOne(() => User, (user) => user.turnos)
  user: User[];
}
