import slugify from "slugify";
import { logger } from "../../utils/logger";
import { AddCategoryTypeDto } from "../dtos/productDto/CategoryType/AddCategoryTypeDto";
import { CategoryTypeDto } from "../dtos/productDto/CategoryType/CategoryTypeDto";
import { DeleteImageInSupabase, SaveImageInSupabase } from "../helpers/supperbase.connection";
import { ServicesHandler } from "../ServicesHandler";
import { RepositoiesHandler } from "../../dataAccess/RepositoiesHandler";
import { categorytype } from "@prisma/client";
import { categoryTypeRepository } from "../../dataAccess/repositories/categoryType.repository";
import { CategoryTypeCreateInput } from "../../dataAccess/models/product/categoryType-create.input copy 2";
import { UpdateCategoryTypeDto } from "../dtos/productDto/CategoryType/UpdateCategoryTypeDto"; 

class CategoryTypeServices {
    public AddCategoryType = async (newCategory: AddCategoryTypeDto) => {
        let servHandler: ServicesHandler<CategoryTypeDto | null> = new ServicesHandler();
        logger.info("Try add Category type in product services");

        logger.info("change slug name");
        newCategory.slug = slugify(newCategory.name, { lower: true });

        const image = newCategory.image;
        const fileName = `${Date.now()}_${image.originalname}`;
        const bucket = 'categoryimage';

        logger.info("Add image To supabase and Return imageUrl To Add It in database");
        const { reuslt, imageUrl } = await SaveImageInSupabase(newCategory.image, fileName, bucket);

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
        const image_input: CategoryTypeCreateInput = {
            name: newCategory.name,
            slug: newCategory.slug,
            image_url: imageUrl
        }

        logger.info("add Category To database", { image: image_input });
        const repoRespons: RepositoiesHandler<categorytype | null> = await categoryTypeRepository.AddCategoryTypeToDatabase(image_input);
        if (!repoRespons.isSucceed) {
            logger.error("category Cann't Add In database", { message: repoRespons.message })
            servHandler.body = null;
            servHandler.isSucceed = false;
            servHandler.message = "There is an error, try again.";
            return servHandler;
        }


        logger.info("category add to database succssfuly");
        const categoryType: CategoryTypeDto = {
            categoryId: repoRespons.body?.categorytype_id!,
            name: repoRespons.body?.name!,
            slug: repoRespons.body?.slug!,
            image: repoRespons.body?.image_url!
        }
        servHandler.body = categoryType;
        servHandler.isSucceed = true;
        servHandler.message = repoRespons.message;
        return servHandler;

    }

    public UpdateCategoryType = async (id: string, updateCategory: UpdateCategoryTypeDto) => {
        let servHandler: ServicesHandler<CategoryTypeDto | null> = new ServicesHandler();
        logger.info("Try Update Category type in product services");

        logger.info("get Category By Id", { CategoryId: id })

        const category: categorytype | null = await categoryTypeRepository.GetCategoryById(id);
        if (category === null) {
            logger.error("category Cann't Add In database", { message: "Category Not Found" })
            servHandler.body = null;
            servHandler.isSucceed = false;
            servHandler.message = "Category Not Found";
            return servHandler;
        }

        if (updateCategory.image !== null) {

            const reuslt = await DeleteImageInSupabase(category.image_url!, process.env.CATEGORY_BUCKET!);

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

        logger.info("Add New Category Info")
        const image = updateCategory.image;
        const fileName = `${Date.now()}_${image.originalname}`;
        const bucket = process.env.CATEGORY_BUCKET!;
        updateCategory.slug = slugify(updateCategory.name, { lower: true });

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

        const image_input: categorytype = {
            categorytype_id: category.categorytype_id,
            name: (updateCategory === null) ? category.name : updateCategory.name,
            slug: updateCategory.slug,
            image_url: imageUrl
        }

        logger.info("add Category To database", { image: image_input });
        const repoRespons: RepositoiesHandler<categorytype | null> = await categoryTypeRepository.UpdateCategoryTypeToDatabase(image_input);
        if (!repoRespons.isSucceed) {
            logger.error("category Cann't Update In database", { message: repoRespons.message })
            servHandler.body = null;
            servHandler.isSucceed = false;
            servHandler.message = "There is an error, try again.";
            return servHandler;
        }


        logger.info("category Update succssfuly");
        const categoryType: CategoryTypeDto = {
            categoryId: repoRespons.body?.categorytype_id!,
            name: repoRespons.body?.name!,
            slug: repoRespons.body?.slug!,
            image: repoRespons.body?.image_url!
        }
        servHandler.body = categoryType;
        servHandler.isSucceed = true;
        servHandler.message = repoRespons.message;
        return servHandler;

    }
    public DeleteCategoryType = async (id: string) => {
        let servHandler: ServicesHandler<CategoryTypeDto | null> = new ServicesHandler();
        logger.info("Try Delete Category type in product services");

        logger.info("get Category By Id", { CategoryId: id })

        const category: categorytype | null = await categoryTypeRepository.GetCategoryById(id);
        if (category === null) {
            logger.error("category Cann't Add In database", { message: "Category Not Found" })
            servHandler.body = null;
            servHandler.isSucceed = false;
            servHandler.message = "Category Not Found";
            return servHandler;
        }
        const reuslt = await DeleteImageInSupabase(category.image_url!, process.env.CATEGORY_BUCKET!);
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

        const isDeleted: boolean = await categoryTypeRepository.DeleteCategoryTypeFromDatabase(id);

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
        servHandler.message = "Category Delete Succssfuly";
        return servHandler;

    }
    public GetAllCategoryType = async () => {
        let servHandler: ServicesHandler<CategoryTypeDto[] | null> = new ServicesHandler();
        logger.info("Try Get All Category type in product services");

        logger.info("get All category Types")

        const categorys: categorytype[] | null = await categoryTypeRepository.GetCategoryTypes();
        if (categorys === null) {
            logger.error("category Cann't Add In database", { message: "Category Not Found" })
            servHandler.body = null;
            servHandler.isSucceed = false;
            servHandler.message = "Category Not Found";
            return servHandler;
        }

        const categoryTypes: CategoryTypeDto[] = categorys.map(p => ({
            categoryId: p.categorytype_id!,
            name: p.name!,
            slug: p.slug!,
            image: p.image_url!
        }))

        servHandler.body = categoryTypes;
        servHandler.isSucceed = true;
        servHandler.message = "Category types found Succssfuly";
        return servHandler;
    }
    public GetCategoryTypeById = async (id: string) => {
        let servHandler: ServicesHandler<CategoryTypeDto | null> = new ServicesHandler();
        logger.info("Try Get Category type by Id in product services");

        logger.info("get Category By Id", { CategoryId: id })

        const category: categorytype | null = await categoryTypeRepository.GetCategoryById(id);
        if (category === null) {
            logger.error("category Cann't Add In database", { message: "Category Not Found" })
            servHandler.body = null;
            servHandler.isSucceed = false;
            servHandler.message = "Category Not Found";
            return servHandler;
        }

        const categoryType: CategoryTypeDto = {
            categoryId: category.categorytype_id!,
            name: category.name,
            slug: category.slug,
            image: category.image_url!
        }

        servHandler.body = categoryType;
        servHandler.isSucceed = true;
        servHandler.message = "Category Delete Succssfuly";
        return servHandler;
    }
}
export const categoryTypeServices: CategoryTypeServices = new CategoryTypeServices();