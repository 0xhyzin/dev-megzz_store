import { logger } from "../../utils/logger";
import { prisma } from "../database/data";
import { ProductCreateInput } from "../models/product/product-create.input";
import { Prisma, product } from "@prisma/client";
import { RepositoiesHandler } from "../RepositoiesHandler";
import { ProductWithRelations } from "../models/Custom Types/productWithinclude";

class ProductRepository {
    public AddProductToDatabase = async (newProduct: ProductCreateInput) => {
        let repoHandler: RepositoiesHandler<ProductWithRelations> = new RepositoiesHandler();
        try {
            const product: ProductWithRelations = await prisma.product.create({
                data: {
                    name: newProduct.name,
                    slug: newProduct.slug,
                    isactive: newProduct.isactive,
                    description: newProduct.description,
                    brandtype_id: newProduct.brandtype_id,
                    categorytype_id: newProduct.categorytype_id,
                    producttype_id: newProduct.producttype_id,
                },
                include: {
                    brandtype: {
                        select: {
                            name: true
                        }
                    },
                    producttype: {
                        select: {
                            name: true
                        }
                    },
                    categorytype: {
                        select: {
                            name: true
                        }
                    }
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
            const product: ProductWithRelations | null = await prisma.product.findUnique({
                where: {
                    product_id: productId
                },
                include: {
                    brandtype: {
                        select: {
                            name: true
                        }
                    },
                    producttype: {
                        select: {
                            name: true
                        }
                    },
                    categorytype: {
                        select: {
                            name: true
                        }
                    }
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
    public UpdateProductToDatabase = async (productId:string,updateProduct: ProductCreateInput) => {
        let repoHandler: RepositoiesHandler<ProductWithRelations> = new RepositoiesHandler();
        try {
            const product: ProductWithRelations = await prisma.product.update({
                where: {
                    product_id: productId
                },
                data: {
                    name: updateProduct.name,
                    slug: updateProduct.slug,
                    isactive: updateProduct.isactive,
                    description: updateProduct.description,
                    brandtype_id: updateProduct.brandtype_id,
                    categorytype_id: updateProduct.categorytype_id,
                    producttype_id: updateProduct.producttype_id,
                },
                include: {
                    brandtype: {
                        select: {
                            name: true
                        }
                    },
                    producttype: {
                        select: {
                            name: true
                        }
                    },
                    categorytype: {
                        select: {
                            name: true
                        }
                    }
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
    public DeleteProductFromDatabase = async (productId: string) => {
        try {
            const product: ProductWithRelations | null = await prisma.product.delete({
                where: {
                    product_id: productId
                },
                include: {
                    brandtype: {
                        select: {
                            name: true
                        }
                    },
                    producttype: {
                        select: {
                            name: true
                        }
                    },
                    categorytype: {
                        select: {
                            name: true
                        }
                    }
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
    public GetProducts = async () => {
        try {
            const products: ProductWithRelations[] | null = await prisma.product.findMany({
                include: {
                    brandtype: {
                        select: {
                            name: true
                        }
                    },
                    producttype: {
                        select: {
                            name: true
                        }
                    },
                    categorytype: {
                        select: {
                            name: true
                        }
                    }
                }
            });

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
export const productRepository: ProductRepository = new ProductRepository();

