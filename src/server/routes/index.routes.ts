import { Router } from "express";
import { subscriptionRouter } from "./subscriptions/subscriptions.routes";
import { usersRouter } from "./users/users.routes";
import { authRouter } from "./auth/auth.routes";
import { referralRouter } from "./referral/referral.routes";
import { settingsRouter } from "./settings/settings.routes";

export const indexRouter = Router();

indexRouter.use("/subscriptions", subscriptionRouter);
indexRouter.use("/users", usersRouter);
indexRouter.use("/auth", authRouter);
indexRouter.use("/referral", referralRouter);
indexRouter.use("/settings", settingsRouter);
