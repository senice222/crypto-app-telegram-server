import { AuthController } from "@/server/controllers/auth.controller";
import { Router } from "express";

const authController = new AuthController();

export const authRouter = Router();

authRouter.post("/telegram-auth", authController.login);
