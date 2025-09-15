import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MercadoPagoConfig, Payment, Preference } from 'mercadopago';
import { EEstado } from 'src/common/usersEnum';
import { User } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class PaymentsService {
  private client;

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {
    this.client = new MercadoPagoConfig({
      accessToken: process.env.MP_ACCESS_TOKEN!,
    });
  }

  async createPreference(userId: string) {
    const preference = new Preference(this.client);

    const result = await preference.create({
      body: {
        items: [
          {
            id: `user-${userId}`,
            title: 'Suscripcion Fithub',
            quantity: 1,
            currency_id: 'ARS',
            unit_price: 100,
          },
        ],
        back_urls: {
          success: 'https://fithub-front.onrender.com/success',
          failure: 'https://fithub-front.onrender.com/failure',
          pending: 'https://fithub-front.onrender.com/pending',
        },
        auto_return: 'approved',
        notification_url: 'http://localhost:3001/payments/webhook',
      },
    });

    return { id: result.id };
  }

  // ✅ Procesar webhook
  async handleWebhook(body: any) {
    if (body.type === 'payment') {
      const payment = new Payment(this.client);
      const paymentData = await payment.get({ id: body.data.id });

      console.log('💰 Pago confirmado:', paymentData);

      if (paymentData.status === 'approved') {
        // Recuperamos el userId del item.id
        const userItemId = paymentData.additional_info?.items?.[0]?.id;
        const userId = userItemId?.replace('user-', '');

        if (userId) {
          await this.userRepository.update(userId, { estado: EEstado.Activo });
          console.log(`✅ Usuario ${userId} activado`);
        }
      }
    }

    return { received: true };
  }
}
