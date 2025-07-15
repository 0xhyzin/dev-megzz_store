import slugify from "slugify";
import { logger } from "../../utils/logger";
import { AddBrandTypeDto } from "../dtos/productDto/BrandType/AddBrandTypeDto";
import { BrandTypeDto } from "../dtos/productDto/BrandType/BrandTypeDto";
import { DeleteImageInSupabase, SaveImageInSupabase } from "../helpers/supperbase.connection";
import { ServicesHandler } from "../ServicesHandler";
import { RepositoiesHandler } from "../../dataAccess/RepositoiesHandler";
import { brandtype } from "@prisma/client";
import { brandTypeRepository } from "../../dataAccess/repositories/brand.repository";
import { BrandTypeCreateInput } from "../../dataAccess/models/product/brandType-create.input"; 
import { UpdateBrandTypeDto } from "../dtos/productDto/BrandType/UpdateBrandTypeDto";

class BrandTypeServices {
    public AddBrandType = async (newBrand: AddBrandTypeDto) => {
        let servHandler: ServicesHandler<BrandTypeDto | null> = new ServicesHandler();
        logger.info("Try add Brand type in product services");

        logger.info("change slug name");
        newBrand.slug = slugify(newBrand.name, { lower: true });

        const image = newBrand.image;
        const fileName = `${Date.now()}_${image.originalname}`;
        const bucket = 'brandimages';

        logger.info("Add image To supabase and Return imageUrl To Add It in database");
        const { reuslt, imageUrl } = await SaveImageInSupabase(newBrand.image, fileName, bucket);

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
        const image_input: BrandTypeCreateInput = {
            name: newBrand.name,
            slug: newBrand.slug,
            image_url: imageUrl
        }

        logger.info("add Brand To database", { image: image_input });
        const repoRespons: RepositoiesHandler<brandtype | null> = await brandTypeRepository.AddBrandTypeToDatabase(image_input);
        if (!repoRespons.isSucceed) {
            logger.error("brand Cann't Add In database", { message: repoRespons.message })
            servHandler.body = null;
            servHandler.isSucceed = false;
            servHandler.message = "There is an error, try again.";
            return servHandler;
        }


        logger.info("brand add to database succssfuly");
        const brandType: BrandTypeDto = {
            brandId: repoRespons.body?.brandtype_id!,
            name: repoRespons.body?.name!,
            slug: repoRespons.body?.slug!,
            image: repoRespons.body?.image_url!
        }
        servHandler.body = brandType;
        servHandler.isSucceed = true;
        servHandler.message = repoRespons.message;
        return servHandler;

    }

    public UpdateBrandType = async (id: string, updateBrand: UpdateBrandTypeDto) => {
        let servHandler: ServicesHandler<BrandTypeDto | null> = new ServicesHandler();
        logger.info("Try Update Brand type in product services");

        logger.info("get Brand By Id", { BrandId: id })

        const brand: brandtype | null = await brandTypeRepository.GetBrandById(id);
        if (brand === null) {
            logger.error("brand Cann't Add In database", { message: "Brand Not Found" })
            servHandler.body = null;
            servHandler.isSucceed = false;
            servHandler.message = "Brand Not Found";
            return servHandler;
        }

        if (updateBrand.image !== null) {

            const reuslt = await DeleteImageInSupabase(brand.image_url!, process.env.BRAND_BUCKET!);

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

        logger.info("Add New Brand Info")
        const image = updateBrand.image;
        const fileName = `${Date.now()}_${image.originalname}`;
        const bucket = process.env.BRAND_BUCKET!;
        updateBrand.slug = slugify(updateBrand.name, { lower: true });

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

        const image_input: brandtype = {
            brandtype_id: brand.brandtype_id,
            name: (updateBrand === null) ? brand.name : updateBrand.name,
            slug: updateBrand.slug,
            image_url: imageUrl
        }

        logger.info("add Brand To database", { image: image_input });
        const repoRespons: RepositoiesHandler<brandtype | null> = await brandTypeRepository.UpdateBrandTypeToDatabase(image_input);
        if (!repoRespons.isSucceed) {
            logger.error("brand Cann't Update In database", { message: repoRespons.message })
            servHandler.body = null;
            servHandler.isSucceed = false;
            servHandler.message = "There is an error, try again.";
            return servHandler;
        }


        logger.info("brand Update succssfuly");
        const brandType: BrandTypeDto = {
            brandId: repoRespons.body?.brandtype_id!,
            name: repoRespons.body?.name!,
            slug: repoRespons.body?.slug!,
            image: repoRespons.body?.image_url!
        }
        servHandler.body = brandType;
        servHandler.isSucceed = true;
        servHandler.message = repoRespons.message;
        return servHandler;

    }
    public DeleteBrandType = async (id: string) => {
        let servHandler: ServicesHandler<BrandTypeDto | null> = new ServicesHandler();
        logger.info("Try Delete Brand type in product services");

        logger.info("get Brand By Id", { BrandId: id })

        const brand: brandtype | null = await brandTypeRepository.GetBrandById(id);
        if (brand === null) {
            logger.error("brand Cann't Add In database", { message: "Brand Not Found" })
            servHandler.body = null;
            servHandler.isSucceed = false;
            servHandler.message = "Brand Not Found";
            return servHandler;
        }
        const reuslt = await DeleteImageInSupabase(brand.image_url!, process.env.BRAND_BUCKET!);
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

        const isDeleted: boolean = await brandTypeRepository.DeleteBrandTypeFromDatabase(id);

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
        servHandler.message = "Brand Delete Succssfuly";
        return servHandler;

    }
    public GetAllBrandType = async () => {
        let servHandler: ServicesHandler<BrandTypeDto[] | null> = new ServicesHandler();
        logger.info("Try Get All Brand type in product services");

        logger.info("get All brand Types")

        const brands: brandtype[] | null = await brandTypeRepository.GetBrandTypes();
        if (brands === null) {
            logger.error("brand Cann't Add In database", { message: "Brand Not Found" })
            servHandler.body = null;
            servHandler.isSucceed = false;
            servHandler.message = "Brand Not Found";
            return servHandler;
        }

        const brandTypes: BrandTypeDto[] = brands.map(p => ({
            brandId: p.brandtype_id!,
            name: p.name!,
            slug: p.slug!,
            image: p.image_url!
        }))

        servHandler.body = brandTypes;
        servHandler.isSucceed = true;
        servHandler.message = "Brand types found Succssfuly";
        return servHandler;
    }
    public GetBrandTypeById = async (id: string) => {
        let servHandler: ServicesHandler<BrandTypeDto | null> = new ServicesHandler();
        logger.info("Try Get Brand type by Id in product services");

        logger.info("get Brand By Id", { BrandId: id })

        const brand: brandtype | null = await brandTypeRepository.GetBrandById(id);
        if (brand === null) {
            logger.error("brand Cann't Add In database", { message: "Brand Not Found" })
            servHandler.body = null;
            servHandler.isSucceed = false;
            servHandler.message = "Brand Not Found";
            return servHandler;
        }

        const brandType: BrandTypeDto = {
            brandId: brand.brandtype_id!,
            name: brand.name,
            slug: brand.slug,
            image: brand.image_url!
        }

        servHandler.body = brandType;
        servHandler.isSucceed = true;
        servHandler.message = "Brand Delete Succssfuly";
        return servHandler;
    }
}
export const brandTypeServices: BrandTypeServices = new BrandTypeServices();