import { logger } from "../../utils/logger";
import { prisma } from "../database/data";
import { ProductTypeCreateInput } from "../models/product/productType-create.input"; 
import { producttype } from "@prisma/client";
import { RepositoiesHandler } from "../RepositoiesHandler";

class ProductTypeRepository {
    public AddProductTypeToDatabase = async (newProduct: ProductTypeCreateInput) => {
        let repoHandler: RepositoiesHandler<producttype> = new RepositoiesHandler();
        try {
            const product: producttype = await prisma.producttype.create({
                data: {
                    name: newProduct.name,
                    slug: newProduct.slug,
                    image_url: newProduct.image_url
                }
            });

            if (product === null) {
                throw Error("Can't add product");
            }

            repoHandler = {
                isSucceed: true,
                body: product,
                message: "Product add Succssfuly"
            }
        } catch (er) {
            logger.error("error when add Product in database", { error: er });
            repoHandler = {
                isSucceed: false,
                body: null,
                message: "Can't add product try again"
            }
        }
        return repoHandler;

    }
    public GetProductById = async (productId: string) => {
        try {
            const product: producttype | null = await prisma.producttype.findUnique({
                where: {
                    producttype_id: productId
                }
            });

            if (product === null) {
                throw Error("Can't add product");
            }
            return product;
        } catch (er) {
            logger.error("error when add Product in database", { error: er });

        }
        return null;
    }
    public UpdateProductTypeToDatabase = async (updateProduct: producttype) => {
        let repoHandler: RepositoiesHandler<producttype> = new RepositoiesHandler();
        try {
            const product: producttype = await prisma.producttype.update({
                where: {
                    producttype_id: updateProduct.producttype_id
                },
                data: {
                    name: updateProduct.name,
                    slug: updateProduct.slug,
                    image_url: updateProduct.image_url
                }
            });

            if (product === null) {
                throw Error("Can't Update product");
            }

            repoHandler = {
                isSucceed: true,
                body: product,
                message: "Product Update Succssfuly"
            }
        } catch (er) {
            logger.error("error when Update Product in database", { error: er });
            repoHandler = {
                isSucceed: false,
                body: null,
                message: "Can't Update product try again"
            }
        }
        return repoHandler;
    }
    public DeleteProductTypeFromDatabase = async (productId: string) => {
        try {
            const product: producttype | null = await prisma.producttype.delete({
                where: {
                    producttype_id: productId
                }
            });

            if (product === null) {
                throw Error("Can't Delete product");
            }
            return true;
        } catch (er) {
            logger.error("error when Delete Product From database", { error: er });

        }
        return false;
    }
    public GetProductTypes = async () => {
        try {
            const products: producttype[] | null = await prisma.producttype.findMany();

            if (products === null) {
                throw Error("Can't Delete product");
            }
            return products;
        } catch (er) {
            logger.error("error when Delete Product From database", { error: er });

        }
        return null;
    }

}
export const productTypeRepository: ProductTypeRepository = new ProductTypeRepository();