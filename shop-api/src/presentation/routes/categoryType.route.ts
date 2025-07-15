import { Router } from "express";
import { categoryTypeController } from "../controllers/categoryType.controller";
import { upload } from '../../business/helpers/multer';
import { validateAddCategoryType, validateUpdateCategoryType } from '../middlewares/categoryType.validation';
import { validateRequest } from '../middlewares/validateRequest';

export const categoryTypeRoutes: Router = Router();

categoryTypeRoutes.post('/', upload.single('image'), validateAddCategoryType, validateRequest, categoryTypeController.AddCategoryType)
categoryTypeRoutes.put('/:id', upload.single('image'), validateUpdateCategoryType, validateRequest, categoryTypeController.UpdateCategoryType)
categoryTypeRoutes.delete('/:id', categoryTypeController.DeleteCategoryType)
categoryTypeRoutes.get('/', categoryTypeController.GetCategoryType)
categoryTypeRoutes.get('/:id', categoryTypeController.GetCategoryTypeById)