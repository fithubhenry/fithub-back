import { Module } from '@nestjs/common';
import { MailerService } from './mail.service';

@Module({
  providers: [MailerService],
  exports: [MailerService], // 👈 exportamos para usarlo en otros módulos
})
export class MailerModule {}
