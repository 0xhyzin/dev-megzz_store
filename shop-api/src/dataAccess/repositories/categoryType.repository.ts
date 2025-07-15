import { logger } from "../../utils/logger";
import { prisma } from "../database/data";
import { CategoryTypeCreateInput } from "../models/product/categoryType-create.input"; 
import { categorytype } from "@prisma/client";
import { RepositoiesHandler } from "../RepositoiesHandler";

class CategoryTypeRepository {
    public AddCategoryTypeToDatabase = async (newCategory: CategoryTypeCreateInput) => {
        let repoHandler: RepositoiesHandler<categorytype> = new RepositoiesHandler();
        try {
            const category: categorytype = await prisma.categorytype.create({
                data: {
                    name: newCategory.name,
                    slug: newCategory.slug,
                    image_url: newCategory.image_url
                }
            });

            if (category === null) {
                throw Error("Can't add category");
            }

            repoHandler = {
                isSucceed: true,
                body: category,
                message: "Category add Succssfuly"
            }
        } catch (er) {
            logger.error("error when add Category in database", { error: er });
            repoHandler = {
                isSucceed: false,
                body: null,
                message: "Can't add category try again"
            }
        }
        return repoHandler;

    }
    public GetCategoryById = async (categoryId: string) => {
        try {
            const category: categorytype | null = await prisma.categorytype.findUnique({
                where: {
                    categorytype_id: categoryId
                }
            });

            if (category === null) {
                throw Error("Can't add category");
            }
            return category;
        } catch (er) {
            logger.error("error when add Category in database", { error: er });

        }
        return null;
    }
    public UpdateCategoryTypeToDatabase = async (updateCategory: categorytype) => {
        let repoHandler: RepositoiesHandler<categorytype> = new RepositoiesHandler();
        try {
            const category: categorytype = await prisma.categorytype.update({
                where: {
                    categorytype_id: updateCategory.categorytype_id
                },
                data: {
                    name: updateCategory.name,
                    slug: updateCategory.slug,
                    image_url: updateCategory.image_url
                }
            });

            if (category === null) {
                throw Error("Can't Update category");
            }

            repoHandler = {
                isSucceed: true,
                body: category,
                message: "Category Update Succssfuly"
            }
        } catch (er) {
            logger.error("error when Update Category in database", { error: er });
            repoHandler = {
                isSucceed: false,
                body: null,
                message: "Can't Update category try again"
            }
        }
        return repoHandler;
    }
    public DeleteCategoryTypeFromDatabase = async (categoryId: string) => {
        try {
            const category: categorytype | null = await prisma.categorytype.delete({
                where: {
                    categorytype_id: categoryId
                }
            });

            if (category === null) {
                throw Error("Can't Delete category");
            }
            return true;
        } catch (er) {
            logger.error("error when Delete Category From database", { error: er });

        }
        return false;
    }
    public GetCategoryTypes = async () => {
        try {
            const categorys: categorytype[] | null = await prisma.categorytype.findMany();

            if (categorys === null) {
                throw Error("Can't Delete category");
            }
            return categorys;
        } catch (er) {
            logger.error("error when Delete Category From database", { error: er });

        }
        return null;
    }

}
export const categoryTypeRepository: CategoryTypeRepository = new CategoryTypeRepository();