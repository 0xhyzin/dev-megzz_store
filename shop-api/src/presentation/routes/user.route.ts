import { Router } from "express";
import { userController } from "../controllers/user.controller";
import { ValidationLoginUser } from "../middlewares/uservalidation";

export const userRouts :Router = Router();

userRouts.post('/login',ValidationLoginUser,userController.LoginUser);
userRouts.post('/createaccount',userController.CreatNewAccount);
