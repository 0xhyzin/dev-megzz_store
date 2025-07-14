export type ProductCreateInput = {
    name: string;
    slug: string;
    description: string;
    isactive: boolean;
    categorytype_id: string,
    brandtype_id: string,
    producttype_id: string
}