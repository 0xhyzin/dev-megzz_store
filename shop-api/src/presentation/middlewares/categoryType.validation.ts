import { body } from 'express-validator';

export const validateAddCategoryType = [
    body('name').notEmpty().withMessage('Category name is required'),
    // image: handled by multer
];

export const validateUpdateCategoryType = [
    body('name').notEmpty().withMessage('Category name is required'),
    // image: handled by multer
]; 