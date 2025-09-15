// payments.service.ts
import { Injectable } from '@nestjs/common';
import { MercadoPagoConfig, Preference } from 'mercadopago';

@Injectable()
export class PaymentsService {
  private client;

  constructor() {
    this.client = new MercadoPagoConfig({
      accessToken: process.env.MP_ACCESS_TOKEN!,
    });
  }

  async createPreference() {
    const preference = new Preference(this.client);

    const result = await preference.create({
      body: {
        items: [
          {
            id: 'fithubPremium',
            title: 'Producto de prueba',
            quantity: 1,
            currency_id: 'ARS',
            unit_price: 1000,
          },
        ],
        back_urls: {
          success: 'https://fithub-front.onrender.com/success',
          failure: 'https://fithub-front.onrender.com/failure',
          pending: 'https://fithub-front.onrender.com/pending',
        },
        auto_return: 'approved',
      },
    });

    return { id: result.id };
  }
}
