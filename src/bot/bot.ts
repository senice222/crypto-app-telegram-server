import { bot } from "./config/bot.config";
import { authMiddleware } from "./middlewares/auth.middleware";
import { banMiddleware } from "./middlewares/ban.middleware";
import "@commands/index";
import i18nMiddleware from "./middlewares/i18n";

bot
  .launch()
  .then(() => {
    console.log("Bot is up and running");
  })
  .catch((err) => {
    console.error("Failed to start bot", err);
  });

bot.use(i18nMiddleware, authMiddleware, banMiddleware);

process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));
