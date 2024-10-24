import { Context, MiddlewareFn } from "telegraf";
import UserService from "@services/user.service";

const userService = new UserService();

export const banMiddleware: MiddlewareFn<Context> = async (ctx, next) => {
  const userId = ctx.from?.id;
  if (!userId) return;
  const isBanned = await userService.isUserBanned(userId);

  if (isBanned) {
    await ctx.reply("You are banned from using this bot.");
    return;
  }

  await next();
};
