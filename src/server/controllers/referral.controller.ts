import { Request, Response } from "express";
import { IReferralService } from "../services/referral.service";

export interface IReferralController {
  getReferralStats(req: Request, res: Response): Promise<void>;
  checkPromocode(req: Request, res: Response): Promise<void>;
  getPresetPromocode(req: Request, res: Response): Promise<void>;
}

export class ReferralController implements IReferralController {
  private referralService: IReferralService;

  constructor(referralService: IReferralService) {
    this.referralService = referralService;
    this.getReferralStats = this.getReferralStats.bind(this);
    this.checkPromocode = this.checkPromocode.bind(this);
    this.getPresetPromocode = this.getPresetPromocode.bind(this);
  }

  public async getReferralStats(req: Request, res: Response): Promise<void> {
    try {
      const { userId } = req.params;

      const stats = await this.referralService.getReferralStats(Number(userId));

      res.status(200).json({
        success: true,
        data: stats,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "An unexpected error occurred.",
      });
    }
  }

  public async checkPromocode(req: Request, res: Response): Promise<void> {
    try {
      const { promocode } = req.params;

      const promocodeData = await this.referralService.checkPromocode(
        promocode
      );

      res.status(200).json({
        success: true,
        data: promocodeData,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "An unexpected error occurred.",
      });
    }
  }

  public async getPresetPromocode(req: Request, res: Response): Promise<void> {
    const { userId } = req.params;

    try {
      const numUserId = Number(userId);
      if (!userId) throw new Error("UserId was not provided");

      const presetPromocode = await this.referralService.getPresetPromocode(
        numUserId
      );

      res.status(200).json({
        success: true,
        data: { presetPromocode },
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "An unexpected error occurred.",
      });
    }
  }
}
