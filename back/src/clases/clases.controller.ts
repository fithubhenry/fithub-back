import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ClasesService } from './clases.service';
import { CrearClaseDto } from './dto/createClase.dto';
import { FiltroClasesDto } from './dto/filtros.dto';
import {
  ApiBody,
  ApiOperation,
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
import { Roles } from 'src/decorators/roles.decorator';
import { ERoles } from 'src/common/rolesEnum';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Clase } from './entities/clase.entity';

@ApiTags('Clases')
@Controller('clases')
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
  @Roles(ERoles.Admin)
  @UseGuards(AuthGuard, RolesGuard)
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
  @Roles(ERoles.Admin)
  @UseGuards(AuthGuard, RolesGuard)
  async cargaSeeder() {
    return this.clasesService.cargaSeeder();
  }
  @Get('/:id')
  @HttpCode(200)
  @ApiOperation({ summary: 'Obtener una clase por ID' })
  @ApiResponse({
    status: 200,
    description: 'Clase obtenida exitosamente',
    type: ClaseResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Clase no encontrada' })
  async findOne(@Param('id', ParseUUIDPipe) id: string): Promise<Clase> {
    return this.clasesService.findById(id);
  }
  @Delete('/:id')
  @HttpCode(200)
  @ApiOperation({ summary: 'Eliminar una clase por ID' })
  @ApiResponse({
    status: 200,
    description: 'Clase eliminada exitosamente',
    type: ClaseResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Clase no encontrada' })
  async eliminarClase(@Param('id', ParseUUIDPipe) id: string) {}
}
