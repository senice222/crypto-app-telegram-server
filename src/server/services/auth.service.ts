import User from "@/database/models/user.model";
import jwt from "jsonwebtoken";

export interface IAuthService {
  login(userId: string): Promise<string>;
  validateToken(token: string): Promise<TokenPayload>;
}

export interface TokenPayload {
  userId: string;
  id: number;
  iat?: number;
  exp?: number;
}

export class AuthService implements IAuthService {
  public async login(userId: string): Promise<string> {
    const user = await User.findOne({ where: { userId } });
    if (!user) {
      throw new Error("User not found");
    }

    const payload: TokenPayload = { userId: String(user.userId), id: user.id };
    const token = jwt.sign(payload, process.env.JWT_SECRET!, {
      expiresIn: "30d",
    });
    return token;
  }

  public async validateToken(token: string): Promise<TokenPayload> {
    return jwt.verify(token, process.env.JWT_SECRET!) as TokenPayload;
  }
}
