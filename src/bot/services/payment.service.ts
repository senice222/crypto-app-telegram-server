import Payment, { TBlockchains } from "@/database/models/payment.model";
import Subscription from "@/database/models/subscription.model";
import UserSubscription from "@/database/models/userSubscription.model";

export interface IPaymentService {
  createPayment(
    userId: number,
    subscriptionId: number,
    blockchains: TBlockchains[]
  ): Promise<Payment>;
  completePayment(paymentId: number): Promise<void>;
  failPayment(paymentId: number): Promise<void>;
}

export default class PaymentService implements IPaymentService {
  public async createPayment(
    userId: number,
    subscriptionId: number,
    blockchains: TBlockchains[]
  ): Promise<Payment> {
    const subscription = await Subscription.findByPk(subscriptionId);
    if (!subscription) {
      throw new Error("Subscription not found");
    }
    const payment = await Payment.create({
      userId,
      subscriptionId,
      amount: subscription.priceWithDiscount,
      status: "pending",
      blockchains,
    });
    return payment;
  }

  public async completePayment(paymentId: number): Promise<void> {
    const payment = await Payment.findByPk(paymentId);
    if (!payment) {
      throw new Error("Payment not found");
    }

    payment.status = "completed";
    await payment.save();

    const subscription = await Subscription.findByPk(payment.subscriptionId);
    if (!subscription) {
      throw new Error("Subscription not found");
    }

    let expiresAt: Date | null = null;
    if (subscription.paymentType === "quarter") {
      expiresAt = new Date();
      expiresAt.setMonth(expiresAt.getMonth() + 3);
    } else if (subscription.paymentType === "lifetime") {
      expiresAt = null;
    }

    await UserSubscription.create({
      userId: payment.userId,
      subscriptionId: payment.subscriptionId,
      expiresAt,
      blockchains: payment.blockchains,
    });
  }

  public async failPayment(paymentId: number): Promise<void> {
    const payment = await Payment.findByPk(paymentId);
    if (!payment) {
      throw new Error("Payment not found");
    }
    payment.status = "failed";
    await payment.save();
  }
}
