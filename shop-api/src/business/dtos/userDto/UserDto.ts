import { UserAddressDto } from "./UserAddressDto";
import { UserPhoneDto } from "./UserPhoneDto";

export type UserDto = {
    fullName: string;
    email: string;
    token: string;
    address: UserAddressDto | null;
    phones: UserPhoneDto | null;
}