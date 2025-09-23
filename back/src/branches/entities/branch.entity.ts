// src/branches/entities/branch.entity.ts
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('branches')
export class Branch {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  address: string;

  @Column('decimal', { precision: 10, scale: 6 })
  latitude: number;

  @Column('decimal', { precision: 10, scale: 6 })
  longitude: number;
}
