import { phone, User } from "@prisma/client";
import { userRepository } from "../../dataAccess/repositories/user.repository";
import { UserDto } from "../dtos/userDto/UserDto";
import { LoginUserDto } from "../dtos/userDto/LoginUserDto";
import bcrypt from "bcrypt";
import { logger } from "../../utils/logger";
import { authServices } from "./auth.service";
import { ToUserDto } from "../helpers/mapper";
import { CreateUserDto } from "../dtos/userDto/CreateUserDto";
import { ServicesHandler } from "../ServicesHandler";
import { RepositoiesHandler } from "../../dataAccess/RepositoiesHandler";
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
        logger.info("Get JWT Token To User", { email: repoRespons.body?.email })
        const jwtToken = await authServices.CreateTokenToUser(repoRespons.body!);
        logger.info("Get Refresh Token To User", { email: repoRespons.body?.email })
        const refreshToken = authServices.CreateRefreshToken();

        if (jwtToken === null || refreshToken === null) {
            logger.error("Error When create Jwt or RefreshToken")
            servHandler.body = null;
            servHandler.isSucceed = false;
            servHandler.message = "There is an error, try again.";
            return servHandler;
        }

        logger.info("Login successfuly Welcom")
        servHandler.isSucceed = true;
        servHandler.message = repoRespons.message;
        servHandler.body = ToUserDto(repoRespons.body!, jwtToken);
        servHandler.refreshToken = refreshToken;
        return servHandler;
    }
    public addUser = async (newUser: CreateUserDto) => {
        let servHandler: ServicesHandler<UserDto | null> = new ServicesHandler();
        logger.info("try add user", { fileName: "userServices" })
        const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS || '10', 10);
        const user: User = {
            user_id: "",
            first_name: newUser.first_name,
            last_name: newUser.last_name,
            email: newUser.email,
            hash_password: await bcrypt.hash(newUser.password, saltRounds),
            create_at: new Date()
        }
        const repoRespons: RepositoiesHandler<string> = await userRepository.AddNewUser(user);
        const userId = repoRespons.body;
        if (!repoRespons.isSucceed || userId === null) {
            logger.error("some thing wrong when add user");
            servHandler.body = null;
            servHandler.isSucceed = false;
            servHandler.message = "There is an error, try again.";
            return servHandler;
        }
        logger.info("find User By Id ", { id: userId })
        const userAdd: User | null = (await userRepository.FindUserById(userId)).body;
        if (userAdd === null) {
            logger.error("user Not found", { id: userId });
            servHandler.body = null;
            servHandler.isSucceed = false;
            servHandler.message = "There is an error, try again.";
            return servHandler;
        }
        logger.info("Get JWT Token To User", { email: userAdd.email })
        const jwtToken = await authServices.CreateTokenToUser(userAdd);
        logger.info("Get Refresh Token To User", { email: userAdd.email })
        const refreshToken = authServices.CreateRefreshToken();

        if (jwtToken === null || refreshToken === null) {
            logger.error("Error When create Jwt or RefreshToken")
            servHandler.body = null;
            servHandler.isSucceed = false;
            servHandler.message = "There is an error, try again.";
            return servHandler;
        }
        logger.info("user add successfuly Welcom")
        servHandler.isSucceed = true;
        servHandler.message = "user add successfuly.";
        servHandler.body = ToUserDto(userAdd, jwtToken);
        servHandler.refreshToken = refreshToken;
        return servHandler;
    }

}
export const userService: UserService = new UserService();
