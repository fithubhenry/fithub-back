import { EEstado } from 'src/common/usersEnum';
import { Turno } from 'src/turno/entities/turno.entity';
import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column({ type: 'varchar', length: 20, nullable: false })
  nombre: string;
  @Column({ type: 'varchar', length: 25, nullable: false })
  apellido: string;
  @Column({ type: 'varchar', nullable: true, length: 60 })
  password: string;
  @Column({ type: 'bigint', nullable: true })
  telefono: number;
  @Column({ type: 'date', nullable: true })
  fecha_nacimiento: Date;
  @Column({ type: 'varchar', nullable: false, unique: true })
  email: string;
  @Column({ type: 'varchar', nullable: true, length: 50 })
  direccion: string;
  @Column({ type: 'varchar', nullable: true, length: 50 })
  ciudad: string;
  @Column({ type: 'boolean', default: false })
  esAdmin: boolean;
  @Column({ type: 'enum', enum: EEstado, default: EEstado.Invitado })
  estado: EEstado;
  @OneToMany(() => Turno, (turno) => turno.user, {
    cascade: true,
    orphanedRowAction: 'delete',
  })
  turnos: Turno[];
  @Column({
    type: 'varchar',
    nullable: true,
    default:
      'https://res.cloudinary.com/fithub-dev/image/upload/v1757645238/3541871_ctwh8q.png',
  })
  profileImageUrl: string | null;
  @Column({ type: 'jsonb', default: [] })
  historialPagos: {
    amount: number;
    dateApproved: Date;
    status: string;
  }[];
}
