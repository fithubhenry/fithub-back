import { EEstado } from 'src/common/usersEnum';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column({ type: 'varchar', length: 20, nullable: false })
  apellido_nombre: string;
  @Column({ type: 'varchar', nullable: false, length: 60 })
  password: string;
  @Column({ type: 'bigint', nullable: false })
  telefono: number;
  @Column({ type: 'date', nullable: false })
  fecha_nacimiento: Date;
  @Column({ type: 'varchar', nullable: false, unique: true })
  email: string;
  @Column({ type: 'varchar', nullable: false, length: 50 })
  direccion: string;
  @Column({ type: 'varchar', nullable: false, length: 50 })
  ciudad: string;
  @Column({ type: 'boolean', default: false })
  esAdmin: boolean;
  @Column({ type: 'enum', enum: EEstado, default: EEstado.Invitado })
  estado: EEstado;
}
