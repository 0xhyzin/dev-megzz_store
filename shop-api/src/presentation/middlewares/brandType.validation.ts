import { body } from 'express-validator';

export const validateAddBrandType = [
    body('name').notEmpty().withMessage('Brand name is required'),
    // image: handled by multer
];

export const validateUpdateBrandType = [
    body('name').notEmpty().withMessage('Brand name is required'),
    // image: handled by multer
]; 