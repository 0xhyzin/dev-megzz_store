import { NextFunction, Request, Response } from 'express';
import { body } from 'express-validator';

export const validateAddProductVariant = [
    body('productId').notEmpty().withMessage('Product ID is required'),
    body('price').notEmpty().isNumeric().withMessage('Price must be a number'),
    body('stock').notEmpty().isInt({ min: 0 }).withMessage('Stock must be a non-negative integer'),
    body('colorName').notEmpty().withMessage('Color name is required'),
    body('sizeValue').notEmpty().withMessage('Size value is required'),
    // images: handled by multer, but can check req.files in controller if needed
];

export const validateUpdateProductVariant = [
    body('productId').notEmpty().withMessage('Product ID is required'),
    body('price').notEmpty().isNumeric().withMessage('Price must be a number'),
    body('stock').notEmpty().isInt({ min: 0 }).withMessage('Stock must be a non-negative integer'),
    body('colorName').notEmpty().withMessage('Color name is required'),
    body('sizeValue').notEmpty().withMessage('Size value is required'),
];

export const validateImagesPresence = (req: Request, res: Response, next: NextFunction) => {
    const files = req.files;

    if (!Array.isArray(files) || files.length < 1) {
        res.status(400).json({ message: 'At least one image is required' });
    }

    next();
};