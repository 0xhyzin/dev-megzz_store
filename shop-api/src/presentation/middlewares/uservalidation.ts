import { NextFunction, Request, Response } from "express";
import { body, cookie, validationResult } from "express-validator";

export const ValidationLoginUser = [
    body("email")
        .notEmpty()
        .isEmail()
        .withMessage("email is required"),
    body("password")
        .isLength({ min: 6 })
        .withMessage("Password is required")
        .withMessage("Password must be at least 6 characters")
];
export const createUserValidation = [
    body('firstName')
        .notEmpty().withMessage('First name is required'),

    body('lastName')
        .notEmpty().withMessage('Last name is required'),

    body('email')
        .notEmpty().withMessage('Email is required')
        .isEmail().withMessage('Invalid email format'),

    body('password')
        .notEmpty().withMessage('Password is required')
        .isLength({ min: 8 }).withMessage('Password must be at least 8 characters long')
        .matches(/[A-Z]/).withMessage('Password must contain at least one uppercase letter')
        .matches(/[a-z]/).withMessage('Password must contain at least one lowercase letter')
        .matches(/[0-9]/).withMessage('Password must contain at least one number')
        .matches(/[@$!%*?&#]/).withMessage('Password must contain at least one special character'),

    body('phone')
        .notEmpty().withMessage('Phone is required'),
];

export const validateAddProductVariant = [
    body('product_id').notEmpty().withMessage('Product ID is required'),
    body('price').notEmpty().isNumeric().withMessage('Price must be a number'),
    body('stock').notEmpty().isInt({ min: 0 }).withMessage('Stock must be a non-negative integer'),
    body('color_name').notEmpty().withMessage('Color name is required'),
    body('size_value').notEmpty().withMessage('Size value is required'),
    // images: handled by multer, but can check req.files in controller if needed
];

export const validateUpdateProductVariant = [
    body('product_id').notEmpty().withMessage('Product ID is required'),
    body('price').notEmpty().isNumeric().withMessage('Price must be a number'),
    body('stock').notEmpty().isInt({ min: 0 }).withMessage('Stock must be a non-negative integer'),
    body('color_name').notEmpty().withMessage('Color name is required'),
    body('size_value').notEmpty().withMessage('Size value is required'),
];

export const validateAddBrandType = [
    body('name').notEmpty().withMessage('Brand name is required'),
    // image: handled by multer
];

export const validateUpdateBrandType = [
    body('name').notEmpty().withMessage('Brand name is required'),
    // image: handled by multer
];

export const validateAddCategoryType = [
    body('name').notEmpty().withMessage('Category name is required'),
    // image: handled by multer
];

export const validateUpdateCategoryType = [
    body('name').notEmpty().withMessage('Category name is required'),
    // image: handled by multer
];

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

export const validateAddProductType = [
    body('name').notEmpty().withMessage('ProductType name is required'),
    // image: handled by multer
];

export const validateUpdateProductType = [
    body('name').notEmpty().withMessage('ProductType name is required'),
    // image: handled by multer
];
