import { Module } from '@nestjs/common';
import { ClasesService } from './clases.service';
import { ClasesController } from './clases.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Clase } from './entities/clase.entity';
import { Turno } from 'src/turno/entities/turno.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Clase, Turno])],
  controllers: [ClasesController],
  providers: [ClasesService],
})
export class ClasesModule {}
