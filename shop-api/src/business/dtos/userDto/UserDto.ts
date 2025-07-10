

export type UserDto = {
    fullName: string;
    email: string;
    phones: string[];
    address: {
        governorate_city: string;
        street: string;
        building_name_number: string;
        apartment_number: string;
        additional_details: string;
    };
    token: string;
}