import {
  Controller,
  Get,
  Body,
  Patch,
  Param,
  Delete,
  ParseUUIDPipe,
  HttpCode,
  HttpStatus,
  UseGuards,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/updateUser.dto';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { UserResponseDto } from 'src/helpers/userResponse.dto';
import { Roles } from 'src/decorators/roles.decorator';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { ERoles } from 'src/common/rolesEnum';
import { FileInterceptor } from '@nestjs/platform-express';

@ApiTags('users')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiBearerAuth()
  @Get()
  @Roles(ERoles.Admin)
  @UseGuards(AuthGuard, RolesGuard)
  @ApiOperation({ summary: 'Obtener todos los usuarios' })
  @ApiResponse({
    status: 200,
    description: 'Lista de usuarios obtenida correctamente',
    type: UserResponseDto,
    isArray: true,
  })
  async findAll() {
    return this.userService.findAll();
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Obtener un usuario por id' })
  @ApiParam({ name: 'id', type: String, required: true })
  @ApiResponse({
    status: 200,
    description: 'Usuario encontrado correctamente',
    type: UserResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Usuario no encontrado' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.userService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Actualizar un usuario' })
  @ApiParam({ name: 'id', description: 'UUID del usuario' })
  @ApiBody({ type: UpdateUserDto })
  @ApiResponse({
    status: 200,
    description: 'Usuario actualizado correctamente',
    type: UserResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Datos incorrectos' })
  @ApiResponse({ status: 404, description: 'Usuario no encontrado' })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateUser: UpdateUserDto,
  ) {
    return this.userService.update(id, updateUser);
  }

  @Patch('profile-image/:id')
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Actualizar la imagen de perfil de un usuario' })
  @ApiParam({ name: 'id', description: 'UUID del usuario', type: String })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
      required: ['file'],
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Imagen de perfil actualizada correctamente',
    type: UserResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Archivo inválido o datos incorrectos',
  })
  @UseInterceptors(FileInterceptor('file'))
  async updateProfileImage(
    @Param('id', ParseUUIDPipe) id: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.userService.updateProfileImage(id, file);
  }

  @ApiBearerAuth()
  @Delete(':id')
  @Roles(ERoles.Admin)
  @UseGuards(AuthGuard, RolesGuard)
  @ApiOperation({ summary: 'Eliminar un usuario' })
  @ApiParam({ name: 'id', description: 'UUID del usuario' })
  @ApiResponse({ status: 204, description: 'Usuario eliminado correctamente' })
  @ApiResponse({ status: 404, description: 'Usuario no encontrado' })
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.userService.remove(id);
  }

  @ApiBearerAuth()
  @Get('admin/new/:id')
  @Roles(ERoles.Admin)
  @UseGuards(AuthGuard, RolesGuard)
  @ApiOperation({ summary: 'Agregar un usuario como administrador' })
  @ApiParam({ name: 'id', type: String, required: true })
  @ApiResponse({
    status: 200,
    description: 'El usuario ahora es administrador',
    type: UserResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Usuario no encontrado' })
  async createAdmin(@Param('id', ParseUUIDPipe) id: string) {
    return this.userService.addAdmin(id);
  }

  @ApiBearerAuth()
  @Get('admin/delete/:id')
  @Roles(ERoles.Admin)
  @UseGuards(AuthGuard, RolesGuard)
  @ApiOperation({ summary: 'Quitar privilegios de administrador' })
  @ApiParam({ name: 'id', type: String, required: true })
  @ApiResponse({
    status: 200,
    description: 'El usuario perdio los privilegios de administrador',
    type: UserResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Usuario no encontrado' })
  async deleteAdmin(@Param('id', ParseUUIDPipe) id: string) {
    return this.userService.deleteAdmin(id);
  }

  @Get(':id/turnos')
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Obtener turnos de un usuario específico' })
  @ApiParam({ name: 'id', type: String, required: true })
  @ApiResponse({
    status: 200,
    description: 'Turnos del usuario obtenidos correctamente',
  })
  @ApiResponse({ status: 404, description: 'Usuario no encontrado' })
  async getUserTurnos(@Param('id', ParseUUIDPipe) id: string) {
    return this.userService.getUserTurnos(id);
  }
}
