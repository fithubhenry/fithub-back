import { IsString, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ChatDto {
  @IsString()
  @ApiProperty({
    example: 'Qué clases hay mañana?',
    description: 'Mensaje del usuario',
  })
  message: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({
    example:
      'Horarios: Lunes a Viernes 8-22hs, Sábado 9-14hs. Clases: Yoga 18hs, Spinning 19hs.',
    description: 'Contexto adicional del gimnasio',
  })
  context?: string;
}
