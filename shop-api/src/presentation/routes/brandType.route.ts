import { Router } from "express";
import { brandTypeController } from "../controllers/brandType.controller";
import { upload } from '../../business/helpers/multer';

export const brandTypeRoutes: Router = Router();

brandTypeRoutes.post('/', upload.single('image'), brandTypeController.AddBrandType)
brandTypeRoutes.put('/:id', upload.single('image'), brandTypeController.UpdateBrandType)
brandTypeRoutes.delete('/:id', brandTypeController.DeleteBrandType)
brandTypeRoutes.get('/', brandTypeController.GetBrandType)
brandTypeRoutes.get('/:id', brandTypeController.GetBrandTypeById)