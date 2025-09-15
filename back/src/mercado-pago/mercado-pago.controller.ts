import {
  Controller,
  Post,
  Body,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { MercadoPagoService } from './mercado-pago.service';
import { CreateMercadoPagoDto } from './dto/create-mercado-pago.dto';

@Controller('mercado-pago')
export class MercadoPagoController {
  constructor(private readonly mercadoPagoService: MercadoPagoService) {}

  @Post('create-preference')
  createPreference(@Body() createMercadoPagoDto: CreateMercadoPagoDto) {
    return this.mercadoPagoService.createPreference(createMercadoPagoDto);
  }

  @Post('webhook')
  @HttpCode(HttpStatus.OK)
  webhook(@Query('data.id') paymentId: string, @Query('type') type: string) {
    if (type === 'payment') {
      return this.mercadoPagoService.handleWebhook(paymentId);
    }
    return { message: 'Event type not handled' };
  }
}
