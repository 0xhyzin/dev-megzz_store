import { Router } from "express";
import { productTypeController } from "../controllers/productType.controller";
import { upload } from '../../business/helpers/multer';

export const productTypeRoutes: Router = Router();

productTypeRoutes.post('/', upload.single('image'), productTypeController.AddProductType)
productTypeRoutes.put('/:id', upload.single('image'), productTypeController.UpdateProductType)
productTypeRoutes.delete('/:id', productTypeController.DeleteProductType)
productTypeRoutes.get('/', productTypeController.GetProductType)
productTypeRoutes.get('/:id', productTypeController.GetProductTypeById)