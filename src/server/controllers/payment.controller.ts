import { Context } from "telegraf";
import { Message } from "telegraf/typings/core/types/typegram";
import PaymentService from "../services/payment.service";
import { Request, Response } from "express";

export interface IPaymentController {
  purchaseSubscription(req: Request, res: Response): Promise<void>;
}

export default class PaymentController implements IPaymentController {
  private paymentService: PaymentService;

  constructor() {
    this.paymentService = new PaymentService();
    this.purchaseSubscription = this.purchaseSubscription.bind(this);
  }

  public async purchaseSubscription(req: Request, res: Response) {
    const { userId, subscriptionId, blockchains, promocode } = req.body;

    if (!userId || isNaN(subscriptionId)) {
      res.status(400).json("Please provide a valid subscription ID.");
      return;
    }

    try {
      const payment = await this.paymentService.createPayment(
        userId,
        subscriptionId,
        blockchains,
        promocode
      );

      res.status(200).json(payment);
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json(`Error initiating payment: ${error.message}`);
      } else {
        res.status(400).json(`Error initiating payment: Unknown error`);
      }
    }
  }
}
