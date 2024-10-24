import { Context } from "telegraf";
import SettingsService, {
  ISettingsService,
} from "../services/settings.service";

export interface ISettingsController {
  getSettings(ctx: Context): Promise<void>;
  updateSettings(ctx: Context, data: Partial<any>): Promise<void>;
}

export default class SettingsController implements ISettingsController {
  private settingsService: ISettingsService;

  constructor() {
    this.settingsService = new SettingsService();
  }

  public async getSettings(ctx: Context): Promise<void> {
    try {
      const settings = await this.settingsService.getSettings();
      const settingsMessage = `
*Current Project Settings:*
• Telegram Chat: ${this.escapeMarkdownV2(settings.telegramChat)}
• Telegram Support ID: ${settings.telegramSupportId}
• Windows Download Link: ${this.escapeMarkdownV2(settings.windowsDownloadLink)}
• iOS Download Link: ${this.escapeMarkdownV2(settings.iosDownloadLink)}
• Android Download Link: ${this.escapeMarkdownV2(settings.androidDownloadLink)}
• Referral Activation Amount: \\$${settings.referralActivationAmount}
• Referral Discount: ${settings.referralDiscount}\\%
• Windows App Version: ${this.escapeMarkdownV2(
        String(settings.windowsAppVersion)
      )}\\%
• Special Offer Time: ${this.escapeMarkdownV2(
        String(settings.specialOfferTime)
      )}
    `;
      await ctx.replyWithMarkdownV2(settingsMessage);
    } catch (error) {
      console.error("Error fetching settings:", error);
      await ctx.reply("❌ Failed to retrieve settings.");
    }
  }

  public async updateSettings(ctx: Context, data: Partial<any>): Promise<void> {
    try {
      await this.settingsService.updateSettings(data);
      await ctx.reply("✅ Settings updated successfully.");
    } catch (error) {
      console.error("Error updating settings:", error);
      await ctx.reply("❌ Failed to update settings.");
    }
  }

  private escapeMarkdownV2(text: string): string {
    return text.replace(/([\\_*\[\]()~`>#+\-=|{}.!])/g, "\\$1");
  }
}
