import express, { Express, json } from "express";
import { userRouts } from "./presentation/routes/user.route";
import { brandRoutes } from "./presentation/routes/brand.route";


export const app :Express = express();
app.use(json())
app.use('/api/user',userRouts);
app.use('/api/brand',brandRoutes)