import { Router } from "express";
import { productController } from "../controllers/product.controller";
import { upload } from '../../business/helpers/multer';
import { validateAddProduct, validateUpdateProduct } from '../middlewares/product.validation';
import { validateRequest } from '../middlewares/validateRequest';

export const productRoutes: Router = Router();

productRoutes.post('/', upload.single('image'), validateAddProduct, validateRequest, productController.AddProduct)
productRoutes.put('/:id', upload.single('image'), validateUpdateProduct, validateRequest, productController.UpdateProduct)
productRoutes.delete('/:id', productController.DeleteProduct)
productRoutes.get('/', productController.GetProduct)
productRoutes.get('/:id', productController.GetProductById)