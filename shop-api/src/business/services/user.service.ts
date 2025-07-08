import { User } from "@prisma/client";
import { userRepository } from "../../dataAccess/repositories/user.repository";
import { UserDto } from "../dtos/userDto/UserDto";
import { LoginUserDto } from "../dtos/userDto/LoginUserDto";
import bcrypt from "bcrypt";
import { logger } from "../../utils/logger";
import { authServices } from "./auth.service";
import { ToUserDto } from "../helpers/mapper";

class UserService {
    public GetUser = async (loginUserDto: LoginUserDto) => {
        let servHandler: ServicesHandler<UserDto | null> = new ServicesHandler();
        const repoRespons: RepositoiesHandler<User> = await userRepository.FindUserByEmail(loginUserDto.email);
        if (repoRespons.isSucceed === false || repoRespons.body === null) {
            logger.error("User not fount must create Account First")
            servHandler.body = null;
            servHandler.isSucceed = false;
            servHandler.message = repoRespons.message;
            return servHandler;
        }
        const hashPassword = repoRespons.body?.hash_password;
        const isPasswordCorrect: boolean = await bcrypt.compare(loginUserDto.password, hashPassword!)
        if (!isPasswordCorrect) {
            logger.error("Password Not Match try again")
            servHandler.body = null;
            servHandler.isSucceed = false;
            servHandler.message = "There is an error, try again.";
            return servHandler;
        }
        logger.info("Get JWT Token To User", { email: repoRespons.body?.user_id })
        const jwtToken = await authServices.CreateTokenToUser(repoRespons.body!);
        const refreshToken = authServices.CreateRefreshToken();

        if (jwtToken === null || refreshToken === null) {
            logger.error("Error When create Jwt or RefreshToken")
            servHandler.body = null;
            servHandler.isSucceed = false;
            servHandler.message = "There is an error, try again.";
            return servHandler;
        }

        logger.info("Login successfuly Welcom")
        servHandler.isSucceed = false;
        servHandler.message = "There is an error, try again.";
        servHandler.body = ToUserDto(repoRespons.body!, jwtToken);
        servHandler.refreshToken = refreshToken;
        return servHandler;
    }
}
export const userService: UserService = new UserService();
