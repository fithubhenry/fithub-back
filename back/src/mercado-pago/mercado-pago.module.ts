import { Module } from '@nestjs/common';
import { PaymentsController } from './mercado-pago.controller';
import { PaymentsService } from './mercado-pago.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [PaymentsController],
  providers: [PaymentsService],
})
export class MercadoPagoModule {}
