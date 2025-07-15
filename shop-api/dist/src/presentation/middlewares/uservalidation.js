"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateUpdateProductType = exports.validateAddProductType = exports.validateUpdateProduct = exports.validateAddProduct = exports.validateUpdateCategoryType = exports.validateAddCategoryType = exports.validateUpdateBrandType = exports.validateAddBrandType = exports.validateUpdateProductVariant = exports.validateAddProductVariant = exports.createUserValidation = exports.ValidationLoginUser = void 0;
const express_validator_1 = require("express-validator");
exports.ValidationLoginUser = [
    (0, express_validator_1.body)("email")
        .notEmpty()
        .isEmail()
        .withMessage("email is required"),
    (0, express_validator_1.body)("password")
        .isLength({ min: 6 })
        .withMessage("Password is required")
        .withMessage("Password must be at least 6 characters")
];
exports.createUserValidation = [
    (0, express_validator_1.body)('firstName')
        .notEmpty().withMessage('First name is required'),
    (0, express_validator_1.body)('lastName')
        .notEmpty().withMessage('Last name is required'),
    (0, express_validator_1.body)('email')
        .notEmpty().withMessage('Email is required')
        .isEmail().withMessage('Invalid email format'),
    (0, express_validator_1.body)('password')
        .notEmpty().withMessage('Password is required')
        .isLength({ min: 8 }).withMessage('Password must be at least 8 characters long')
        .matches(/[A-Z]/).withMessage('Password must contain at least one uppercase letter')
        .matches(/[a-z]/).withMessage('Password must contain at least one lowercase letter')
        .matches(/[0-9]/).withMessage('Password must contain at least one number')
        .matches(/[@$!%*?&#]/).withMessage('Password must contain at least one special character'),
    (0, express_validator_1.body)('phone')
        .notEmpty().withMessage('Phone is required'),
];
exports.validateAddProductVariant = [
    (0, express_validator_1.body)('product_id').notEmpty().withMessage('Product ID is required'),
    (0, express_validator_1.body)('price').notEmpty().isNumeric().withMessage('Price must be a number'),
    (0, express_validator_1.body)('stock').notEmpty().isInt({ min: 0 }).withMessage('Stock must be a non-negative integer'),
    (0, express_validator_1.body)('color_name').notEmpty().withMessage('Color name is required'),
    (0, express_validator_1.body)('size_value').notEmpty().withMessage('Size value is required'),
    // images: handled by multer, but can check req.files in controller if needed
];
exports.validateUpdateProductVariant = [
    (0, express_validator_1.body)('product_id').notEmpty().withMessage('Product ID is required'),
    (0, express_validator_1.body)('price').notEmpty().isNumeric().withMessage('Price must be a number'),
    (0, express_validator_1.body)('stock').notEmpty().isInt({ min: 0 }).withMessage('Stock must be a non-negative integer'),
    (0, express_validator_1.body)('color_name').notEmpty().withMessage('Color name is required'),
    (0, express_validator_1.body)('size_value').notEmpty().withMessage('Size value is required'),
];
exports.validateAddBrandType = [
    (0, express_validator_1.body)('name').notEmpty().withMessage('Brand name is required'),
    // image: handled by multer
];
exports.validateUpdateBrandType = [
    (0, express_validator_1.body)('name').notEmpty().withMessage('Brand name is required'),
    // image: handled by multer
];
exports.validateAddCategoryType = [
    (0, express_validator_1.body)('name').notEmpty().withMessage('Category name is required'),
    // image: handled by multer
];
exports.validateUpdateCategoryType = [
    (0, express_validator_1.body)('name').notEmpty().withMessage('Category name is required'),
    // image: handled by multer
];
exports.validateAddProduct = [
    (0, express_validator_1.body)('name').notEmpty().withMessage('Product name is required'),
    (0, express_validator_1.body)('description').notEmpty().withMessage('Description is required'),
    (0, express_validator_1.body)('isActive').notEmpty().isBoolean().withMessage('isActive must be boolean'),
    (0, express_validator_1.body)('categorytypeId').notEmpty().withMessage('CategoryType ID is required'),
    (0, express_validator_1.body)('brandtypeId').notEmpty().withMessage('BrandType ID is required'),
    (0, express_validator_1.body)('producttypeId').notEmpty().withMessage('ProductType ID is required'),
];
exports.validateUpdateProduct = [
    (0, express_validator_1.body)('name').notEmpty().withMessage('Product name is required'),
    (0, express_validator_1.body)('description').notEmpty().withMessage('Description is required'),
    (0, express_validator_1.body)('isActive').notEmpty().isBoolean().withMessage('isActive must be boolean'),
    (0, express_validator_1.body)('categorytypeId').notEmpty().withMessage('CategoryType ID is required'),
    (0, express_validator_1.body)('brandtypeId').notEmpty().withMessage('BrandType ID is required'),
    (0, express_validator_1.body)('producttypeId').notEmpty().withMessage('ProductType ID is required'),
];
exports.validateAddProductType = [
    (0, express_validator_1.body)('name').notEmpty().withMessage('ProductType name is required'),
    // image: handled by multer
];
exports.validateUpdateProductType = [
    (0, express_validator_1.body)('name').notEmpty().withMessage('ProductType name is required'),
    // image: handled by multer
];
