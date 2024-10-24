import { Context } from "telegraf";
import PaymentService from "../services/payment.service";
import { Message } from "telegraf/typings/core/types/typegram";

export interface IPaymentController {
  purchaseSubscription(ctx: Context): Promise<void>;
  confirmPayment(ctx: Context): Promise<void>;
  failPayment(ctx: Context): Promise<void>;
}

export default class PaymentController implements IPaymentController {
  private paymentService: PaymentService;

  constructor() {
    this.paymentService = new PaymentService();
  }

  public async purchaseSubscription(ctx: Context) {
    const userId = ctx.from?.id;
    const subscriptionId = parseInt(
      (ctx.message as Message.TextMessage)?.text?.split(" ")[1]
    );
    if (!userId || isNaN(subscriptionId)) {
      await ctx.reply("Please provide a valid subscription ID.");
      return;
    }
    try {
      const payment = await this.paymentService.createPayment(
        userId,
        subscriptionId
      );
      await ctx.reply(
        `Payment initiated. Payment ID: ${payment.id}. Please complete the payment.`
      );
    } catch (error) {
      if (error instanceof Error) {
        await ctx.reply(`Error initiating payment: ${error.message}`);
      } else {
        await ctx.reply(`Error initiating payment: Unknown error`);
      }
    }
  }

  public async confirmPayment(ctx: Context) {
    const paymentId = parseInt(
      (ctx.message as Message.TextMessage)?.text?.split(" ")[1]
    );
    if (isNaN(paymentId)) {
      await ctx.reply("Please provide a valid payment ID.");
      return;
    }
    try {
      await this.paymentService.completePayment(paymentId);
      await ctx.reply(
        `Payment ${paymentId} completed. Subscription activated.`
      );
    } catch (error) {
      if (error instanceof Error) {
        await ctx.reply(`Error completing payment: ${error.message}`);
      } else {
        await ctx.reply(`Error completing payment: Unknown error`);
      }
    }
  }

  public async failPayment(ctx: Context) {
    const paymentId = parseInt(
      (ctx.message as Message.TextMessage)?.text?.split(" ")[1]
    );
    if (isNaN(paymentId)) {
      await ctx.reply("Please provide a valid payment ID.");
      return;
    }
    try {
      await this.paymentService.failPayment(paymentId);
      await ctx.reply(`Payment ${paymentId} marked as failed.`);
    } catch (error) {
      if (error instanceof Error) {
        await ctx.reply(`Error updating payment status: ${error.message}`);
      } else {
        await ctx.reply(`Error updating payment status: Unknown error`);
      }
    }
  }
}
