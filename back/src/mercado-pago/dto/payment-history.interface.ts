export interface PaymentHistory {
  paymentId: string;
  amount: number;
  currency: string;
  paymentMethod: string;
  dateApproved: Date;
  status: string;
  transactionId?: string;
}