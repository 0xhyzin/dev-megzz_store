import { Router } from "express";
import { upload } from '../../business/helpers/multer';
import { productVariantController } from "../controllers/productVariant.controller";
import { validateAddProductVariant, validateImagesPresence, validateUpdateProductVariant } from '../middlewares/productVariant.validation';
import { validateRequest } from '../middlewares/validateRequest';

export const productVariantRoutes: Router = Router();

productVariantRoutes.post('/', upload.array('images', 10), validateAddProductVariant, validateRequest,validateImagesPresence, productVariantController.AddProductVariant)
productVariantRoutes.put('/:id', upload.array('images', 10), validateUpdateProductVariant, validateRequest, productVariantController.UpdateProductVariant)
// productVariantRoutes.delete('/:id',productVariantController.DeleteProductVariant)
// productVariantRoutes.get('/',productVariantController.GetAllProductVariant)
// productVariantRoutes.get('/:id',productVariantController.GetProductVariantById)