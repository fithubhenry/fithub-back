import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { ClasesService } from './clases.service';
import { JwtStrategy } from 'src/auth/jwt.strategy';
import { Clase } from './entities/clase.entity';
import { CrearClaseDto } from './dto/create-clase.dto';

@Controller('clases')
@UseGuards(JwtStrategy)
export class ClasesController {
  constructor(private readonly clasesService: ClasesService) {}

  @Get()
  async findAll(): Promise<Clase[]> {
    return this.clasesService.findAll();
  }

  @Post()
  async createClase(@Body() clase: CrearClaseDto) {
    return this.clasesService.newClase(clase);
  }
}
