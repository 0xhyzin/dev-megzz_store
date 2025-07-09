export type CreateUserDto = {
  first_name: string;
  last_name: string;
  email: string;
  password: string;

  phone: string[];

  governorate_city: string;
  street: string;
  building_name_number: string;
  apartment_number: string;
  additional_details: string;
}