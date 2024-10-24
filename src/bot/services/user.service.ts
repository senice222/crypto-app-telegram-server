import { logger } from "@/config/app.config";
import User from "@/database/models/user.model";
import UserSubscription from "@/database/models/userSubscription.model";
import { Op, Sequelize } from "sequelize";

export interface IUserService {
  getTotalUsers(): Promise<number>;
  getUsersInLast24Hours(): Promise<number>;
  getUsersInLastWeek(): Promise<number>;
  getUsersInLastMonth(): Promise<number>;
  getUsersWithSubscriptions(): Promise<number>;
  getUsersWithoutSubscriptions(): Promise<number>;
  banUser(userId: number): Promise<void>;
  unbanUser(userId: number): Promise<void>;
  isUserBanned(userId: number): Promise<boolean>;
  isAdmin(userId: number): Promise<boolean>;
  getUserById(userId: number): Promise<User | null>;
  setPresetPromocode(userId: number, promocode: string): Promise<string | null>;
}

export default class UserService implements IUserService {
  async getTotalUsers(): Promise<number> {
    try {
      return User.count();
    } catch (error) {
      if (error instanceof Error) {
        logger.error(error.message, { logToFile: true });
      } else {
        logger.error(String(error), { logToFile: true });
      }

      return 0;
    }
  }

  async getUsersInLast24Hours(): Promise<number> {
    try {
      const since = new Date(Date.now() - 24 * 60 * 60 * 1000);
      return User.count({
        where: {
          createdAt: {
            [Op.gte]: since,
          },
        },
      });
    } catch (error) {
      if (error instanceof Error) {
        logger.error(error.message, { logToFile: true });
      } else {
        logger.error(String(error), { logToFile: true });
      }

      return 0;
    }
  }

  async getUsersInLastWeek(): Promise<number> {
    try {
      const since = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
      return User.count({
        where: {
          createdAt: {
            [Op.gte]: since,
          },
        },
      });
    } catch (error) {
      if (error instanceof Error) {
        logger.error(error.message, { logToFile: true });
      } else {
        logger.error(String(error), { logToFile: true });
      }

      return 0;
    }
  }

  async getUsersInLastMonth(): Promise<number> {
    try {
      const since = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
      return User.count({
        where: {
          createdAt: {
            [Op.gte]: since,
          },
        },
      });
    } catch (error) {
      if (error instanceof Error) {
        logger.error(error.message, { logToFile: true });
      } else {
        logger.error(String(error), { logToFile: true });
      }

      return 0;
    }
  }

  async getUsersWithSubscriptions(): Promise<number> {
    try {
      const result = await UserSubscription.findAll({
        attributes: [
          [Sequelize.fn("DISTINCT", Sequelize.col("userId")), "userId"],
        ],
      });
      return result.length;
    } catch (error) {
      if (error instanceof Error) {
        logger.error(error.message, { logToFile: true });
      } else {
        logger.error(String(error), { logToFile: true });
      }

      return 0;
    }
  }

  async getUsersWithoutSubscriptions(): Promise<number> {
    try {
      const totalUsers = await this.getTotalUsers();
      const usersWithSubs = await this.getUsersWithSubscriptions();
      return totalUsers - usersWithSubs;
    } catch (error) {
      if (error instanceof Error) {
        logger.error(error.message, { logToFile: true });
      } else {
        logger.error(String(error), { logToFile: true });
      }

      return 0;
    }
  }

  async banUser(id: number): Promise<void> {
    try {
      await User.update({ isBanned: true }, { where: { id } });
    } catch (error) {
      if (error instanceof Error) {
        logger.error(error.message, { logToFile: true });
      } else {
        logger.error(String(error), { logToFile: true });
      }
    }
  }

  async unbanUser(id: number): Promise<void> {
    try {
      await User.update({ isBanned: false }, { where: { id } });
    } catch (error) {
      if (error instanceof Error) {
        logger.error(error.message, { logToFile: true });
      } else {
        logger.error(String(error), { logToFile: true });
      }
    }
  }

  async isUserBanned(userId: number): Promise<boolean> {
    try {
      const user = await User.findOne({ where: { userId } });
      return user?.isBanned || false;
    } catch (error) {
      if (error instanceof Error) {
        logger.error(error.message, { logToFile: true });
      } else {
        logger.error(String(error), { logToFile: true });
      }

      return false;
    }
  }

  async isAdmin(userId: number): Promise<boolean> {
    try {
      const user = await User.findOne({ where: { userId } });
      return user?.isAdmin || false;
    } catch (error) {
      if (error instanceof Error) {
        logger.error(error.message, { logToFile: true });
      } else {
        logger.error(String(error), { logToFile: true });
      }

      return false;
    }
  }

  async getUserById(userId: number): Promise<User | null> {
    try {
      const user = await User.findOne({ where: { userId } });
      return user;
    } catch (error) {
      if (error instanceof Error) {
        logger.error(error.message, { logToFile: true });
      } else {
        logger.error(String(error), { logToFile: true });
      }

      return null;
    }
  }

  async setPresetPromocode(
    userId: number,
    presetPromocode: string
  ): Promise<string | null> {
    try {
      const user = await User.findOne({ where: { userId } });
      if (!user) throw new Error("User not found");

      user.presetPromocode = presetPromocode;
      await user.save();

      return presetPromocode;
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
