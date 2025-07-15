import { Router } from "express";
import { brandTypeController } from "../controllers/brandType.controller";
import { upload } from '../../business/helpers/multer';
import { validateAddBrandType, validateUpdateBrandType } from '../middlewares/brandType.validation';
import { validateRequest } from '../middlewares/validateRequest';

export const brandTypeRoutes: Router = Router();

brandTypeRoutes.post('/', upload.single('image'), validateAddBrandType, validateRequest, brandTypeController.AddBrandType)
brandTypeRoutes.put('/:id', upload.single('image'), validateUpdateBrandType, validateRequest, brandTypeController.UpdateBrandType)
brandTypeRoutes.delete('/:id', brandTypeController.DeleteBrandType)
brandTypeRoutes.get('/', brandTypeController.GetBrandType)
brandTypeRoutes.get('/:id', brandTypeController.GetBrandTypeById)