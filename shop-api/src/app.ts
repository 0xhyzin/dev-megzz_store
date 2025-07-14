import express, { Express, json } from "express";
import { userRouts } from "./presentation/routes/user.route";
import { brandTypeRoutes } from "./presentation/routes/brandType.route";
import { productTypeRoutes } from "./presentation/routes/productType.route"; 
import { categoryTypeRoutes } from "./presentation/routes/categoryType.route"; 
import { productRoutes } from "./presentation/routes/product.route";


export const app: Express = express();
app.use(json())
app.use('/api/user', userRouts);

app.use('/api/brandtype', brandTypeRoutes);

app.use('/api/producttype', productTypeRoutes);

app.use('/api/categorytype', categoryTypeRoutes);

app.use('/api/product', productRoutes);
