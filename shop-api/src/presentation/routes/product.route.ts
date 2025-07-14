import { Router } from "express";
import { productController } from "../controllers/product.controller";
import { upload } from '../../business/helpers/multer';

export const productRoutes: Router = Router();

productRoutes.post('/', upload.single('image'), productController.AddProduct)
productRoutes.put('/:id', upload.single('image'), productController.UpdateProduct)
productRoutes.delete('/:id', productController.DeleteProduct)
productRoutes.get('/', productController.GetProduct)
productRoutes.get('/:id', productController.GetProductById)