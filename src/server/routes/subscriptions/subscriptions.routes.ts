import PaymentController from "@/server/controllers/payment.controller";
import { SubscriptionController } from "@/server/controllers/subscriptions.controller";
import { Router } from "express";

const subscriptionController = new SubscriptionController();
const paymentController = new PaymentController();

export const subscriptionRouter = Router();

subscriptionRouter.get("/", subscriptionController.getAllSubscriptions);
subscriptionRouter.get("/:userId", subscriptionController.getUserSubscriptions);
subscriptionRouter.post("/purchase", paymentController.purchaseSubscription);
subscriptionRouter.post(
  "/postback-success",
  subscriptionController.postbackSuccess
);
subscriptionRouter.post(
  "/postback-fail",
  subscriptionController.postbackSuccess
);
