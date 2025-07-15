import { Request, Response } from "express";
import { logger } from "../../utils/logger";
import { ServicesHandler } from "../../business/ServicesHandler";
import { productVariantServices } from "../../business/services/productVariant.service";
import { AddProductVariantDto } from "../../business/dtos/productDto/ProductVariant/AddProductVariantDto";
import { ProductVariantDto } from "../../business/dtos/productDto/ProductVariant/ProductVariantDto";
import { UpdateProductVariantDto } from "../../business/dtos/productDto/ProductVariant/UpdateProductDto";

class ProductVariantController {
    public AddProductVariant = async (req: Request, res: Response) => {
        const { productId, price, stock, colorName, sizeValue } = req.body;

        const images = req.files as Express.Multer.File[];
        const addProductVariantDto: AddProductVariantDto = {
            product_id: productId,
            price: Number(price),
            stock: Number(stock),
            color_name: colorName,
            size_value: sizeValue,
            images: images || []
        };
        const servRespons: ServicesHandler<ProductVariantDto | null> = await productVariantServices.AddProductVariant(addProductVariantDto);
        if (!servRespons.isSucceed) {
            logger.error("login faild");
            res.status(400).send({ message: servRespons.message });
        }
        res.status(200).send(servRespons.body)

    }

    public UpdateProductVariant = async (req: Request, res: Response) => {
        const id = req.params.id;
        const { productId, price, stock, colorName, sizeValue } = req.body;

        const images = req.files as Express.Multer.File[];
        const updateProductVariantDto: UpdateProductVariantDto = {
            product_id: productId,
            price: Number(price),
            stock: Number(stock),
            color_name: colorName,
            size_value: sizeValue,
            images: images || []
        };

        const servRespons: ServicesHandler<ProductVariantDto | null> = await productVariantServices.UpdateProductVariant(id, updateProductVariantDto);
        if (!servRespons.isSucceed) {
            logger.error("login faild");
            res.status(400).send({ message: servRespons.message });
        }
        res.status(200).send(servRespons.body)
    }

    public DeleteProductVariant = async (req: Request, res: Response) => {
        const id = req.params.id;

        const servRespons: ServicesHandler<boolean | null> = await productVariantServices.DeleteProductVariant(id);
        if (!servRespons.isSucceed) {
            logger.error("login faild");
            res.status(400).send({ message: servRespons.message });
        }
        res.status(200).send({ isSuccssfuly: servRespons.isSucceed, message: "Deleted product variant Succssfuly" })
    }

    public GetAllProductVariant = async (req: Request, res: Response) => {

        const servRespons: ServicesHandler<ProductVariantDto[] | null> = await productVariantServices.GetAllProductVariant();
        if (!servRespons.isSucceed) {
            logger.error("login faild");
            res.status(400).send({ message: servRespons.message });
        }
        res.status(200).send(servRespons.body)
    }
    public GetProductVariantById = async (req: Request, res: Response) => {
        const id = req.params.id;

        const servRespons: ServicesHandler<ProductVariantDto | ProductVariantDto[] | null> = await productVariantServices.GetProductVariantById(id)
        if (!servRespons.isSucceed) {
            logger.error("login faild");
            res.status(400).send({ message: servRespons.message });
        }
        res.status(200).send(servRespons.body)
    }
}
export const productVariantController: ProductVariantController = new ProductVariantController(); 