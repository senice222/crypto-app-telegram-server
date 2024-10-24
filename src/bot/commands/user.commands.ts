import { bot } from "../config/bot.config";
import { authMiddleware } from "../middlewares/auth.middleware";
import UserController from "../controllers/user.controller";

const userController = new UserController();

bot.start(authMiddleware, async (ctx) => {
  await userController.start(ctx);
});
