export type ProductVariantDto = {
    productvariant_id: string;
    product_id: string;
    price: string;
    stock: number;
    color: string;
    size: string;
    imagesUrl: {
        url: string
    }[];
}