import { address, phone, User } from "@prisma/client";
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
            create_at: new Date(),
        }
        const phones: phone[] = newUser.phone.map(p => ({ phone: p, user_id: "", phone_id: "" }))
        const address: address = {
            address_id: "",
            additional_details: newUser.additional_details,
            apartment_number: newUser.apartment_number,
            building_name_number: newUser.building_name_number,
            governorate_city: newUser.governorate_city,
            street: newUser.street,
            user_id: ""
        }

        logger.info("Go to User Repo To Add User To Database")
        const repoRespons: RepositoiesHandler<User> = await userRepository.AddNewUser(user, phones, address);

        if (!repoRespons.isSucceed) {
            logger.error("User Cann't Add In database", { message: repoRespons.message })
            servHandler.body = null;
            servHandler.isSucceed = false;
            servHandler.message = "There is an error, try again.";
            return servHandler;
        }

        logger.info("Get JWT Token To User", { email: repoRespons.body!.email })
        const jwtToken = await authServices.CreateTokenToUser(repoRespons.body!);
        logger.info("Get Refresh Token To User", { email: repoRespons.body!.email })
        const refreshToken = authServices.CreateRefreshToken();

        if (jwtToken === null || refreshToken === null) {
            logger.error("Error When create Jwt or RefreshToken")
            servHandler.body = null;
            servHandler.isSucceed = false;
            servHandler.message = "There is an error, try again.";
            return servHandler;
        }

        const userDto = ToUserDto(repoRespons.body!, jwtToken);

        logger.info("user add successfuly Welcom")
        servHandler.isSucceed = true;
        servHandler.message = "user add successfuly.";
        servHandler.body = ToUserDto(repoRespons.body!, jwtToken);
        servHandler.refreshToken = refreshToken;
        return servHandler;
    }

}
export const userService: UserService = new UserService();
