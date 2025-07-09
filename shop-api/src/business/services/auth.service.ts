import { User } from "@prisma/client";
import jwt from "jsonwebtoken"
import { userRepository } from "../../dataAccess/repositories/user.repository";
import crypto from 'crypto'
import { logger } from "../../utils/logger";

class AuthServices {
    public CreateTokenToUser = async (user: User) => {
        logger.info("create jwt", { sec: process.env.TOKEN_SECRET })
        const secrets: jwt.Secret = process.env.TOKEN_SECRET!
        const expiresDate = process.env.TOKEN_EXPIRESIN
        const paylod: object | string = {
            id: user.user_id,
            fullName: `${user.first_name} ${user.last_name}`,
            email: user.email,
            Role: await userRepository.GetUserRole(user.user_id)
        }
        const option: jwt.SignOptions = {
            expiresIn: expiresDate as jwt.SignOptions["expiresIn"],
        }
        return jwt.sign(paylod, secrets, option)
    }
    public CreateRefreshToken = () => {
        return crypto.randomBytes(64).toString("hex");
    }
}
export const authServices: AuthServices = new AuthServices();