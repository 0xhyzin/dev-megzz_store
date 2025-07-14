import slugify from "slugify";
import { logger } from "../../utils/logger";
import { AddProductDto } from "../dtos/productDto/Product/AddProductDto";
import { ProductDto } from "../dtos/productDto/Product/ProductDto";
import { DeleteImageInSupabase, SaveImageInSupabase } from "../helpers/supperbase.connection";
import { ServicesHandler } from "../ServicesHandler";
import { RepositoiesHandler } from "../../dataAccess/RepositoiesHandler";
import { product, producttype } from "@prisma/client";
import { productRepository } from "../../dataAccess/repositories/product.repository";
import { ProductCreateInput } from "../../dataAccess/models/product/product-create.input";
import { UpdateProductDto } from "../dtos/productDto/Product/UpdateProductDto";
import { ProductWithRelations } from "../../dataAccess/models/Custom Types/productWithinclude";

class ProductServices {
    public AddProduct = async (newProduct: AddProductDto) => {
        let servHandler: ServicesHandler<ProductDto | null> = new ServicesHandler();
        logger.info("Try add Product in product services");

        logger.info("change slug name");
        newProduct.slug = slugify(newProduct.name, { lower: true });


        const product_input: ProductCreateInput = {
            name: newProduct.name,
            slug: newProduct.slug,
            description: newProduct.description,
            isactive: newProduct.isactive,
            brandtype_id: newProduct.brandtype_id,
            categorytype_id: newProduct.categorytype_id,
            producttype_id: newProduct.producttype_id
        }

        logger.info("add Product To database");
        const repoRespons: RepositoiesHandler<ProductWithRelations | null> = await productRepository.AddProductToDatabase(product_input);
        if (!repoRespons.isSucceed) {
            logger.error("product Cann't Add In database", { message: repoRespons.message })
            servHandler.body = null;
            servHandler.isSucceed = false;
            servHandler.message = "There is an error, try again.";
            return servHandler;
        }


        logger.info("product add to database succssfuly");

        const product: ProductDto = {
            product_id: repoRespons.body?.product_id!,
            name: repoRespons.body?.name!,
            slug: repoRespons.body?.slug!,
            description: repoRespons.body?.description!,
            isactive: repoRespons.body?.isactive!,
            brandtype: repoRespons.body?.brandtype_id!,
            categorytype: repoRespons.body?.categorytype_id!,
            producttype: repoRespons.body?.producttype_id!,
        }
        servHandler.body = product;
        servHandler.isSucceed = true;
        servHandler.message = repoRespons.message;
        return servHandler;

    }

    public UpdateProduct = async (id: string, updateProduct: UpdateProductDto) => {
        let servHandler: ServicesHandler<ProductDto | null> = new ServicesHandler();
        logger.info("Try Update Product type in product services");

        logger.info("get Product By Id", { ProductId: id })

        const theProduct: product | null = await productRepository.GetProductById(id);
        if (theProduct === null) {
            logger.error("Not Found", { message: "Product Not Found" })
            servHandler.body = null;
            servHandler.isSucceed = false;
            servHandler.message = "Product Not Found";
            return servHandler;
        }

        logger.info("Add New Product Info")

        updateProduct.slug = slugify((updateProduct.name === "") ? theProduct.name : updateProduct.name, { lower: true });

        const product_input: ProductCreateInput = {
            name: (updateProduct.name === "") ? theProduct.name : updateProduct.name,
            slug: updateProduct.slug,
            description: (updateProduct.description === "") ? theProduct.description! : updateProduct.description!,
            isactive: (updateProduct.isactive === null) ? theProduct.isactive! : updateProduct.isactive!,
            brandtype_id: (updateProduct.brandtype_id === "") ? theProduct.brandtype_id : updateProduct.brandtype_id,
            categorytype_id: (updateProduct.categorytype_id === "") ? theProduct.categorytype_id : updateProduct.categorytype_id,
            producttype_id: (updateProduct.producttype_id === "") ? theProduct.producttype_id : updateProduct.producttype_id
        }

        logger.info("add Product To database");
        const repoRespons: RepositoiesHandler<ProductWithRelations | null> = await productRepository.UpdateProductToDatabase(id, product_input);
        if (!repoRespons.isSucceed) {
            logger.error("product Cann't Update In database", { message: repoRespons.message })
            servHandler.body = null;
            servHandler.isSucceed = false;
            servHandler.message = "There is an error, try again.";
            return servHandler;
        }

        logger.info("product Update succssfuly");

        const product: ProductDto = {
            product_id: repoRespons.body?.product_id!,
            name: repoRespons.body?.name!,
            slug: repoRespons.body?.slug!,
            description: repoRespons.body?.description!,
            isactive: repoRespons.body?.isactive!,
            brandtype: repoRespons.body?.brandtype.name!,
            categorytype: repoRespons.body?.categorytype.name!,
            producttype: repoRespons.body?.producttype.name!,
        }
        servHandler.body = product;
        servHandler.isSucceed = true;
        servHandler.message = repoRespons.message;
        return servHandler;

    }
    public DeleteProduct = async (id: string) => {
        let servHandler: ServicesHandler<ProductDto | null> = new ServicesHandler();
        logger.info("Try Delete Product type in product services");

        const isDeleted: boolean = await productRepository.DeleteProductFromDatabase(id);

        if (!isDeleted) {
            logger.error("You Can't Delete This product")
            servHandler = {
                body: null,
                isSucceed: false,
                message: "Failed to Delete ",
                refreshToken: null
            }
            return servHandler;
        }

        servHandler.body = null;
        servHandler.isSucceed = true;
        servHandler.message = "Product Delete Succssfuly";
        return servHandler;

    }
    public GetAllProduct = async () => {
        let servHandler: ServicesHandler<ProductDto[] | null> = new ServicesHandler();
        logger.info("Try Get All Product type in product services");

        logger.info("get All product Types")

        const theProducts: ProductWithRelations[] | null = await productRepository.GetProducts();
        if (theProducts === null) {
            logger.error("Not Found", { message: "Product Not Found" })
            servHandler.body = null;
            servHandler.isSucceed = false;
            servHandler.message = "Product Not Found";
            return servHandler;
        }

        const products: ProductDto[] = theProducts.map(p => ({
            product_id: p.product_id!,
            productId: p.producttype_id!,
            name: p.name!,
            slug: p.slug!,
            description: p.description!,
            isactive: p.isactive!,
            brandtype: p.brandtype.name!,
            categorytype: p.categorytype.name!,
            producttype: p.producttype.name!,
        }))

        servHandler.body = products;
        servHandler.isSucceed = true;
        servHandler.message = "Product types found Succssfuly";
        return servHandler;
    }
    public GetProductById = async (id: string) => {
        let servHandler: ServicesHandler<ProductDto | null> = new ServicesHandler();
        logger.info("Try Get Product type by Id in product services");

        logger.info("get Product By Id", { ProductId: id })

        const theProduct: ProductWithRelations | null = await productRepository.GetProductById(id);
        if (theProduct === null) {
            logger.error("Not Found", { message: "Product Not Found" })
            servHandler.body = null;
            servHandler.isSucceed = false;
            servHandler.message = "Product Not Found";
            return servHandler;
        }

        const product: ProductDto = {
            product_id: theProduct.product_id,
            name: theProduct.name,
            slug: theProduct.slug,
            description: theProduct.description!,
            isactive: theProduct.isactive!,
            brandtype: theProduct.brandtype.name,
            categorytype: theProduct.categorytype.name,
            producttype: theProduct.producttype.name,
        }

        servHandler.body = product;
        servHandler.isSucceed = true;
        servHandler.message = "Product Delete Succssfuly";
        return servHandler;
    }
}
export const productServices: ProductServices = new ProductServices();