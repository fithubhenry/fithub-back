import { Module } from '@nestjs/common';
import { PaymentsController } from './mercado-pago.controller';
import { PaymentsService } from './mercado-pago.service';

@Module({
  controllers: [PaymentsController],
  providers: [PaymentsService],
})
export class MercadoPagoModule {}
