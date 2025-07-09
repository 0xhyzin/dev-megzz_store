import { AddressDto } from "./AddresDto";
import { PhoneDto } from "./PhoneDto";

export type UserDto = {
    fullName: string;
    email: string;
    token: string;
    adress: AddressDto | null;
    phons: PhoneDto | null;
}