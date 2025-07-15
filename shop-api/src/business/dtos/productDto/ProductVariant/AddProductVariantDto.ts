export type AddProductVariantDto = {
    product_id: string;
    price: number;
    stock: number;
    color_name: string;
    size_value: string;
    images: Express.Multer.File[];
}

