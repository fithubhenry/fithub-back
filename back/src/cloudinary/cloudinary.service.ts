import { Injectable } from '@nestjs/common';
import { v2 as Cloudinary, UploadApiResponse } from 'cloudinary';
import { ConfigService } from '@nestjs/config';
import { Express } from 'express';

@Injectable()
export class CloudinaryService {
  constructor(private configService: ConfigService) {
    Cloudinary.config({
      cloud_name: this.configService.get('CLOUDINARY_CLOUD_NAME'),
      api_key: this.configService.get('CLOUDINARY_API_KEY'),
      api_secret: this.configService.get('CLOUDINARY_API_SECRET'),
      secure: true,
    });
  }

  async uploadImage(file: Express.Multer.File): Promise<UploadApiResponse> {
    if (!file) throw new Error('No se recibió archivo');

    return new Promise((resolve, reject) => {
      Cloudinary.uploader
        .upload_stream({ folder: 'profile_pics' }, (error, result) => {
          if (error) return reject(error);
          if (!result)
            return reject(new Error('No se recibió respuesta de Cloudinary'));
          resolve(result);
        })
        .end(file.buffer);
    });
  }
}
