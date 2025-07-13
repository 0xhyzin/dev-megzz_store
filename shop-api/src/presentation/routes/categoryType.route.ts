import { Router } from "express";
import { categoryTypeController } from "../controllers/categoryType.controller";
import { upload } from '../../business/helpers/multer';

export const categoryTypeRoutes: Router = Router();

categoryTypeRoutes.post('/', upload.single('image'), categoryTypeController.AddCategoryType)
categoryTypeRoutes.put('/:id', upload.single('image'), categoryTypeController.UpdateCategoryType)
categoryTypeRoutes.delete('/:id', categoryTypeController.DeleteCategoryType)
categoryTypeRoutes.get('/', categoryTypeController.GetCategoryType)
categoryTypeRoutes.get('/:id', categoryTypeController.GetCategoryTypeById)