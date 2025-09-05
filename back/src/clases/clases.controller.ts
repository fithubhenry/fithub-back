import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ClasesService } from './clases.service';
import { Clase } from './entities/clase.entity';
import { CrearClaseDto } from './dto/create-clase.dto';
import { JwtStrategy } from 'src/auth/jwt.strategy';
import { FiltroClasesDto } from './dto/filtros.dto';

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

  @Get('filtros')
  async filterClases(@Query() filtros: FiltroClasesDto) {
    return this.clasesService.busquedaConFiltros(filtros);
  }
}
