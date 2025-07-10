import { Router } from "express";
import { userController } from "../controllers/user.controller";
import { createUserValidation, ValidationLoginUser } from "../middlewares/uservalidation";
import { validateRequest } from "../middlewares/validateRequest";

export const userRouts: Router = Router();

userRouts.post('/login', ValidationLoginUser, validateRequest, userController.LoginUser);
userRouts.post('/createaccount', createUserValidation, validateRequest, userController.CreatNewAccount);
