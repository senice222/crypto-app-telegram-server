import { ReferralController } from "@/server/controllers/referral.controller";
import {
  IReferralService,
  ReferralService,
} from "@/server/services/referral.service";
import { Router } from "express";

export const referralRouter = Router();

const referralService: IReferralService = new ReferralService();
const referralController = new ReferralController(referralService);

referralRouter.get("/stats/:userId", referralController.getReferralStats);
referralRouter.get(
  "/preset-promocode/:userId",
  referralController.getPresetPromocode
);
referralRouter.get(
  "/check-promocode/:promocode",
  referralController.checkPromocode
);
