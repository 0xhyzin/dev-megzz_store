import { Router } from "express";
import { productController } from "../controllers/brand.controller";
import { upload } from '../../business/helpers/multer';

export const brandRoutes: Router = Router();

brandRoutes.post('/', upload.single('image'), productController.AddBrandType)
brandRoutes.put('/:id', upload.single('image'), productController.UpdateBrandType)
brandRoutes.delete('/:id', productController.DeleteBrandType)
brandRoutes.get('/', productController.GetBrandType)
brandRoutes.get('/:id', productController.GetBrandTypeById)