import { logger } from "../../utils/logger";
import { prisma } from "../database/data";
import { RepositoiesHandler } from "../RepositoiesHandler";
import { color, image, product, productvariant, size } from "@prisma/client";
import { AddProductVariantDto } from "../../business/dtos/productDto/ProductVariant/AddProductVariantDto";
import { productVariantWithIncludes, ProductVariantWithRelations } from "../models/Custom Types/productVariantWithInclude";
import { ProductVariantCreateInput } from "../models/product/productVariant-create.input";
import { ColoreCreateInput } from "../models/product/color-create.input";
import { SizeCreateInput } from "../models/product/size-create.input";
import { ImageCreateInput } from "../models/product/image-create.input";

class ProductVariantRepository {
    public async GetProductById(productId: string) {
        try {
            const product: product | null = await prisma.product.findUnique({
                where: {
                    product_id: productId
                },
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
    public async AddColorAndReturnColorId(colorCreate: ColoreCreateInput) {
        try {
            logger.info(`color data name:${colorCreate.name} slung:${colorCreate.slug}`)
            const color: color | null = await prisma.color.create({
                data: {
                    name: colorCreate.name,
                    slug: colorCreate.slug
                }
            });

            if (color === null) {
                throw Error("Can't add product");
            }
            return color.color_id;
        } catch (er) {
            logger.error("error when add Product in database", { error: er });

        }
        return null;
    }
    public async ColorIsExist(colorName: string) {
        try {
            const color: color | null = await prisma.color.findUnique({
                where: {
                    name: colorName,
                }
            });

            if (color === null) {
                throw Error("Can't add product");
            }
            return color.color_id;
        } catch (er) {
            logger.error("error when add Product in database", { error: er });

        }
        return null;
    }
    public async AddSizeAndReturnSizeId(sizeCreate: SizeCreateInput) {
        try {
            const size: size | null = await prisma.size.create({
                data: {
                    value: sizeCreate.value
                }
            });

            if (size === null) {
                throw Error("Can't add product");
            }
            return size.size_id;
        } catch (er) {
            logger.error("error when add Product in database", { error: er });

        }
        return null;
    }
    public async SizeIsExist(sizeValue: string) {
        try {
            const size: size | null = await prisma.size.findUnique({
                where: {
                    value: sizeValue,
                }
            });

            if (size === null) {
                throw Error("Can't add product");
            }
            return size.size_id;
        } catch (er) {
            logger.error("error when add Product in database", { error: er });

        }
        return null;
    }
    public async addImageAndReturnId(ImageCreate: ImageCreateInput) {
        try {
            const image: image | null = await prisma.image.create({
                data: {
                    url: ImageCreate.url,
                    isprimary: ImageCreate.isprimary,
                    productvariant_id: ImageCreate.productVariant_Id
                }
            });

            if (image === null) {
                throw Error("Can't add product");
            }
            return image.image_id;
        } catch (er) {
            logger.error("error when add Product in database", { error: er });

        }
        return null;
    }
    public AddProductVariantToDatabase = async (newVariant: ProductVariantCreateInput) => {
        try {
            const productVariant: ProductVariantWithRelations | null = await prisma.productvariant.create({
                data: {
                    price: newVariant.price,
                    stock: newVariant.stock,
                    color_id: newVariant.color_id,
                    product_id: newVariant.product_id,
                    size_id: newVariant.size_id,
                },
                include: {
                    color: {
                        select: {
                            name: true
                        }
                    },
                    size: {
                        select: {
                            value: true
                        }
                    },
                    product: {
                        select: {
                            name: true
                        }
                    },
                    images:{
                        select:{
                            url:true
                        }
                    }
                }
            });

            if (productVariant === null) {
                throw Error("Can't add product");
            }
            return productVariant;
        } catch (er) {
            logger.error("error when add Product in database", { error: er });

        }
        return null;
    };
    public GetProductImages = async (productVariantId: string) => {
        try {
            const images: image[] | null = await prisma.image.findMany({
                where: {
                    productvariant_id: productVariantId
                }
            });

            if (images === null) {
                throw Error("Can't Find Images");
            }
            return images;
        } catch (er) {
            logger.error("error when add Product in database", { error: er });

        }
        return null;
    }

    public GetProductVariantById = async (variantId: string) => {
        try {
            const productVariant: ProductVariantWithRelations | null = await prisma.productvariant.findUnique({
                where: { productvariant_id: variantId },
                include: {
                    color: { select: { name: true } },
                    size: { select: { value: true } },
                    product: { select: { name: true } },
                    images: { select: { url: true } }
                }
            });
            return productVariant;
        } catch (er) {
            logger.error("error when get ProductVariant by id", { error: er });
        }
        return null;
    }
    public UpdateProductVariantToDatabase = async (variantId: string, updateData: ProductVariantCreateInput) => {
        try {
            const productVariant: ProductVariantWithRelations | null = await prisma.productvariant.update({
                where: { productvariant_id: variantId },
                data: {
                    price: updateData.price,
                    stock: updateData.stock,
                    color_id: updateData.color_id,
                    product_id: updateData.product_id,
                    size_id: updateData.size_id,
                },
                include: {
                    color: { select: { name: true } },
                    size: { select: { value: true } },
                    product: { select: { name: true } },
                    images: { select: { url: true } }
                }
            });
            return productVariant;
        } catch (er) {
            logger.error("error when update ProductVariant in database", { error: er });
        }
        return null;
    }
    public DeleteProductVariantFromDatabase = async (variantId: string) => {
        try {
            const deleted = await prisma.productvariant.delete({
                where: { productvariant_id: variantId }
            });
            logger.info("Deleted product variant from database", { productvariant_id: variantId });
            return true;
        } catch (er) {
            logger.error("Failed to delete product variant from database", { error: er, roductvariant_id: variantId });
            return false;
        }
    };
    public GetProductVariants = async () => {
        try {
            const productVariants: ProductVariantWithRelations[] = await prisma.productvariant.findMany({
                include: {
                    color: { select: { name: true } },
                    size: { select: { value: true } },
                    product: { select: { name: true } },
                    images:{select:{url:true}}
                }
            });
            logger.info("Fetched all product variants", { count: productVariants.length });
            return productVariants;
        } catch (er) {
            logger.error("error when get all ProductVariants", { error: er });
            return [];
        }
    }
    public DeleteImageFromDatabase = async (imageUrl: string) => {
        try {
            const deleted = await prisma.image.delete({
                where: { url: imageUrl }
            });
            logger.info("Deleted image from database", { url: imageUrl });
            return true;
        } catch (er) {
            logger.error("Failed to delete image from database", { error: er, url: imageUrl });
            return false;
        }
    }
}
export const productVariantRepository: ProductVariantRepository = new ProductVariantRepository(); 