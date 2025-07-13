import { Request, Response } from "express";
import { AddCategoryTypeDto } from "../../business/dtos/productDto/CategoryType/AddCategoryTypeDto";
import { CategoryTypeDto } from "../../business/dtos/productDto/CategoryType/CategoryTypeDto";
import { logger } from "../../utils/logger";
import { ServicesHandler } from "../../business/ServicesHandler";
import { categoryTypeServices } from "../../business/services/categoryType.service";
import { UpdateCategoryTypeDto } from "../../business/dtos/productDto/CategoryType/UpdateCategoryTypeDto";

class CategoryTypeController {

    public AddCategoryType = async (req: Request, res: Response) => {
        const { name } = req.body;
        const image: Express.Multer.File = req.file!;
        const addCategoryTypeDto: AddCategoryTypeDto = {
            name: name,
            image: image,
            slug: "",
        };
        const servRespons: ServicesHandler<CategoryTypeDto | null> = await categoryTypeServices.AddCategoryType(addCategoryTypeDto);
        if (!servRespons.isSucceed) {
            logger.error("login faild");
            res.status(400).send({ message: servRespons.message });
        }
        res.status(200).send(servRespons.body)

    }

    public UpdateCategoryType = async (req: Request, res: Response) => {
        const id = req.params.id;
        const { name } = req.body;
        const image: Express.Multer.File = req.file!;

        const updateCategoryTypeDto: UpdateCategoryTypeDto = {
            name: name,
            image: image,
            slug: "",
        };

        const servRespons: ServicesHandler<CategoryTypeDto | null> = await categoryTypeServices.UpdateCategoryType(id, updateCategoryTypeDto);
        if (!servRespons.isSucceed) {
            logger.error("login faild");
            res.status(400).send({ message: servRespons.message });
        }
        res.status(200).send(servRespons.body)
    }

    public DeleteCategoryType = async (req: Request, res: Response) => {
        const id = req.params.id;

        const servRespons: ServicesHandler<CategoryTypeDto | null> = await categoryTypeServices.DeleteCategoryType(id);
        if (!servRespons.isSucceed) {
            logger.error("login faild");
            res.status(400).send({ message: servRespons.message });
        }
        res.status(200).send({ isSuccssfuly: servRespons.isSucceed, message: servRespons.message })
    }

    public GetCategoryType = async (req: Request, res: Response) => {

        const servRespons: ServicesHandler<CategoryTypeDto[] | null> = await categoryTypeServices.GetAllCategoryType();
        if (!servRespons.isSucceed) {
            logger.error("login faild");
            res.status(400).send({ message: servRespons.message });
        }
        res.status(200).send(servRespons.body)
    }
    public GetCategoryTypeById = async (req: Request, res: Response) => {
        const id = req.params.id;

        const servRespons: ServicesHandler<CategoryTypeDto | CategoryTypeDto[] | null> = await categoryTypeServices.GetCategoryTypeById(id)
        if (!servRespons.isSucceed) {
            logger.error("login faild");
            res.status(400).send({ message: servRespons.message });
        }
        res.status(200).send(servRespons.body)
    }


}
export const categoryTypeController: CategoryTypeController = new CategoryTypeController();