import { User } from "@prisma/client";
import { UserDto } from "../dtos/userDto/UserDto";
import { UserWithAddressAndPhone } from "../../dataAccess/models/user/prismaTypes/prisma-types";

export const ToUserDto = (user: UserWithAddressAndPhone, token: string): UserDto => {
    return {
        fullName: `${user.first_name} ${user.last_name}`,
        email: user.email,
        address:{
            governorate_city:user.address?.governorate_city!,
            street:user.address?.street!,
            apartment_number:user.address?.apartment_number!,
            building_name_number:user.address?.building_name_number!,
            additional_details:user.address?.additional_details!
        },
        phones:user.phone.map(p=>p.phone),
        token: token,
    }
}