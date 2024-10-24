import { bot } from "@/bot/config/bot.config";
import Payment, { TBlockchains } from "@/database/models/payment.model";
import Promocode from "@/database/models/promocode.model";
import Settings from "@/database/models/settings.model";
import Subscription from "@/database/models/subscription.model";
import User from "@/database/models/user.model";
import UserSubscription from "@/database/models/userSubscription.model";

const ADMIN_TELEGRAM_ID = process.env.ADMIN_ID;

export interface IPaymentService {
  createPayment(
    userId: number,
    subscriptionId: number,
    blockchains: TBlockchains[],
    promocode: string
  ): Promise<string | boolean>;
  completePayment(paymentId: string): Promise<void>;
  failPayment(paymentId: string): Promise<void>;
}

export default class PaymentService implements IPaymentService {
  public async createPayment(
    userId: number,
    subscriptionId: number,
    blockchains: TBlockchains[],
    promocode: string
  ): Promise<string | boolean> {
    const subscription = await Subscription.findByPk(subscriptionId);
    if (!subscription) {
      throw new Error("Subscription not found");
    }

    const foundPromocode = await Promocode.findOne({
      where: {
        promocode,
      },
    });

    const settings = await Settings.findOne();
    if (!settings) {
      throw new Error("Settings not found");
    }

    if (settings.referralDiscount === undefined)
      throw new Error("Refferal discount not found");

    let finalPrice =
      subscription.price - (subscription.price * subscription.discount) / 100;

    if (subscription.subscriptionType === "regular") {
      finalPrice += (blockchains.length - 1) * 100;
    }

    const url = "https://api.cryptocloud.plus/v2/invoice/create";
    const API_KEY = process.env.API_KEY;
    const SHOP_ID = process.env.SHOP_ID;

    if (!API_KEY || !SHOP_ID) {
      throw new Error(
        "API_KEY or SHOP_ID is not defined in environment variables"
      );
    }

    const headers = {
      Authorization: `Token ${API_KEY}`,
      "Content-Type": "application/json",
    };

    const data = {
      amount: finalPrice,
      shop_id: SHOP_ID,
      currency: "USD",
    };

    const response = await fetch(url, {
      method: "POST",
      headers,
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      console.error("Creation Error:", response.statusText);
      return false;
    }

    const responseData = await response.json();

    if (
      !responseData.result ||
      !responseData.result.uuid ||
      !responseData.result.link
    ) {
      console.error("Invalid response structure:", responseData);
      return false;
    }

    const user = await User.findOne({ where: { userId } });

    if (!user) {
      return false;
    }

    const payment = await Payment.create({
      userId: user.id,
      subscriptionId,
      amount: finalPrice,
      status: "pending",
      blockchains,
      invoiceId: responseData.result.uuid,
      promocodeId: foundPromocode?.id || undefined,
    });

    return { link: responseData.result.link } as any;
  }

  public async completePayment(invoiceId: string): Promise<void> {
    const payment = await Payment.findOne({ where: { invoiceId } });

    if (!payment) {
      console.error("Payment not found");
      return;
    }

    if (payment.status === "completed") return;

    payment.status = "completed";
    await payment.save();

    const subscription = await Subscription.findByPk(payment.subscriptionId);
    console.error("Subscription not found");
    if (!subscription) {
      return;
    }

    console.log(payment.promocodeId);
    if (payment.promocodeId) {
      try {
        const foundPromocode = await Promocode.findOne({
          where: { id: payment.promocodeId },
        });

        if (foundPromocode) {
          foundPromocode.activations += 1;

          const settings = await Settings.findOne();
          if (settings) {
            const newRevenue = Math.round(
              parseFloat(String(foundPromocode.revenue || 0)) +
                parseFloat(String(settings.referralActivationAmount || 0.0))
            );

            foundPromocode.revenue = newRevenue;
          }

          console.log(4);
          await foundPromocode.save();
        } else {
          console.error("Promocode not found");
        }
      } catch (error) {
        console.error("Error updating promocode:", error);
      }
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

    if (ADMIN_TELEGRAM_ID) {
      await bot.telegram.sendMessage(
        ADMIN_TELEGRAM_ID,
        `Купили подписку. ID платежа: ${payment.invoiceId}`
      );
    }
  }

  public async failPayment(invoiceId: string): Promise<void> {
    const payment = await Payment.findOne({ where: { invoiceId } });

    if (!payment) {
      console.error("Payment not found");
      return;
    }

    if (payment.status === "completed") return;

    payment.status = "failed";
    await payment.save();

    if (ADMIN_TELEGRAM_ID) {
      await bot.telegram.sendMessage(
        ADMIN_TELEGRAM_ID,
        `Платеж отменен. ID платежа: ${payment.invoiceId}`
      );
    }
  }
}
