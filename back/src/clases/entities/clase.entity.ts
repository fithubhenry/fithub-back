import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Turno } from 'src/turno/entities/turno.entity'; // Ajusta la ruta
import {
  EGrupoMuscular,
  EIntensidad,
  ESubMusculo,
  ETipos,
} from 'src/common/clasesEnums';

@Entity()
export class Clase {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  nombre: string;

  @Column()
  descripcion: string;

  @Column({ type: 'enum', enum: EIntensidad })
  intensidad: EIntensidad;

  @Column()
  instructor: string;

  @ManyToMany(() => Turno, (turno) => turno.clase, { cascade: true })
  @JoinTable()
  horarios: Turno[];

  @Column()
  duracion: string;

  @Column()
  capacidad: number;

  @Column({ default: 0 })
  participantes: number;

  @Column({ type: 'enum', enum: ETipos })
  tipo: ETipos;

  @Column({ type: 'json', default: [EGrupoMuscular.Otros] })
  grupo_musculo: EGrupoMuscular[];

  @Column({ type: 'json', default: [ESubMusculo.Otros] })
  sub_musculo: ESubMusculo[];

  @Column()
  sede: string;

  @Column({
    default:
      'https://res.cloudinary.com/dugup6n8j/image/upload/v1758154206/1200x630wa_cgcjme.png',
    type: 'varchar',
    nullable: true,
  })
  imageUrl: string;

  // Fechas automáticas de creación y actualización
  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;

  @OneToMany(() => Turno, (turno) => turno.clase)
  turnos: Turno[];

  @Column({ default: true, nullable: false })
  estado: boolean;
}
