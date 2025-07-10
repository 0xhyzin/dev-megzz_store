import { Request, Response } from "express";
import { userService } from "../../business/services/user.service";
import { LoginUserDto } from "../../business/dtos/userDto/LoginUserDto";
import { UserDto } from "../../business/dtos/userDto/UserDto";
import { logger } from "../../utils/logger";
import { ServicesHandler } from "../../business/ServicesHandler";
import { CreateUserDto } from "../../business/dtos/userDto/CreateUserDto";

class UserController {
    public LoginUser = async (req: Request, res: Response) => {
        const { email, password } = req.body;
        const loginUserDto: LoginUserDto = {
            email: email,
            password: password
        }
        const servRespons: ServicesHandler<UserDto | null> = await userService.GetUser(loginUserDto);
        if (!servRespons.isSucceed || servRespons.refreshToken === null) {
            logger.error("login faild");
            res.status(400).send({ message: servRespons.message });
        }
        res.cookie("refreshTocken", servRespons.refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: "strict",
            maxAge: 30 * 24 * 60 * 60 * 1000
        }).status(200).send({ message: servRespons.message, user: servRespons.body })


    }
    public CreatNewAccount = async (req: Request, res: Response) => {
        const { firstName, lastName, email, phone, password } = req.body;
        const createUserDto: CreateUserDto = {
            first_name: firstName,
            last_name: lastName,
            email: email,
            password: password,
            phone: phone,
        }
        const servRespons: ServicesHandler<UserDto | null> = await userService.addUser(createUserDto);
        if (!servRespons.isSucceed || servRespons.refreshToken === null) {
            logger.error("create Account faild");
            res.status(400).send({ message: servRespons.message });
        }
        res.cookie("refreshTocken", servRespons.refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: "strict",
            maxAge: 30 * 24 * 60 * 60 * 1000
        }).status(200).send({ message: servRespons.message, user: servRespons.body })
    }

}
export const userController: UserController = new UserController();