import { Context } from "telegraf";
import SubscriptionService from "../services/subscription.service";
import { Message } from "telegraf/typings/core/types/typegram";
import User from "@/database/models/user.model";

export interface ISubscriptionController {
  createSubscription(ctx: Context): Promise<void>;
  deleteSubscription(ctx: Context): Promise<void>;
  editSubscription(ctx: Context): Promise<void>;
  getSubscriptions(ctx: Context): Promise<void>;
  viewSubscriptionStats(ctx: Context): Promise<void>;
  refStats(ctx: Context, userId: number): Promise<void>;
  updateSpecialOffer(ctx: Context, hours: number): Promise<void>;
}

export default class SubscriptionController implements ISubscriptionController {
  private subscriptionService: SubscriptionService;

  constructor() {
    this.subscriptionService = new SubscriptionService();
  }

  public async createSubscription(ctx: Context) {
    const data = JSON.parse(
      (ctx.message as Message.TextMessage)?.text
        ?.split(" ")
        .slice(1)
        .join(" ") || "{}"
    );
    const subscription = await this.subscriptionService.createSubscription(
      data
    );
    await ctx.reply(`Subscription ${subscription.name} created successfully.`);
  }

  public async deleteSubscription(ctx: Context) {
    const id = parseInt(
      (ctx.message as Message.TextMessage)?.text?.split(" ")[1]
    );
    if (isNaN(id)) {
      await ctx.reply("Please provide a valid subscription ID to delete.");
      return;
    }
    await this.subscriptionService.deleteSubscription(id);
    await ctx.reply(`Subscription with ID ${id} deleted successfully.`);
  }

  public async editSubscription(ctx: Context) {
    const id = parseInt(
      (ctx.message as Message.TextMessage)?.text?.split(" ")[1]
    );
    const data = JSON.parse(
      (ctx.message as Message.TextMessage)?.text
        ?.split(" ")
        .slice(2)
        .join(" ") || "{}"
    );
    if (isNaN(id)) {
      await ctx.reply("Please provide a valid subscription ID to edit.");
      return;
    }
    await this.subscriptionService.editSubscription(id, data);
    await ctx.reply(`Subscription with ID ${id} updated successfully.`);
  }

  public async getSubscriptions(ctx: Context) {
    const subscriptions = await this.subscriptionService.getSubscriptions();
    const message = subscriptions
      .map((sub) => `ID: ${sub.id}, Name: ${sub.name}, Price: ${sub.price}`)
      .join("\n");

    if (subscriptions.length <= 0) {
      await ctx.reply(
        `No available subscriptions, please create one using /createSubscription`
      );

      return;
    }

    await ctx.reply(`Available Subscriptions:\n${message}`);
  }

  public async viewSubscriptionStats(ctx: Context) {
    const id = parseInt(
      (ctx.message as Message.TextMessage)?.text?.split(" ")[1]
    );
    if (isNaN(id)) {
      await ctx.reply("Please provide a valid subscription ID.");
      return;
    }
    const count = await this.subscriptionService.getSubscriptionStats(id);
    await ctx.reply(`Subscription ID ${id} has ${count} users.`);
  }

  public async sendAll(ctx: Context, message: string) {
    const sentAmount = await this.subscriptionService.sendAll(message);

    await ctx.reply(`Message sent to ${sentAmount} users.`);
  }

  public async resetRevenue(ctx: Context, userId: number) {
    try {
      const user = await User.findOne({
        where: {
          userId,
        },
      });

      if (!user) throw new Error("User not found");

      const result = await this.subscriptionService.resetRevenue(user.id);

      if (result) {
        await ctx.reply(`Revenue for user ID ${userId} has been reset to 0.`);
      } else {
        await ctx.reply(`User with ID ${userId} does not have a promocode.`);
      }
    } catch (error) {
      console.error(`Error resetting revenue for user ID ${userId}:`, error);
      await ctx.reply(`An error occurred while resetting the revenue.`);
    }
  }

  public async updateSpecialOffer(ctx: Context, hours: number) {
    try {
      await this.subscriptionService.updateSpecialOffer(hours);
      await ctx.reply(`Special offer time has been updated to ${hours} hours`);
    } catch (error) {
      console.error(`Error setting special offer time to ${hours}:`, error);
      await ctx.reply(`An error occurred while setting special offer time.`);
    }
  }

  public async refStats(ctx: Context, userId: number) {
    try {
      const user = await User.findOne({
        where: {
          userId,
        },
      });

      if (!user) throw new Error("User not found");

      const { activations, balance } = await this.subscriptionService.refStats(
        user.id
      );

      if (activations !== undefined && balance !== undefined) {
        await ctx.reply(`
Referral stats for ${userId}:

- Activations: ${activations}
- Balance: ${balance}
`);
      } else {
        await ctx.reply(`User with ID ${userId} does not have a promocode.`);
      }
    } catch (error) {
      console.error(
        `Error getting referral stats for user ID ${userId}:`,
        error
      );
      await ctx.reply(`An error occurred while resetting the revenue.`);
    }
  }
}
