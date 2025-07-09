export type userCreateInput = {
    first_name: string;
    last_name: string;
    email: string;
    hash_password: string;

    phone: string[];

    address: {
        street: string;
        building_name_number: string;
        apartment_number: string;
        additional_details: string;
        governorate_city: string;
    };
}