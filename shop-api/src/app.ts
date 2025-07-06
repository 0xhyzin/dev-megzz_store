import express, { Express, Request, Response } from "express";
import { userRouts } from "./presentation/routes/user.route";

export const app :Express = express();

app.use('/api/user',userRouts);