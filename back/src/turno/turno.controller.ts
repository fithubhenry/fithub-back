import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  ParseUUIDPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { TurnosService } from './turno.service';
import { CreateTurnoDto } from './dto/createTurno.dto';
import { UpdateTurnoDto } from './dto/updateTurno.dto';
import { UpdateEstadoTurnoDto } from './dto/updateEstado.dto';
import { Turno } from './entities/turno.entity';

@ApiTags('turnos')
@Controller('turnos')
export class TurnosController {
  constructor(private readonly turnosService: TurnosService) {}

  @Post()
  @ApiOperation({ summary: 'Crear un nuevo turno' })
  @ApiResponse({ status: 201, type: Turno })
  create(@Body() dto: CreateTurnoDto) {
    return this.turnosService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todos los turnos' })
  @ApiResponse({ status: 200, type: [Turno] })
  findAll() {
    return this.turnosService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un turno por ID' })
  @ApiResponse({ status: 200, type: Turno })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.turnosService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar turno' })
  update(@Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdateTurnoDto) {
    return this.turnosService.update(id, dto);
  }

  @Patch(':id/estado')
  @ApiOperation({ summary: 'Actualizar estado del turno' })
  updateEstado(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateEstadoTurnoDto,
  ) {
    return this.turnosService.updateEstado(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar turno' })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.turnosService.remove(id);
  }
}
