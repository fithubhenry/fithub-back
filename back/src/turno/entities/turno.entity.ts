import { Clase } from '../../clases/entities/clase.entity';
import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';

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

  @Column()
  diaSemana: string;

  @ManyToMany(() => Clase, (clase) => clase.horarios)
  clases: Clase[];

  @Column({ default: 0 })
  cuposDisponibles: number;

  @Column({ default: true })
  activo: boolean;
}
