import { Request, Response, NextFunction } from "express";
import { AuthService, TokenPayload } from "../services/auth.service";

const authService = new AuthService();

export interface AuthenticatedRequest extends Request {
  user: {
    id: number;
    userId: string;
  };
}

export const authenticateJWT = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;

  if (authHeader) {
    const token = authHeader.split(" ")[1];

    try {
      const decoded: TokenPayload = await authService.validateToken(token);
      req.user = { id: decoded.id, userId: decoded.userId };
      next();
    } catch (error) {
      res.sendStatus(403);
    }
  } else {
    res.sendStatus(401);
  }
};
