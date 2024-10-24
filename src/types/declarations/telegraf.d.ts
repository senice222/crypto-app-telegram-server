import "telegraf";
import { TFunction } from "i18next";

declare module "telegraf" {
  interface Context {
    i18n: TFunction;
  }
}
