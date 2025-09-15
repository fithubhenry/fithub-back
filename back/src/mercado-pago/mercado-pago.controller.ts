import {
  Controller,
  Post,
  Body,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { PaymentsService } from './mercado-pago.service';

@Controller('mercado-pago')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post('create-preference')
  async createPreference() {
    return this.paymentsService.createPreference();
  }

  // @Post('webhook')
  // @HttpCode(HttpStatus.OK)
  // webhook(@Query('data.id') paymentId: string, @Query('type') type: string) {
  //   if (type === 'payment') {
  //     return this.mercadoPagoService.handleWebhook(paymentId);
  //   }
  //   return { message: 'Event type not handled' };
  // }
}
