import { Telegraf } from "telegraf";
import { logger } from "@config/app.config";

export const BOT_TOKEN = process.env.BOT_TOKEN;

if (!BOT_TOKEN)
  logger.error("Bot token was not provided. Check .env file.", {
    logToFile: true,
    isThrow: true,
  });

export const bot = new Telegraf(BOT_TOKEN as string);
