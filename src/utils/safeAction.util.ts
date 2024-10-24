import { bot } from "@/bot/config/bot.config";
import { TActions } from "@/types/bot/bot.types";

type TActionHandler = (...args: any[]) => void;

export function safeAction<T extends TActions>(
  action: T,
  ...handlers: TActionHandler[]
) {
  bot.action(action, ...(handlers as [TActionHandler, ...TActionHandler[]]));
}
