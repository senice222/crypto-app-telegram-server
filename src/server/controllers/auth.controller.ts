import { Request, Response } from "express";
import { AuthService } from "../services/auth.service";

export class AuthController {
  private authService: AuthService;

  constructor() {
    this.authService = new AuthService();
  }

  public login = async (req: Request, res: Response) => {
    try {
      const { userId } = req.body;
      if (!userId) {
        res.status(400).json({ message: "userId is required" });
      }

      const token = await this.authService.login(userId);
      res.json({ token });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  };
}
