import { logger } from "@/config/app.config";
import Promocode from "@/database/models/promocode.model";
import Settings from "@/database/models/settings.model";
import User from "@/database/models/user.model";

export interface ReferralStats {
  promocode: string;
  activations: number;
  revenue: number;
  referralActivationAmount: number;
}

export interface ICheckPromocodeReturn {
  promocode: string;
  valid: boolean;
  discount: number;
}

export interface IReferralService {
  getReferralStats(userId: number): Promise<ReferralStats>;
  checkPromocode(promocode: string): Promise<ICheckPromocodeReturn>;
  getPresetPromocode(userId: number): Promise<string | null>;
}

export class ReferralService implements IReferralService {
  public async getReferralStats(userId: number): Promise<ReferralStats> {
    const user = await User.findOne({
      where: { userId },
    });

    if (!user) {
      throw new Error("User not found.");
    }

    const promocodeObj = await Promocode.findOne({
      where: {
        userId: user.id,
      },
    });

    if (!promocodeObj?.promocode) {
      throw new Error("User does not have a promocode.");
    }

    const promocodeActivations = await User.count({
      where: {
        presetPromocode: promocodeObj.promocode,
      },
    });

    const settigns = await Settings.findOne();

    const stats: ReferralStats = {
      promocode: promocodeObj.promocode,
      activations: promocodeActivations,
      revenue: parseFloat(promocodeObj.revenue.toString()),
      referralActivationAmount: settigns?.referralActivationAmount || 0,
    };

    return stats;
  }

  public async checkPromocode(
    promocode: string
  ): Promise<ICheckPromocodeReturn> {
    const isPromocode = await Promocode.findOne({
      where: {
        promocode,
      },
    });

    if (!isPromocode)
      return {
        promocode,
        valid: false,
        discount: 0,
      };

    const settings = await Settings.findOne();

    const promocodeData: ICheckPromocodeReturn = {
      promocode: isPromocode.promocode,
      valid: true,
      discount: settings?.referralDiscount || 0,
    };

    return promocodeData;
  }

  public async getPresetPromocode(userId: number): Promise<string | null> {
    try {
      const user = await User.findOne({ where: { userId } });
      return user?.presetPromocode || null;
    } catch (error) {
      if (error instanceof Error) {
        logger.error(error.message, { logToFile: true });
      } else {
        logger.error(String(error), { logToFile: true });
      }

      return null;
    }
  }
}
