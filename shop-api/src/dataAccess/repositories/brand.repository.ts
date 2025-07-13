import { logger } from "../../utils/logger";
import { prisma } from "../database/data";
import { BrandTypeCreateInput } from "../models/product/brandType-create.input copy";
import { brandtype } from "@prisma/client";
import { RepositoiesHandler } from "../RepositoiesHandler";

class BrandTypeRepository {
    public AddBrandTypeToDatabase = async (newBrand: BrandTypeCreateInput) => {
        let repoHandler: RepositoiesHandler<brandtype> = new RepositoiesHandler();
        try {
            const brand: brandtype = await prisma.brandtype.create({
                data: {
                    name: newBrand.name,
                    slug: newBrand.slug,
                    image_url: newBrand.image_url
                }
            });

            if (brand === null) {
                throw Error("Can't add brand");
            }

            repoHandler = {
                isSucceed: true,
                body: brand,
                message: "Brand add Succssfuly"
            }
        } catch (er) {
            logger.error("error when add Brand in database", { error: er });
            repoHandler = {
                isSucceed: false,
                body: null,
                message: "Can't add brand try again"
            }
        }
        return repoHandler;

    }
    public GetBrandById = async (brandId: string) => {
        try {
            const brand: brandtype | null = await prisma.brandtype.findUnique({
                where: {
                    brandtype_id: brandId
                }
            });

            if (brand === null) {
                throw Error("Can't add brand");
            }
            return brand;
        } catch (er) {
            logger.error("error when add Brand in database", { error: er });

        }
        return null;
    }
    public UpdateBrandTypeToDatabase = async (updateBrand: brandtype) => {
        let repoHandler: RepositoiesHandler<brandtype> = new RepositoiesHandler();
        try {
            const brand: brandtype = await prisma.brandtype.update({
                where: {
                    brandtype_id: updateBrand.brandtype_id
                },
                data: {
                    name: updateBrand.name,
                    slug: updateBrand.slug,
                    image_url: updateBrand.image_url
                }
            });

            if (brand === null) {
                throw Error("Can't Update brand");
            }

            repoHandler = {
                isSucceed: true,
                body: brand,
                message: "Brand Update Succssfuly"
            }
        } catch (er) {
            logger.error("error when Update Brand in database", { error: er });
            repoHandler = {
                isSucceed: false,
                body: null,
                message: "Can't Update brand try again"
            }
        }
        return repoHandler;
    }
    public DeleteBrandTypeFromDatabase = async (brandId: string) => {
        try {
            const brand: brandtype | null = await prisma.brandtype.delete({
                where: {
                    brandtype_id: brandId
                }
            });

            if (brand === null) {
                throw Error("Can't Delete brand");
            }
            return true;
        } catch (er) {
            logger.error("error when Delete Brand From database", { error: er });

        }
        return false;
    }
    public GetBrandTypes = async () => {
        try {
            const brands: brandtype[] | null = await prisma.brandtype.findMany();

            if (brands === null) {
                throw Error("Can't Delete brand");
            }
            return brands;
        } catch (er) {
            logger.error("error when Delete Brand From database", { error: er });

        }
        return null;
    }

}
export const brandTypeRepository: BrandTypeRepository = new BrandTypeRepository();