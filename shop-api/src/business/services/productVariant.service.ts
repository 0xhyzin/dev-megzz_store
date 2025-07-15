import { logger } from "../../utils/logger";
import { AddProductVariantDto } from "../dtos/productDto/ProductVariant/AddProductVariantDto";
import { ProductVariantDto } from "../dtos/productDto/ProductVariant/ProductVariantDto";
import { UpdateProductVariantDto } from "../dtos/productDto/ProductVariant/UpdateProductDto";
import { ServicesHandler } from "../ServicesHandler";
import { RepositoiesHandler } from "../../dataAccess/RepositoiesHandler";
import { color, Prisma, product, productvariant } from "@prisma/client";
import { productVariantRepository } from "../../dataAccess/repositories/productVariant.repository";
import { createPublicBucket, DeleteImageInSupabase, ensureBucketExists, SaveImageInSupabase } from "../helpers/supperbase.connection";
import { ProductVariantCreateInput } from "../../dataAccess/models/product/productVariant-create.input";
import slugify from "slugify";
import { ColoreCreateInput } from "../../dataAccess/models/product/color-create.input";
import { SizeCreateInput } from "../../dataAccess/models/product/size-create.input";
import { ImageCreateInput } from "../../dataAccess/models/product/image-create.input";
import { ProductVariantWithRelations } from "../../dataAccess/models/Custom Types/productVariantWithInclude";

class ProductVariantService {
    public AddProductVariant = async (newVariant: AddProductVariantDto) => {
        let servHandler: ServicesHandler<ProductVariantDto | null> = new ServicesHandler();
        logger.info("Try add Product variant in product services");

        logger.info("check is Product exist By id");
        const theProduct: product | null = await productVariantRepository.GetProductById(newVariant.product_id);
        if (theProduct === null) {
            logger.error("Not Found", { message: "Product Not Found" })
            servHandler.body = null;
            servHandler.isSucceed = false;
            servHandler.message = "Product Not Found";
            return servHandler;
        }


        logger.info("Start add Color");
        const newColor: ColoreCreateInput = {
            name: newVariant.color_name!,
            slug: slugify(newVariant.color_name, { lower: true }),
        }

        const color_id = await productVariantRepository.ColorIsExist(newColor.name) ?? await productVariantRepository.AddColorAndReturnColorId(newColor);

        if (color_id === null) {
            logger.error("color id not return")
            servHandler.body = null;
            servHandler.isSucceed = false;
            servHandler.message = "some thing wrong";
            return servHandler;
        }

        logger.info("Start add Size");
        const newSize: SizeCreateInput = {
            value: newVariant.size_value
        }
        const size_id = await productVariantRepository.SizeIsExist(newSize.value) ?? await productVariantRepository.AddSizeAndReturnSizeId(newSize);

        if (size_id === null) {
            logger.error("size id not return")
            servHandler.body = null;
            servHandler.isSucceed = false;
            servHandler.message = "some thing wrong";
            return servHandler;
        }

        logger.info("Add image in supabase and Database");
        if (newVariant.images.length < 1) {
            logger.error("Must Add Images")
            servHandler.body = null;
            servHandler.isSucceed = false;
            servHandler.message = "Must Add Images";
            return servHandler;
        }


        logger.info("Add Product Variant in database ");
        const productVariant_create: ProductVariantCreateInput = {
            product_id: newVariant.product_id,
            price: newVariant.price,
            stock: newVariant.stock,
            color_id: color_id!,
            size_id: size_id!
        }
        const productVariant: ProductVariantWithRelations | null = await productVariantRepository.AddProductVariantToDatabase(productVariant_create);
        if (!productVariant) {
            logger.error("Error When Add Product Variant")
            servHandler.body = null;
            servHandler.isSucceed = false;
            servHandler.message = "Add Product Variant Error";
            return servHandler;
        }

        const bucketName = slugify(theProduct.name, { lower: true });

        if (!await ensureBucketExists(bucketName)) {
            logger.info(`Created public bucket: ${bucketName}`);
            await createPublicBucket(bucketName);
        } else {
            logger.info(`Bucket already exists: ${bucketName}`);
        }

        for (let image of newVariant.images) {

            const fileName = `${Date.now()}_${image.originalname}`;

            logger.info("Add image To supabase and Return imageUrl To Add It in database");
            const { reuslt, imageUrl } = await SaveImageInSupabase(image, fileName, bucketName);

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
            const image_input: ImageCreateInput = {
                productVariant_Id: productVariant.productvariant_id,
                url: imageUrl,
                isprimary: (newVariant.images[0] === image) ? true : false,
            }
            const image_id = await productVariantRepository.addImageAndReturnId(image_input);
            if (image_id === null) {
                servHandler = {
                    body: null,
                    isSucceed: false,
                    message: "Failed to upload image",
                    refreshToken: null
                }
                return servHandler;
            }
        }

        const images_url = await productVariantRepository.GetProductImages(productVariant.productvariant_id)
        if (images_url === null) {
            servHandler = {
                body: null,
                isSucceed: false,
                message: "Failed to upload image",
                refreshToken: null
            }
            return servHandler;
        }

        const productVariantDto: ProductVariantDto = {
            productvariant_id: productVariant.productvariant_id,
            product_id: productVariant.product_id,
            color: productVariant.color.name,
            size: productVariant.size.value,
            price: productVariant.price.toString(),
            stock: productVariant.stock,
            imagesUrl: images_url.map((i) => ({ url: i.url })),
        }
        servHandler.body = productVariantDto;
        servHandler.isSucceed = true;
        servHandler.message = "Product Variant Add Succssfuly";
        return servHandler;

    };
    public UpdateProductVariant = async (id: string, updateVariant: UpdateProductVariantDto) => {
        let servHandler: ServicesHandler<ProductVariantDto | null> = new ServicesHandler();
        logger.info("Try update Product variant in product services");

        logger.info("Fetch existing product variant by id");
        const existingVariant: any = await productVariantRepository.GetProductVariantById(id);
        if (!existingVariant) {
            logger.error("Not Found", { message: "Product Variant Not Found" })
            servHandler.body = null;
            servHandler.isSucceed = false;
            servHandler.message = "Product Variant Not Found";
            return servHandler;
        }


        logger.info("Fetch product for bucket name");
        const theProduct: product | null = await productVariantRepository.GetProductById(updateVariant.product_id || existingVariant.product_id);
        if (theProduct === null) {
            logger.error("Not Found", { message: "Product Not Found" })
            servHandler.body = null;
            servHandler.isSucceed = false;
            servHandler.message = "Product Not Found";
            return servHandler;
        }


        let color_id = existingVariant.color_id;
        if (updateVariant.color_name && updateVariant.color_name.trim() !== "") {
            logger.info("Start add Color");
            const newColor: ColoreCreateInput = {
                name: updateVariant.color_name,
                slug: slugify(updateVariant.color_name, { lower: true }),
            }
            color_id = await productVariantRepository.ColorIsExist(newColor.name) ?? await productVariantRepository.AddColorAndReturnColorId(newColor);
            if (color_id === null) {
                logger.error("color id not return")
                servHandler.body = null;
                servHandler.isSucceed = false;
                servHandler.message = "some thing wrong";
                return servHandler;
            }
        }

        // Handle size
        let size_id = existingVariant.size_id;
        if (updateVariant.size_value && updateVariant.size_value.trim() !== "") {
            logger.info("Start add Size");
            const newSize: SizeCreateInput = {
                value: updateVariant.size_value
            }
            size_id = await productVariantRepository.SizeIsExist(newSize.value) ?? await productVariantRepository.AddSizeAndReturnSizeId(newSize);
            if (size_id === null) {
                logger.error("size id not return")
                servHandler.body = null;
                servHandler.isSucceed = false;
                servHandler.message = "some thing wrong";
                return servHandler;
            }
        }


        const productVariant_update: ProductVariantCreateInput = {
            product_id: updateVariant.product_id || existingVariant.product_id,
            price: updateVariant.price ?? existingVariant.price,
            stock: updateVariant.stock ?? existingVariant.stock,
            color_id: color_id,
            size_id: size_id
        }


        logger.info("Update Product Variant in database");
        const updatedVariant: ProductVariantWithRelations | null = await productVariantRepository.UpdateProductVariantToDatabase(id, productVariant_update);
        if (!updatedVariant) {
            logger.error("Error When Update Product Variant")
            servHandler.body = null;
            servHandler.isSucceed = false;
            servHandler.message = "Update Product Variant Error";
            return servHandler;
        }

        let images_url = await productVariantRepository.GetProductImages(updatedVariant.productvariant_id);
        const bucketName = slugify(theProduct.name, { lower: true });
        logger.info("Update images: delete old and add new");
        for (let img of images_url || []) {
            logger.info("Delete ",{images_url:img.url});
            logger.info("Delete ",{images_url:img.url});
            logger.info("Delete ",{images_url:img.url});
            logger.info("Delete ",{images_url:img.url});
            logger.info("Delete ",{images_url:img.url});

            let data = await DeleteImageInSupabase(img.url, bucketName)
            let isDeleteFromDatabase =await productVariantRepository.DeleteImageFromDatabase(img.url)
            if (data.error || !isDeleteFromDatabase) {
                servHandler = {
                    body: null,
                    isSucceed: false,
                    message: "Failed to upload image",
                    refreshToken: null
                }
                return servHandler;
            }
        }

        for (let image of updateVariant.images) {
            const fileName = `${Date.now()}_${image.originalname}`;
            logger.info("Add image To supabase and Return imageUrl To Add It in database");
            const { reuslt, imageUrl } = await SaveImageInSupabase(image, fileName, bucketName);
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
            const image_input: ImageCreateInput = {
                productVariant_Id: updatedVariant.productvariant_id,
                url: imageUrl,
                isprimary: (updateVariant.images[0] === image) ? true : false,
            }
            const image_id = await productVariantRepository.addImageAndReturnId(image_input);
            if (image_id === null) {
                servHandler = {
                    body: null,
                    isSucceed: false,
                    message: "Failed to upload image",
                    refreshToken: null
                }
                return servHandler;
            }
            images_url = await productVariantRepository.GetProductImages(updatedVariant.productvariant_id);
        }

        const productVariantDto: ProductVariantDto = {
            productvariant_id: updatedVariant.productvariant_id,
            product_id: updatedVariant.product_id,
            color: updatedVariant.color.name,
            size: updatedVariant.size.value,
            price: updatedVariant.price.toString(),
            stock: updatedVariant.stock,
            imagesUrl: (images_url || []).map((i) => ({ url: i.url })),
        }
        servHandler.body = productVariantDto;
        servHandler.isSucceed = true;
        servHandler.message = "Product Variant Updated Successfully";
        return servHandler;
    }

    public DeleteProductVariant = async (id: string) => { };
    public GetAllProductVariant = async () => { };
    public GetProductVariantById = async (id: string) => { };
}
export const productVariantServices: ProductVariantService = new ProductVariantService(); 