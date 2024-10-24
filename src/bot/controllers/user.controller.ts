import { Context, Markup } from "telegraf";
import UserService from "@services/user.service";
import { Message } from "telegraf/typings/core/types/typegram";

export interface IUserController {
  banMiddleware(ctx: Context, next: () => Promise<void>): Promise<void>;
  viewStatistics(ctx: Context): Promise<void>;
  banUser(ctx: Context): Promise<void>;
  unbanUser(ctx: Context): Promise<void>;
}

export default class UserController implements IUserController {
  private userService: UserService;
  private WEB_APP_FRONTEND: string | undefined;

  constructor() {
    this.userService = new UserService();
    this.WEB_APP_FRONTEND = process.env.WEB_APP_FRONTEND;
  }

  public async start(ctx: Context) {
    if (!this.WEB_APP_FRONTEND || !(ctx.message as Message.TextMessage).text)
      return;

    const user = ctx.from;
    if (!user?.id) return;

    const args = (ctx.message as Message.TextMessage).text.split(" ");

    if (args.length > 1) {
      const promocode = args[1];
      const setPromocode = await this.userService.setPresetPromocode(
        user.id,
        promocode
      );

      if (!setPromocode) {
        ctx.reply("Something went wrong, please try again later.");
        return;
      }

      ctx.reply(
        `Promocode ${promocode} has been activated.`,
        Markup.inlineKeyboard([
          Markup.button.webApp("Open Mini App", this.WEB_APP_FRONTEND),
        ])
      );
    } else {
      ctx.reply(
        "Welcome! Click the button below to open the Mini App.",
        Markup.inlineKeyboard([
          Markup.button.webApp("Open Mini App", this.WEB_APP_FRONTEND),
        ])
      );
    }
  }

  public async banMiddleware(ctx: Context, next: () => Promise<void>) {
    const userId = ctx.from?.id;
    if (!userId) return;
    const isBanned = await this.userService.isUserBanned(userId);
    if (isBanned) {
      await ctx.reply("You are banned from using this bot.");
      return;
    }
    await next();
  }

  public async viewStatistics(ctx: Context) {
    const [
      totalUsers,
      usersLast24h,
      usersLastWeek,
      usersLastMonth,
      usersWithSubs,
      usersWithoutSubs,
    ] = await Promise.all([
      this.userService.getTotalUsers(),
      this.userService.getUsersInLast24Hours(),
      this.userService.getUsersInLastWeek(),
      this.userService.getUsersInLastMonth(),
      this.userService.getUsersWithSubscriptions(),
      this.userService.getUsersWithoutSubscriptions(),
    ]);

    const message = `
User Statistics:
- Total Users: ${totalUsers}
- Users in Last 24 Hours: ${usersLast24h}
- Users in Last Week: ${usersLastWeek}
- Users in Last Month: ${usersLastMonth}
- Users with Subscriptions: ${usersWithSubs}
- Users without Subscriptions: ${usersWithoutSubs}
    `;
    await ctx.reply(message);
  }

  public async banUser(ctx: Context) {
    const userIdToBan = parseInt(
      (ctx.message as Message.TextMessage)?.text?.split(" ")[1]
    );
    if (isNaN(userIdToBan)) {
      await ctx.reply("Please provide a valid user ID to ban.");
      return;
    }
    await this.userService.banUser(userIdToBan);
    await ctx.reply(`User ${userIdToBan} has been banned.`);
  }

  public async unbanUser(ctx: Context) {
    const userIdToUnban = parseInt(
      (ctx.message as Message.TextMessage)?.text?.split(" ")[1]
    );
    if (isNaN(userIdToUnban)) {
      await ctx.reply("Please provide a valid user ID to unban.");
      return;
    }
    await this.userService.unbanUser(userIdToUnban);
    await ctx.reply(`User ${userIdToUnban} has been unbanned.`);
  }
}
