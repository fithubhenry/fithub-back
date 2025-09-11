import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CloudinaryService } from './cloudinary.service';

@Module({
  imports: [ConfigModule],
  providers: [CloudinaryService], // registrar el servicio
  exports: [CloudinaryService], // exportarlo para otros módulos
})
export class CloudinaryModule {}
