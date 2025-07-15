import { Router } from "express";
import { productTypeController } from "../controllers/productType.controller";
import { upload } from '../../business/helpers/multer';
import { validateAddProductType, validateUpdateProductType } from '../middlewares/productType.validation';
import { validateRequest } from '../middlewares/validateRequest';

export const productTypeRoutes: Router = Router();

productTypeRoutes.post('/', upload.single('image'), validateAddProductType, validateRequest, productTypeController.AddProductType)
productTypeRoutes.put('/:id', upload.single('image'), validateUpdateProductType, validateRequest, productTypeController.UpdateProductType)
productTypeRoutes.delete('/:id', productTypeController.DeleteProductType)
productTypeRoutes.get('/', productTypeController.GetProductType)
productTypeRoutes.get('/:id', productTypeController.GetProductTypeById)