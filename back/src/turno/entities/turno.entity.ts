import { Clase } from '../../clases/entities/clase.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Turno {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'timestamp' }) // Tipo más adecuado para fecha+hora
  date: Date;

  // Relación: Muchos Turnos pertenecen a una Clase
  @ManyToOne(() => Clase, (clase) => clase.horarios, { onDelete: 'CASCADE' })
  clase: Clase;
}
