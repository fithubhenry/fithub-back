import { Controller, Get, UseGuards } from '@nestjs/common';
import { ClasesService } from './clases.service';
import { JwtStrategy } from 'src/auth/jwt.strategy';
import { Clase } from './entities/clase.entity';

@Controller('clases')
@UseGuards(JwtStrategy)
export class ClasesController {
  constructor(private readonly clasesService: ClasesService) {}

  @Get()
  async findAll(): Promise<Clase[]> {
    return this.clasesService.findAll();
  }
}
