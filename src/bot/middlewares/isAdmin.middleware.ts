import { Context, MiddlewareFn } from "telegraf";
import UserService from "../services/user.service";

const userService = new UserService();

export const isAdminMiddleware: MiddlewareFn<Context> = async (ctx, next) => {
  const userId = ctx.from?.id;

  if (!userId) {
    await ctx.reply("Unable to identify your user ID.");
    return;
  }

  try {
    const isAdmin = await userService.isAdmin(userId);
    if (isAdmin) {
      await next();
    } else {
      await ctx.reply("❌ You are not authorized to perform this action.");
    }
  } catch (error) {
    console.error("Error in isAdminMiddleware:", error);
    await ctx.reply("❌ An error occurred while verifying your permissions.");
  }
};
