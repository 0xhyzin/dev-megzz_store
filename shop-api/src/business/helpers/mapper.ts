import { User } from "@prisma/client";
import { UserDto } from "../dtos/userDto/UserDto";

export const ToUserDto = (user: User, token: string): UserDto => {
    return {
        fullName: `${user.first_name} ${user.last_name}`,
        email: user.email,
        phones:user.phone,
        token: token,
    }
}