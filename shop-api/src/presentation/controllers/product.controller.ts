import { Request, Response } from "express";
import { AddProductDto } from "../../business/dtos/productDto/Product/AddProductDto";
import { ProductDto } from "../../business/dtos/productDto/Product/ProductDto";
import { logger } from "../../utils/logger";
import { ServicesHandler } from "../../business/ServicesHandler";
import { productServices } from "../../business/services/product.service"; 
import { UpdateProductDto } from "../../business/dtos/productDto/Product/UpdateProductDto";
class ProductController {

    public AddProduct = async (req: Request, res: Response) => {
        const { name, description, isActive, brandtypeId, categorytypeId, producttypeId } = req.body;
        const addProductDto: AddProductDto = {
            name: name,
            slug: "",
            description: description,
            isactive: isActive,
            brandtype_id: brandtypeId,
            categorytype_id: categorytypeId,
            producttype_id: producttypeId
        };

        const servRespons: ServicesHandler<ProductDto | null> = await productServices.AddProduct(addProductDto);
        if (!servRespons.isSucceed) {
            logger.error("Add Product faild");
            res.status(400).send({ message: servRespons.message });
        }
        res.status(200).send(servRespons.body)

    }

    public UpdateProduct = async (req: Request, res: Response) => {
        const id = req.params.id;
        const { name, description, isActive, brandtypeId, categorytypeId, producttypeId } = req.body;
        const updateProductDto: UpdateProductDto = {
            name: name,
            slug: "",
            description: description,
            isactive: isActive,
            brandtype_id: brandtypeId,
            categorytype_id: categorytypeId,
            producttype_id: producttypeId
        };

        const servRespons: ServicesHandler<ProductDto | null> = await productServices.UpdateProduct(id, updateProductDto);
        if (!servRespons.isSucceed) {
            logger.error("Update Product faild");
            res.status(400).send({ message: servRespons.message });
        }
        res.status(200).send(servRespons.body)
    }

    public DeleteProduct = async (req: Request, res: Response) => {
        const id = req.params.id;

        const servRespons: ServicesHandler<ProductDto | null> = await productServices.DeleteProduct(id);
        if (!servRespons.isSucceed) {
            logger.error("Delete Product faild");
            res.status(400).send({ message: servRespons.message });
        }
        res.status(200).send({ isSuccssfuly: servRespons.isSucceed, message: servRespons.message })
    }

    public GetProduct = async (req: Request, res: Response) => {

        const servRespons: ServicesHandler<ProductDto[] | null> = await productServices.GetAllProduct();
        if (!servRespons.isSucceed) {
            logger.error("Get Products faild");
            res.status(400).send({ message: servRespons.message });
        }
        res.status(200).send(servRespons.body)
    }
    public GetProductById = async (req: Request, res: Response) => {
        const id = req.params.id;

        const servRespons: ServicesHandler<ProductDto | ProductDto[] | null> = await productServices.GetProductById(id)
        if (!servRespons.isSucceed) {
            logger.error("Get Product By Id faild");
            res.status(400).send({ message: servRespons.message });
        }
        res.status(200).send(servRespons.body)
    }


}
export const productController: ProductController = new ProductController();