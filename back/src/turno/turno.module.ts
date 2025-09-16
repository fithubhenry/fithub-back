import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TurnosService } from './turno.service';
import { TurnosController } from './turno.controller';
import { Turno } from './entities/turno.entity';
import { User } from 'src/user/entities/user.entity';
import { Clase } from 'src/clases/entities/clase.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Turno, User, Clase])],
  controllers: [TurnosController],
  providers: [TurnosService],
})
export class TurnosModule {}
