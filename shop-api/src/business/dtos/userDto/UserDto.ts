import { UserAddressDto } from "./UserAddressDto";

export type UserDto = {
    fullName: string;
    email: string;
    token: string;
    address: UserAddressDto;
    phones: string[];
}