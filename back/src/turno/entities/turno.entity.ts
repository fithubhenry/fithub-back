import { Clase } from '../../clases/entities/clase.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Turno {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('date') // Almacena solo la fecha (YYYY-MM-DD)
  date: Date;

  @Column('time') // Almacena solo la hora (HH:MM:SS)
  hora: string;

  @Column()
  diaSemana: string; // Ej: "LUNES", "MARTES"

  @Column({ default: 0 })
  inscriptos: number;

  @Column({ default: true })
  disponible: boolean;

  // Relación: Muchos Turnos pertenecen a una Clase
  @ManyToOne(() => Clase, (clase) => clase.horarios, { onDelete: 'CASCADE' })
  clase: Clase;
}
