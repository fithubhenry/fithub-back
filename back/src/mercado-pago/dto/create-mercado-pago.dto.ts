export class CreateMercadoPagoDto {
  items: [
    {
      id: string;
      title: string;
      quantity: number;
      unit_price: number;
    },
  ];
}
