// clases/entities/clase.entity.ts
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Turno } from 'src/turno/entities/turno.entity'; // Ajusta la ruta

@Entity()
export class Clase {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  nombre: string;

  @Column()
  descripcion: string;

  @Column({
    type: 'enum',
    enum: ['muy_alta', 'alta', 'media', 'bajo'], // Ajusté los valores del enum
  })
  intensidad: string;

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

  @Column({
    type: 'enum',
    enum: ['Yoga', 'Spinning', 'Crossfit', 'Pilates', 'Zumba'],
  })
  tipo: string;

  @Column({
    type: 'enum',
    enum: ['Pierna', 'Brazos', 'Espalda', 'Abdomen', 'Gluteo'], // Ajusté "Pierra" a "Pierna"
    nullable: true, // Puede ser opcional dependiendo del 'tipo'
  })
  grupo_musculo: string;

  @Column({
    type: 'enum',
    enum: ['biceps', 'cuadriceps', 'dorsal', 'abdominal', 'triceps'], // Ajusté "bleeps" a "biceps", "cuadrileeps" a "cuadriceps"
    nullable: true,
  })
  sub_musculo: string;

  @Column()
  sede: string;

  @Column({ nullable: true })
  image: string;
}
