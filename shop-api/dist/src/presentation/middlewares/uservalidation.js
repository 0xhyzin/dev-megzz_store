"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createUserValidation = exports.ValidationLoginUser = void 0;
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
