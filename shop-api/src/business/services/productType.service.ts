import slugify from "slugify";
import { logger } from "../../utils/logger";
import { AddProductTypeDto } from "../dtos/productDto/ProductType/AddProductTypeDto";
import { ProductTypeDto } from "../dtos/productDto/ProductType/ProductTypeDto";
import { DeleteImageInSupabase, SaveImageInSupabase } from "../helpers/supperbase.connection";
import { ServicesHandler } from "../ServicesHandler";
import { RepositoiesHandler } from "../../dataAccess/RepositoiesHandler";
import { producttype } from "@prisma/client";
import { productTypeRepository } from "../../dataAccess/repositories/productType.repository";
import { ProductTypeCreateInput } from "../../dataAccess/models/product/productType-create.input";
import { UpdateProductTypeDto } from "../dtos/productDto/ProductType/UpdateProductTypeDto";

class ProductTypeServices {
    public AddProductType = async (newProduct: AddProductTypeDto) => {
        let servHandler: ServicesHandler<ProductTypeDto | null> = new ServicesHandler();
        logger.info("Try add Product type in product services");

        logger.info("change slug name");
        newProduct.slug = slugify(newProduct.name, { lower: true });

        const image = newProduct.image;
        const fileName = `${Date.now()}_${image.originalname}`;
        const bucket = 'producttypeimage';

        logger.info("Add image To supabase and Return imageUrl To Add It in database");
        const { reuslt, imageUrl } = await SaveImageInSupabase(newProduct.image, fileName, bucket);

        if (reuslt.error) {
            logger.error("You Can't Add this image", { error: reuslt.error })
            servHandler = {
                body: null,
                isSucceed: false,
                message: "Failed to upload image",
                refreshToken: null
            }
            return servHandler;
        }
        logger.info("image add in supabase succssfuly", { data: reuslt.data, imageUrl: imageUrl });
        const image_input: ProductTypeCreateInput = {
            name: newProduct.name,
            slug: newProduct.slug,
            image_url: imageUrl
        }

        logger.info("add Product To database", { image: image_input });
        const repoRespons: RepositoiesHandler<producttype | null> = await productTypeRepository.AddProductTypeToDatabase(image_input);
        if (!repoRespons.isSucceed) {
            logger.error("product Cann't Add In database", { message: repoRespons.message })
            servHandler.body = null;
            servHandler.isSucceed = false;
            servHandler.message = "There is an error, try again.";
            return servHandler;
        }


        logger.info("product add to database succssfuly");
        const productType: ProductTypeDto = {
            productTypeId: repoRespons.body?.producttype_id!,
            name: repoRespons.body?.name!,
            slug: repoRespons.body?.slug!,
            image: repoRespons.body?.image_url!
        }
        servHandler.body = productType;
        servHandler.isSucceed = true;
        servHandler.message = repoRespons.message;
        return servHandler;

    }

    public UpdateProductType = async (id: string, updateProduct: UpdateProductTypeDto) => {
        let servHandler: ServicesHandler<ProductTypeDto | null> = new ServicesHandler();
        logger.info("Try Update Product type in product services");

        logger.info("get Product By Id", { ProductId: id })

        const product: producttype | null = await productTypeRepository.GetProductById(id);
        if (product === null) {
            logger.error("product Cann't Add In database", { message: "Product Not Found" })
            servHandler.body = null;
            servHandler.isSucceed = false;
            servHandler.message = "Product Not Found";
            return servHandler;
        }

        if (updateProduct.image !== null) {

            const reuslt = await DeleteImageInSupabase(product.image_url!, process.env.PRODUCT_BUCKET!);

            if (reuslt.error) {
                logger.error("You Can't Delete This Image", { error: reuslt.error })
                servHandler = {
                    body: null,
                    isSucceed: false,
                    message: "Failed to Update image",
                    refreshToken: null
                }
                return servHandler;
            }
        }

        logger.info("Add New Product Info")
        const image = updateProduct.image;
        const fileName = `${Date.now()}_${image.originalname}`;
        const bucket = process.env.PRODUCT_BUCKET!;
        updateProduct.slug = slugify(updateProduct.name, { lower: true });

        logger.info("Add image To supabase and Return imageUrl To Add It in database");
        const { reuslt, imageUrl } = await SaveImageInSupabase(image, fileName, bucket);

        if (reuslt.error) {
            logger.error("You Can't Add this image", { error: reuslt.error })
            servHandler = {
                body: null,
                isSucceed: false,
                message: "Failed to upload image",
                refreshToken: null
            }
            return servHandler;
        }
        logger.info("image add in supabase succssfuly", { data: reuslt.data, imageUrl: imageUrl });

        const image_input: producttype = {
            producttype_id: product.producttype_id,
            name: (updateProduct === null) ? product.name : updateProduct.name,
            slug: updateProduct.slug,
            image_url: (imageUrl === null) ? product.image_url : imageUrl

        }

        logger.info("add Product To database", { image: image_input });
        const repoRespons: RepositoiesHandler<producttype | null> = await productTypeRepository.UpdateProductTypeToDatabase(image_input);
        if (!repoRespons.isSucceed) {
            logger.error("product Cann't Update In database", { message: repoRespons.message })
            servHandler.body = null;
            servHandler.isSucceed = false;
            servHandler.message = "There is an error, try again.";
            return servHandler;
        }


        logger.info("product Update succssfuly");
        const productType: ProductTypeDto = {
            productTypeId: repoRespons.body?.producttype_id!,
            name: repoRespons.body?.name!,
            slug: repoRespons.body?.slug!,
            image: repoRespons.body?.image_url!
        }
        servHandler.body = productType;
        servHandler.isSucceed = true;
        servHandler.message = repoRespons.message;
        return servHandler;

    }
    public DeleteProductType = async (id: string) => {
        let servHandler: ServicesHandler<ProductTypeDto | null> = new ServicesHandler();
        logger.info("Try Delete Product type in product services");

        logger.info("get Product By Id", { ProductId: id })

        const product: producttype | null = await productTypeRepository.GetProductById(id);
        if (product === null) {
            logger.error("product Cann't Add In database", { message: "Product Not Found" })
            servHandler.body = null;
            servHandler.isSucceed = false;
            servHandler.message = "Product Not Found";
            return servHandler;
        }
        const reuslt = await DeleteImageInSupabase(product.image_url!, process.env.PRODUCT_BUCKET!);
        if (reuslt.error) {
            logger.error("You Can't Delete This Image", { error: reuslt.error })
            servHandler = {
                body: null,
                isSucceed: false,
                message: "Failed to Delete image",
                refreshToken: null
            }
            return servHandler;
        }

        logger.info("delete image From database");

        const isDeleted: boolean = await productTypeRepository.DeleteProductTypeFromDatabase(id);

        if (!isDeleted) {
            logger.error("You Can't Delete This Image", { error: reuslt.error })
            servHandler = {
                body: null,
                isSucceed: false,
                message: "Failed to Delete image",
                refreshToken: null
            }
            return servHandler;
        }

        servHandler.body = null;
        servHandler.isSucceed = true;
        servHandler.message = "Product Delete Succssfuly";
        return servHandler;

    }
    public GetAllProductType = async () => {
        let servHandler: ServicesHandler<ProductTypeDto[] | null> = new ServicesHandler();
        logger.info("Try Get All Product type in product services");

        logger.info("get All product Types")

        const products: producttype[] | null = await productTypeRepository.GetProductTypes();
        if (products === null) {
            logger.error("product Cann't Add In database", { message: "Product Not Found" })
            servHandler.body = null;
            servHandler.isSucceed = false;
            servHandler.message = "Product Not Found";
            return servHandler;
        }

        const productTypes: ProductTypeDto[] = products.map(p => ({
            productTypeId: p.producttype_id!,
            name: p.name!,
            slug: p.slug!,
            image: p.image_url!
        }))

        servHandler.body = productTypes;
        servHandler.isSucceed = true;
        servHandler.message = "Product types found Succssfuly";
        return servHandler;
    }
    public GetProductTypeById = async (id: string) => {
        let servHandler: ServicesHandler<ProductTypeDto | null> = new ServicesHandler();
        logger.info("Try Get Product type by Id in product services");

        logger.info("get Product By Id", { ProductId: id })

        const product: producttype | null = await productTypeRepository.GetProductById(id);
        if (product === null) {
            logger.error("product Cann't Add In database", { message: "Product Not Found" })
            servHandler.body = null;
            servHandler.isSucceed = false;
            servHandler.message = "Product Not Found";
            return servHandler;
        }

        const productType: ProductTypeDto = {
            productTypeId: product.producttype_id!,
            name: product.name,
            slug: product.slug,
            image: product.image_url!
        }

        servHandler.body = productType;
        servHandler.isSucceed = true;
        servHandler.message = "Product Delete Succssfuly";
        return servHandler;
    }
}
export const productTypeServices: ProductTypeServices = new ProductTypeServices();