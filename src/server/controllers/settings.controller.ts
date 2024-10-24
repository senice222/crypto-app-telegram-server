import { Request, Response } from "express";
import { ISettingsService } from "../services/settings.service";

export interface ISettingsController {
  getSettings(req: Request, res: Response): Promise<void>;
}

export class SettingsController implements ISettingsController {
  private settingsService: ISettingsService;

  constructor(settingsService: ISettingsService) {
    this.settingsService = settingsService;
    this.getSettings = this.getSettings.bind(this);
  }

  public async getSettings(req: Request, res: Response): Promise<void> {
    try {
      const settings = await this.settingsService.getSettings();
      res.status(200).json({
        success: true,
        data: settings,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Failed to retrieve settings.",
      });
    }
  }
}
