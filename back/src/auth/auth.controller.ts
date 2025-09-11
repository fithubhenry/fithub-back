import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  Get,
  UseGuards,
  Req,
  Res,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../user/dto/createUser.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { LoginUserDto } from '../user/dto/loginUser.dto';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('auth') // 👈 Agrupa los endpoints bajo 'auth' en Swagger
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleAuth(@Req() req) {
    // Redirige a Google para el proceso de autenticación.
    // Este método no se ejecuta realmente porque Passport se encarga de la redirección.
  }

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleAuthRedirect(@Req() req, @Res() res) {
    // Cuando Google redirige al usuario de vuelta, el objeto 'req.user'
    // contendrá la información del usuario obtenida en GoogleStrategy.validate.

    const { email, firstName, lastName } = req.user;

    // Aquí, puedes buscar el usuario en tu base de datos o crearlo si no existe.
    // Luego, generas un JWT para tu aplicación.
    const jwtToken = await this.authService.signInWithGoogle({
      email,
      firstName,
      lastName,
    });

    // Redirige al frontend con el token o un mensaje de éxito.
    // Puedes pasar el token como un parámetro de consulta, en el fragmento (#) o a través de cookies.
    // Para simplificar, lo pasaremos como parámetro de consulta.
    // return res.redirect(
    // `http://localhost:3000/login/success?token=${jwtToken}`,
    // );
    // O puedes devolverlo directamente si tu fronstend hace una petición AJAX a este endpoint.
    // return { message: 'User authenticated successfully', token: jwtToken };
    // Lo pasaremos como un parámetro de consulta (query param).
    // Asegúrate de que la URL del frontend sea la correcta.
    return res.redirect(
      `https://fithub-front.onrender.com/auth/callback?token=${jwtToken}`,
    );
  }

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Registrar un nuevo usuario' })
  @ApiResponse({ status: 201, description: 'Usuario registrado exitosamente' })
  @ApiResponse({
    status: 400,
    description: 'Datos inválidos o email ya existe',
  })
  @ApiBody({ type: CreateUserDto })
  async register(@Body() createUserDto: CreateUserDto) {
    return this.authService.register(createUserDto);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Iniciar sesión' })
  @ApiResponse({ status: 200, description: 'Login exitoso, retorna JWT token' })
  @ApiResponse({ status: 401, description: 'Credenciales inválidas' })
  @ApiBody({
    type: LoginUserDto,
    examples: {
      example: {
        summary: 'Ejemplo de login',
        value: {
          email: 'usuario@ejemplo.com',
          password: 'Test123!',
        },
      },
    },
  })
  async login(@Body() loginUserDto: LoginUserDto) {
    return this.authService.login(loginUserDto.email, loginUserDto.password);
  }
}
