import i18n from "i18next";
import Backend from "i18next-fs-backend";
import { Context, MiddlewareFn } from "telegraf";
import path from "path";
import UserService, { IUserService } from "../services/user.service";

i18n.use(Backend).init({
  fallbackLng: "en",
  preload: ["en", "fr", "es", "de", "it", "cn", "tr", "ru", "pt", "in"],
  ns: ["admin", "subscriptions", "error", "user"],
  defaultNS: "user",
  backend: {
    loadPath: path.join(__dirname, "../../locales/{{lng}}/{{ns}}.json"),
  },
  interpolation: {
    escapeValue: false,
  },
});

const i18nMiddleware: MiddlewareFn<Context> = async (ctx, next) => {
  const userId = ctx.from?.id;
  let language = "en";

  if (userId) {
    const userService: IUserService = new UserService();
    const user = await userService.getUserById(userId);
    if (user && user.language) {
      language = user.language;
    }
  }

  await i18n.changeLanguage(language);

  const t = i18n.getFixedT(language);

  ctx.i18n = t;

  await next();
};

export default i18nMiddleware;
