// clases/entities/clase.entity.ts
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
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

  @Column({ type: 'enum', enum: EIntensidad, default: EIntensidad.Otros })
  intensidad: EIntensidad;

  @Column()
  instructor: string;

  // Relación: Una Clase tiene muchos Turnos (horarios)
  @OneToMany(() => Turno, (turno) => turno.clase)
  horarios: Turno[];

  @Column()
  duracion: string; // Ej: "01:00"

  @Column('int')
  capacidad: number;

  @Column('int', { default: 0 })
  participantes: number;

  @Column({ type: 'enum', enum: ETipos, default: ETipos.Otros })
  tipo: ETipos;

  @Column({ type: 'enum', enum: EGrupoMuscular, default: EGrupoMuscular.Otros })
  grupo_musculo: EGrupoMuscular;

  @Column({ type: 'enum', enum: ESubMusculo, default: ESubMusculo.Otros })
  sub_musculo: ESubMusculo;

  @Column()
  sede: string;

  @Column({ nullable: true })
  imageUrl: string;
}
