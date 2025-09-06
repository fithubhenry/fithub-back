import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Query,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ClasesService } from './clases.service';
import { Clase } from './entities/clase.entity';
import { CrearClaseDto } from './dto/createClase.dto';
import { JwtStrategy } from 'src/auth/jwt.strategy';
import { FiltroClasesDto } from './dto/filtros.dto';
import {
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ClaseResponseDto } from 'src/helpers/claseResponse.dto';
import {
  EGrupoMuscular,
  EIntensidad,
  ESubMusculo,
  ETipos,
} from 'src/common/clasesEnums';

@ApiTags('Clases')
@Controller('clases')
@UseGuards(JwtStrategy)
export class ClasesController {
  constructor(private readonly clasesService: ClasesService) {}

  @Get()
  @HttpCode(200)
  @ApiOperation({ summary: 'Obtener todas las clases' })
  @ApiResponse({
    status: 200,
    description: 'Clases obtenidas exitosamente',
    type: ClaseResponseDto,
    isArray: true,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async findAll(): Promise<ClaseResponseDto[]> {
    return this.clasesService.findAll();
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Crear una clase' })
  @ApiResponse({ status: 201, description: 'Clase creada exitosamente' })
  @ApiResponse({
    status: 400,
    description: 'Datos inválidos o clase ya existente',
  })
  @ApiBody({ type: CrearClaseDto })
  async createClase(@Body() clase: CrearClaseDto) {
    return this.clasesService.newClase(clase);
  }

  @Get('filtros')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Filtrar clases',
    description: 'Clases filtradas exitosamente',
  })
  @ApiResponse({
    status: 200,
    description: 'Clases filtradas exitosamente',
    type: ClaseResponseDto,
    isArray: true,
  })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  @ApiQuery({ name: 'intensidad', enum: EIntensidad, required: false })
  @ApiQuery({
    name: 'grupo_musculo',
    enum: EGrupoMuscular,
    required: false,
    isArray: true,
  })
  @ApiQuery({
    name: 'sub_musculo',
    enum: ESubMusculo,
    required: false,
    isArray: true,
  })
  @ApiQuery({ name: 'tipo', enum: ETipos, required: false })
  async filterClases(@Query() filtros: FiltroClasesDto) {
    return this.clasesService.busquedaConFiltros(filtros);
  }

  @Get('seeder')
  async cargaSeeder() {
    return this.clasesService.cargaSeeder();
  }
}
