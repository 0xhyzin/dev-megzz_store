import { body } from 'express-validator';

export const validateAddProductType = [
    body('name').notEmpty().withMessage('ProductType name is required'),
    // image: handled by multer
];

export const validateUpdateProductType = [
    body('name').notEmpty().withMessage('ProductType name is required'),
    // image: handled by multer
]; 