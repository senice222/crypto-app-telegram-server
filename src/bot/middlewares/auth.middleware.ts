import { logger } from "@/config/app.config";
import Promocode from "@/database/models/promocode.model";
import User from "@/database/models/user.model";
import { getUserCtx } from "@/utils/getUserCtx.util";
import { Context } from "telegraf";

export const generateUniquePromocode = async (
  length: number = 8
): Promise<string> => {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let promocode = "";
  let attempts = 0;
  const maxAttempts = 5;
  do {
    promocode = "";
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      promocode += characters[randomIndex];
    }

    const existingPromocode = await Promocode.findOne({ where: { promocode } });

    if (!existingPromocode) {
      return promocode;
    }

    attempts += 1;
  } while (attempts < maxAttempts);

  throw new Error("Failed to generate a unique promocode. Please try again.");
};

const authMiddleware = async (ctx: Context, next: Next) => {
  try {
    const userCtx = getUserCtx(ctx);
    if (!userCtx) {
      throw new Error("Context was not provided correctly");
    }

    const { userId, username, firstName, lastName } = userCtx;
    const mappedUsername = username ?? null;
    const mappedFirstName = firstName ?? null;
    const mappedLastName = lastName ?? null;

    const [user, created] = await User.findOrCreate({
      where: { userId },
      defaults: {
        userId,
        username: mappedUsername,
        firstName: mappedFirstName,
        lastName: mappedLastName,
      },
    });

    if (created) {
      const uniquePromocode = await generateUniquePromocode();

      await Promocode.create({
        userId: user.id,
        promocode: uniquePromocode,
      });
    } else {
      const updates: Partial<
        Pick<User, "username" | "firstName" | "lastName">
      > = {};

      if (user.username !== mappedUsername) {
        updates.username = mappedUsername;
      }
      if (user.firstName !== mappedFirstName) {
        updates.firstName = mappedFirstName;
      }
      if (user.lastName !== mappedLastName) {
        updates.lastName = mappedLastName;
      }

      if (Object.keys(updates).length > 0) {
        user.set(updates);
        await user.save();
      }
    }

    await next();
  } catch (error) {
    if (error instanceof Error) {
      logger.error(error.message, {
        logToFile: true,
      });
    } else {
      logger.error("Error occured at auth.middleware@36", {
        logToFile: true,
        isThrow: true,
      });
    }
  }
};

export { authMiddleware };
