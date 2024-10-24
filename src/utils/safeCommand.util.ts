import { bot } from "@/bot/config/bot.config";
import { TCommands } from "@/types/bot/bot.types";

type TCommandHandler = (...args: any[]) => void;

export function safeCommand<T extends TCommands>(
  action: T,
  ...handlers: TCommandHandler[]
) {
  bot.command(action, ...(handlers as [TCommandHandler, ...TCommandHandler[]]));
}
