import { logger } from "@/config/app.config";
import { Context } from "telegraf";

interface IUserCtx {
  userId: number;
  username: string | undefined;
  firstName: string | undefined;
  lastName: string | undefined;
}

export const getUserCtx = (ctx: Context): IUserCtx | undefined => {
  try {
    if (!ctx || !ctx?.from?.id) throw new Error("Context was not provided");

    const ctxFrom = ctx.from;
    const userId = ctxFrom.id;
    const username = ctxFrom?.username;
    const firstName = ctxFrom?.first_name;
    const lastName = ctxFrom?.last_name;

    return {
      userId,
      username,
      firstName,
      lastName,
    };
  } catch (error) {
    if (error instanceof Error) {
      logger.error(error.message, {
        logToFile: true,
      });
    } else {
      logger.error("Error occured at getUserCtx@33", {
        logToFile: true,
        isThrow: true,
      });
    }
  }
};
