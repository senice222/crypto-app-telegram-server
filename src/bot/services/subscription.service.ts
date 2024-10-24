import Subscription, {
  ICreateSubscription,
} from "@/database/models/subscription.model";
import UserSubscription from "@/database/models/userSubscription.model";
import { bot } from "../config/bot.config";
import User from "@/database/models/user.model";
import Promocode from "@/database/models/promocode.model";
import Settings from "@/database/models/settings.model";

interface IRefStatsReturn {
  readonly activations: number;
  readonly balance: number;
}

export interface ISubscriptionService {
  createSubscription(data: Partial<Subscription>): Promise<Subscription>;
  deleteSubscription(id: number): Promise<void>;
  editSubscription(id: number, data: Partial<Subscription>): Promise<void>;
  getSubscriptions(): Promise<Subscription[]>;
  getSubscriptionStats(subscriptionId: number): Promise<number>;
  resetRevenue(userId: number): Promise<boolean>;
  refStats(userId: number): Promise<IRefStatsReturn>;
  updateSpecialOffer(userId: number): Promise<void>;
}

export default class SubscriptionService implements ISubscriptionService {
  public async createSubscription(
    data: ICreateSubscription
  ): Promise<Subscription> {
    return Subscription.create(data);
  }

  public async deleteSubscription(id: number): Promise<void> {
    await Subscription.destroy({ where: { id } });
  }

  public async editSubscription(
    id: number,
    data: Partial<Subscription>
  ): Promise<void> {
    await Subscription.update(data, { where: { id } });
  }

  public async getSubscriptions(): Promise<Subscription[]> {
    return Subscription.findAll();
  }

  public async getSubscriptionStats(subscriptionId: number): Promise<number> {
    return UserSubscription.count({ where: { subscriptionId } });
  }

  public async sendAll(message: string): Promise<number> {
    const users = await User.findAll({
      where: {
        isBanned: false,
      },
    });

    let sentCount = 0;

    await Promise.all(
      users.map(async (user: User) => {
        try {
          await bot.telegram.sendMessage(user.userId, message);
          sentCount++;
        } catch (error) {
          console.error(
            `Failed to send message to user ${user.userId}:`,
            error
          );
        }
      })
    );

    return sentCount;
  }

  public async resetRevenue(userId: number): Promise<boolean> {
    const promocode = await Promocode.findOne({ where: { userId } });

    if (!promocode) {
      return false;
    }

    promocode.revenue = 0;
    await promocode.save();

    return true;
  }

  public async refStats(userId: number): Promise<IRefStatsReturn> {
    try {
      const promocode = await Promocode.findOne({
        where: {
          userId,
        },
      });

      if (!promocode) throw new Error("Promocode not found");

      const usersCount = await User.count({
        where: {
          presetPromocode: promocode.promocode,
        },
      });

      return {
        activations: usersCount,
        balance: promocode.revenue,
      };
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  public async updateSpecialOffer(hours: number): Promise<void> {
    try {
      const settings = await Settings.findOne();

      if (!settings) throw new Error("Settings table is not set");
      settings.specialOfferTime = hours;
      await settings.save();
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
}
