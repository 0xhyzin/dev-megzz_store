import { Request, Response } from "express";
import { AddBrandTypeDto } from "../../business/dtos/productDto/BrandType/AddBrandTypeDto";
import { BrandTypeDto } from "../../business/dtos/productDto/BrandType/BrandTypeDto";
import { logger } from "../../utils/logger";
import { ServicesHandler } from "../../business/ServicesHandler";
import { brandTypeServices } from "../../business/services/brandType.service";
import { UpdateBrandTypeDto } from "../../business/dtos/productDto/BrandType/UpdateBrandTypeDto";

class BrandTypeController {

    public AddBrandType = async (req: Request, res: Response) => {
        const { name } = req.body;
        const image: Express.Multer.File = req.file!;
        const addBrandTypeDto: AddBrandTypeDto = {
            name: name,
            image: image,
            slug: "",
        };
        const servRespons: ServicesHandler<BrandTypeDto | null> = await brandTypeServices.AddBrandType(addBrandTypeDto);
        if (!servRespons.isSucceed) {
            logger.error("login faild");
            res.status(400).send({ message: servRespons.message });
        }
        res.status(200).send(servRespons.body)

    }

    public UpdateBrandType = async (req: Request, res: Response) => {
        const id = req.params.id;
        const { name } = req.body;
        const image: Express.Multer.File = req.file!;

        const updateBrandTypeDto: UpdateBrandTypeDto = {
            name: name,
            image: image,
            slug: "",
        };

        const servRespons: ServicesHandler<BrandTypeDto | null> = await brandTypeServices.UpdateBrandType(id, updateBrandTypeDto);
        if (!servRespons.isSucceed) {
            logger.error("login faild");
            res.status(400).send({ message: servRespons.message });
        }
        res.status(200).send(servRespons.body)
    }

    public DeleteBrandType = async (req: Request, res: Response) => {
        const id = req.params.id;

        const servRespons: ServicesHandler<BrandTypeDto | null> = await brandTypeServices.DeleteBrandType(id);
        if (!servRespons.isSucceed) {
            logger.error("login faild");
            res.status(400).send({ message: servRespons.message });
        }
        res.status(200).send({ isSuccssfuly: servRespons.isSucceed, message: servRespons.message })
    }

    public GetBrandType = async (req: Request, res: Response) => {

        const servRespons: ServicesHandler<BrandTypeDto[] | null> = await brandTypeServices.GetAllBrandType();
        if (!servRespons.isSucceed) {
            logger.error("login faild");
            res.status(400).send({ message: servRespons.message });
        }
        res.status(200).send(servRespons.body)
    }
    public GetBrandTypeById = async (req: Request, res: Response) => {
        const id = req.params.id;

        const servRespons: ServicesHandler<BrandTypeDto | BrandTypeDto[] | null> = await brandTypeServices.GetBrandTypeById(id)
        if (!servRespons.isSucceed) {
            logger.error("login faild");
            res.status(400).send({ message: servRespons.message });
        }
        res.status(200).send(servRespons.body)
    }


}
export const brandTypeController: BrandTypeController = new BrandTypeController();