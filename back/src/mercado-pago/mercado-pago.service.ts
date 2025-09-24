import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MercadoPagoConfig, Payment, Preference } from 'mercadopago';
import { EEstado } from 'src/common/usersEnum';
import { User } from 'src/user/entities/user.entity';
import { PaymentHistory } from './dto/payment-history.interface';
import { Repository } from 'typeorm';

@Injectable()
export class PaymentsService {
  private client;

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {
    this.client = new MercadoPagoConfig({
      accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN!,
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
          success: 'https://fithub-front.onrender.com/clases',
          failure: 'https://fithub-front.onrender.com/failure',
          pending: 'https://fithub-front.onrender.com/pending',
        },
        auto_return: 'approved',
        notification_url:
          'https://fithub-back-pv0m.onrender.com/mercado-pago/webhook',
      },
    });

    console.log(result);
    return result;
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
          // Obtener el usuario actual para acceder a su historial
          const user = await this.userRepository.findOne({
            where: { id: userId },
          });

          if (user) {
            // Crear el nuevo registro de pago
            const newPayment: PaymentHistory = {
              paymentId: paymentData.id?.toString() || '',
              amount: paymentData.transaction_amount || 0,
              currency: paymentData.currency_id || 'ARS',
              paymentMethod: paymentData.payment_method_id || '',
              dateApproved: new Date(paymentData.date_approved || new Date()),
              status: paymentData.status || '',
              transactionId: paymentData.id?.toString(),
            };

            // Agregar el nuevo pago al historial existente
            const updatedHistorialPagos = [...(user.historialPagos || []), newPayment];

            // Actualizar el usuario con el nuevo estado y historial
            await this.userRepository.update(userId, {
              estado: EEstado.Activo,
              historialPagos: updatedHistorialPagos,
            });

            console.log(`✅ Usuario ${userId} activado y pago registrado en historial`);
          }
        }
      }
    }

    return { received: true };
  }
}
