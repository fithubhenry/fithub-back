// clases/entities/clase.entity.ts
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
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
}
