import { bot } from "../config/bot.config";
import SettingsController from "../controllers/settings.controller";
import SubscriptionController from "../controllers/subscription.controller";
import UserController from "../controllers/user.controller";
import { isAdminMiddleware } from "../middlewares/isAdmin.middleware";

const userController = new UserController();
const subscriptionController = new SubscriptionController();
const settingsController = new SettingsController();

bot.command("stats", isAdminMiddleware, async (ctx) => {
  await userController.viewStatistics(ctx);
});

bot.command("ban", isAdminMiddleware, async (ctx) => {
  await userController.banUser(ctx);
});

bot.command("unban", isAdminMiddleware, async (ctx) => {
  await userController.unbanUser(ctx);
});

bot.command("create_subscription", isAdminMiddleware, async (ctx) => {
  await subscriptionController.createSubscription(ctx);
});

bot.command("delete_subscription", isAdminMiddleware, async (ctx) => {
  await subscriptionController.deleteSubscription(ctx);
});

bot.command("edit_subscription", isAdminMiddleware, async (ctx) => {
  await subscriptionController.editSubscription(ctx);
});

bot.command("subscriptions", isAdminMiddleware, async (ctx) => {
  await subscriptionController.getSubscriptions(ctx);
});

bot.command("subscription_stats", isAdminMiddleware, async (ctx) => {
  await subscriptionController.viewSubscriptionStats(ctx);
});

bot.command("reset_balance", isAdminMiddleware, async (ctx) => {
  await subscriptionController.viewSubscriptionStats(ctx);
});

bot.command("ref_stats", isAdminMiddleware, async (ctx) => {
  const args = ctx.message.text.split(" ").slice(1);
  const userId = args[0];

  if (!userId) {
    await ctx.reply("Please provide the user ID. Usage: /ref_stats userId");
    return;
  }

  await subscriptionController.refStats(ctx, parseInt(userId, 10));
});

bot.command("send_all", isAdminMiddleware, async (ctx) => {
  const messageToSend = ctx.message.text.split(" ").slice(1).join(" ");

  if (!messageToSend) {
    await ctx.reply(
      "Please provide a message to send. Usage: /send_all Your message here"
    );
    return;
  }

  await subscriptionController.sendAll(ctx, messageToSend);
});

bot.command("reset_revenue", isAdminMiddleware, async (ctx) => {
  const args = ctx.message.text.split(" ").slice(1);
  const userId = args[0];

  if (!userId) {
    await ctx.reply(
      "Please provide the user ID. Usage: /reset_revenue user_id"
    );
    return;
  }

  await subscriptionController.resetRevenue(ctx, parseInt(userId, 10));
});

bot.command("special_offer", isAdminMiddleware, async (ctx) => {
  const args = ctx.message.text.split(" ").slice(1);
  const hours = args[0];

  if (!hours) {
    await ctx.reply(
      "Please provide valid hours integer. Usage: /special_offer hours"
    );
    return;
  }

  await subscriptionController.updateSpecialOffer(ctx, parseInt(hours, 10));
});

bot.command("edit_settings", isAdminMiddleware, async (ctx) => {
  try {
    const commandText = ctx.message.text;

    const dataString = commandText
      .substring(commandText.indexOf(" ") + 1)
      .trim();

    const data = JSON.parse(dataString);

    await settingsController.updateSettings(ctx, data);
  } catch (error) {
    console.error("Error in edit_settings command:", error);
    await ctx.reply("❌ Invalid settings format or command failed.");
  }
});

bot.command("settings", isAdminMiddleware, async (ctx) => {
  try {
    await settingsController.getSettings(ctx);
  } catch (error) {
    console.error("Error in settings command:", error);
    await ctx.reply("❌ Invalid settings format or command failed.");
  }
});
