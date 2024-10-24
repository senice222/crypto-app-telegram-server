import Settings from "@/database/models/settings.model";

export interface ISettingsService {
  getSettings(): Promise<Settings>;
  updateSettings(data: Partial<Settings>): Promise<void>;
}

export default class SettingsService implements ISettingsService {
  public async getSettings(): Promise<Settings> {
    const settings = await Settings.findOne();
    if (!settings) {
      throw new Error("Settings not found");
    }
    return settings;
  }

  public async updateSettings(data: Partial<Settings>): Promise<void> {
    const settings = await Settings.findOne();
    if (!settings) {
      throw new Error("Settings not found");
    }
    await settings.update(data);
  }
}
