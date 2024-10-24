import { Request, Response } from "express";
import {
  ISubscriptionService,
  SubscriptionService,
} from "../services/subscriptions.service";
import PaymentService from "../services/payment.service";

const paymentService = new PaymentService();

export class SubscriptionController {
  private subscriptionService: ISubscriptionService;

  constructor() {
    this.subscriptionService = new SubscriptionService();
  }

  public getAllSubscriptions = async (req: Request, res: Response) => {
    try {
      const subscriptions =
        await this.subscriptionService.getAllSubscriptions();
      res.json(subscriptions);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  };

  public getUserSubscriptions = async (req: Request, res: Response) => {
    try {
      const { userId } = req.params;

      if (!userId) {
        res.status(401).json({ message: "Unauthorized" });
        return;
      }

      const subscriptions = await this.subscriptionService.getUserSubscriptions(
        Number(userId)
      );
      res.json(subscriptions);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  };
  public postbackSuccess = async (req: Request, res: Response) => {
    try {
      const {
        status,
        invoice_info,
        invoice_id,
        amount_crypto,
        currency,
        order_id,
        token,
      } = req.body;

      if (status === "success" && invoice_id) {
        paymentService.completePayment(`INV-${invoice_id}`);
      } else {
        paymentService.failPayment(`INV-${invoice_id}`);
      }
    } catch (error: any) {
      console.log(error);
    }
  };
}
