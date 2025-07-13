import { Request, Response } from "express";
import { AddProductTypeDto } from "../../business/dtos/productDto/ProductType/AddProductTypeDto";
import { ProductTypeDto } from "../../business/dtos/productDto/ProductType/ProductTypeDto";
import { logger } from "../../utils/logger";
import { ServicesHandler } from "../../business/ServicesHandler";
import { productTypeServices } from "../../business/services/productType.service";
import { UpdateProductTypeDto } from "../../business/dtos/productDto/ProductType/UpdateProductTypeDto"; 
class ProductTypeController {

    public AddProductType = async (req: Request, res: Response) => {
        const { name } = req.body;
        const image: Express.Multer.File = req.file!;
        const addProductTypeDto: AddProductTypeDto = {
            name: name,
            image: image,
            slug: "",
        };
        const servRespons: ServicesHandler<ProductTypeDto | null> = await productTypeServices.AddProductType(addProductTypeDto);
        if (!servRespons.isSucceed) {
            logger.error("login faild");
            res.status(400).send({ message: servRespons.message });
        }
        res.status(200).send(servRespons.body)

    }

    public UpdateProductType = async (req: Request, res: Response) => {
        const id = req.params.id;
        const { name } = req.body;
        const image: Express.Multer.File = req.file!;

        const updateProductTypeDto: UpdateProductTypeDto = {
            name: name,
            image: image,
            slug: "",
        };

        const servRespons: ServicesHandler<ProductTypeDto | null> = await productTypeServices.UpdateProductType(id, updateProductTypeDto);
        if (!servRespons.isSucceed) {
            logger.error("login faild");
            res.status(400).send({ message: servRespons.message });
        }
        res.status(200).send(servRespons.body)
    }

    public DeleteProductType = async (req: Request, res: Response) => {
        const id = req.params.id;

        const servRespons: ServicesHandler<ProductTypeDto | null> = await productTypeServices.DeleteProductType(id);
        if (!servRespons.isSucceed) {
            logger.error("login faild");
            res.status(400).send({ message: servRespons.message });
        }
        res.status(200).send({ isSuccssfuly: servRespons.isSucceed, message: servRespons.message })
    }

    public GetProductType = async (req: Request, res: Response) => {

        const servRespons: ServicesHandler<ProductTypeDto[] | null> = await productTypeServices.GetAllProductType();
        if (!servRespons.isSucceed) {
            logger.error("login faild");
            res.status(400).send({ message: servRespons.message });
        }
        res.status(200).send(servRespons.body)
    }
    public GetProductTypeById = async (req: Request, res: Response) => {
        const id = req.params.id;

        const servRespons: ServicesHandler<ProductTypeDto | ProductTypeDto[] | null> = await productTypeServices.GetProductTypeById(id)
        if (!servRespons.isSucceed) {
            logger.error("login faild");
            res.status(400).send({ message: servRespons.message });
        }
        res.status(200).send(servRespons.body)
    }


}
export const productTypeController: ProductTypeController = new ProductTypeController();