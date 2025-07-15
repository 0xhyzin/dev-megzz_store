import { body } from 'express-validator';

export const validateAddProduct = [
    body('name').notEmpty().withMessage('Product name is required'),
    body('description').notEmpty().withMessage('Description is required'),
    body('isActive').notEmpty().isBoolean().withMessage('isActive must be boolean'),
    body('categorytypeId').notEmpty().withMessage('CategoryType ID is required'),
    body('brandtypeId').notEmpty().withMessage('BrandType ID is required'),
    body('producttypeId').notEmpty().withMessage('ProductType ID is required'),
];

export const validateUpdateProduct = [
    body('name').notEmpty().withMessage('Product name is required'),
    body('description').notEmpty().withMessage('Description is required'),
    body('isActive').notEmpty().isBoolean().withMessage('isActive must be boolean'),
    body('categorytypeId').notEmpty().withMessage('CategoryType ID is required'),
    body('brandtypeId').notEmpty().withMessage('BrandType ID is required'),
    body('producttypeId').notEmpty().withMessage('ProductType ID is required'),
]; 