import { SettingsController } from "@/server/controllers/settings.controller";
import {
  ISettingsService,
  SettingsService,
} from "@/server/services/settings.service";
import { Router } from "express";

export const settingsRouter = Router();

const settingsService: ISettingsService = new SettingsService();
const settingsController = new SettingsController(settingsService);

settingsRouter.get("/", settingsController.getSettings);
