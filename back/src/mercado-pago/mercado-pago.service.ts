import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MercadoPagoConfig, Preference, Payment } from 'mercadopago';
import { CreateMercadoPagoDto } from './dto/create-mercado-pago.dto';

@Injectable()
export class MercadoPagoService {
  private readonly client: MercadoPagoConfig;
  constructor(private readonly configService: ConfigService) {
    const accessToken = this.configService.get<string>(
      'MERCADOPAGO_ACCESS_TOKEN',
    );
    if (!accessToken) {
      throw new InternalServerErrorException(
        'Mercado Pago Access Token not configured',
      );
    }
    this.client = new MercadoPagoConfig({
      accessToken,
    });
  }

  async createPreference(servicio: CreateMercadoPagoDto) {
    const preference = new Preference(this.client);

    try {
      const result = await preference.create({
        body: {
          items: servicio.items.map((item) => ({
            id: item.id,
            title: item.title,
            quantity: item.quantity,
            unit_price: item.unit_price,
            currency_id: 'ARS', // O la moneda que corresponda
          })),
          back_urls: {
            success: 'https://fithub-front.onrender.com/success', // URL de tu frontend
            failure: 'https://fithub-front.onrender.com/failure',
            pending: 'https://fithub-front.onrender.com/pending',
          },
          auto_return: 'approved',
          notification_url: `https://fithub-back-pv0m.onrender.com/mercado-pago/webhook`, // ¡Importante!
        },
      });

      return result;
    } catch (error) {
      console.error('Error creating preference:', error);
      throw new InternalServerErrorException(
        'Failed to create payment preference',
      );
    }
  }

  async handleWebhook(paymentId: string) {
    const payment = new Payment(this.client);
    try {
      const paymentInfo = await payment.get({ id: paymentId });
      console.log('Payment Info:', paymentInfo);
      // Aquí va tu lógica de negocio:
      // - Verificar si el pago fue aprobado ('status' === 'approved')
      // - Actualizar el estado de la orden en tu base de datos
      // - Enviar un email de confirmación al usuario, etc.
    } catch (error) {
      console.error('Error handling webhook:', error);
    }
  }
}
