import express, { Express, json } from "express";
import { userRouts } from "./presentation/routes/user.route";


export const app :Express = express();
app.use(json())
app.use('/api/user',userRouts);